import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import {validSnapshotV2} from '../app/shared/evidence.ts';
import {snapshotChecksum} from '../app/server/service.ts';

const args=process.argv.slice(2);
if(args.shift()!=='--run'||!args.length||args.some(value=>!/^20(?:1\d|2[0-6])$/.test(value)))throw new Error('Explicit operator use: node scripts/resume-season-audits.mjs --run YEAR [YEAR...] (2010-2026)');
const years=[...new Set(args.map(Number))];
const read=async path=>JSON.parse(await readFile(path,'utf8'));
const run=(script,values=[])=>{const result=spawnSync(process.execPath,[script,...values.map(String)],{encoding:'utf8'});process.stdout.write(result.stdout??'');process.stderr.write(result.stderr??'');return result.status===0;};
const results=[];
await mkdir('_bmad-output/implementation-artifacts/iteration-three/data',{recursive:true});
const save=()=>writeFile('_bmad-output/implementation-artifacts/iteration-three/data/operator-run.json',JSON.stringify({updatedAt:new Date().toISOString(),years,results},null,2)+'\n');
async function waitForBudget(){
  let announced=false;
  for(;;){
    const ledger=await read('.cache/iteration-three/provider-budget.json');
    if(ledger.version!==1||!Array.isArray(ledger.attempts)||ledger.attempts.some(time=>!Number.isFinite(time)))throw new Error('Invalid provider ledger; refusing to reset budget');
    const active=ledger.attempts.filter(time=>time>=Date.now()-3_600_000).sort((a,b)=>a-b);
    if(active.length<450)return;
    const resumeAt=active[0]+3_600_001;
    if(!announced){console.log(JSON.stringify({status:'waiting-rate-budget',resumeAt:new Date(resumeAt).toISOString()}));announced=true;}
    await new Promise(resolve=>setTimeout(resolve,Math.min(30_000,Math.max(1000,resumeAt-Date.now()))));
  }
}
for(const year of years){
  try{
    const cached=await read(`.cache/seasons-v2/${year}.json`);
    const report=await read(`_bmad-output/implementation-artifacts/iteration-three/data/${year}.json`);
    if(cached.checksum===snapshotChecksum(cached.snapshot)&&validSnapshotV2(cached.snapshot,year)&&cached.snapshot.audit.status==='verified'&&report.status==='verified'&&report.snapshotId===cached.snapshot.snapshotId){results.push({year,status:'already-audited',snapshotId:cached.snapshot.snapshotId});await save();continue;}
  }catch{/* Missing or invalid generation needs the explicit acquisition/audit below. */}
  for(;;){
    await waitForBudget();
    if(run('scripts/acquire-standings-pages.mjs',[year]))break;
    const report=await read(`.cache/iteration-three/acquisition/${year}-standings.json`);
    if(report.failures?.some(failure=>failure.code==='RATE_BUDGET'))continue;
    results.push({year,status:'source-acquisition-failed',failures:report.failures});await save();
    throw new Error(`Source acquisition failed for ${year}; saved pages and good releases retained`);
  }
  if(!run('app/server/audit.ts',[year])){results.push({year,status:'audit-failed'});await save();throw new Error(`Independent audit failed for ${year}; inspect per-year report`);}
  const cached=await read(`.cache/seasons-v2/${year}.json`);results.push({year,status:'audited',snapshotId:cached.snapshot.snapshotId});await save();
  run('scripts/report-season-audits.mjs');
}
console.log(JSON.stringify({status:'source-audits-finished-not-release-acceptance',results}));
