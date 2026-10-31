import { readdir, readFile, mkdir, writeFile } from 'node:fs/promises';
import { isRetirement } from '../app/shared/comparison.ts';

const statuses = new Map();
for (const file of await readdir('.cache/iteration-three/provider')) {
  if (!file.endsWith('.json')) continue;
  const page = JSON.parse(await readFile(`.cache/iteration-three/provider/${file}`,'utf8'));
  if (!/\/results\.json\?/.test(page.sourceUrl)) continue;
  for (const race of page.payload?.MRData?.RaceTable?.Races??[]) for (const result of race.Results??[]) {
    const key = `${race.season}/${result.status}`;
    const entry=statuses.get(key)??{season:Number(race.season),status:result.status,retirement:isRetirement(result.status)??'unmapped-unavailable',records:0,sourceUrl:page.sourceUrl,observedAt:page.observedAt};
    entry.records++;statuses.set(key,entry);
  }
}
const entries=[...statuses.values()].sort((a,b)=>a.season-b.season||a.status.localeCompare(b.status));
await mkdir('_bmad-output/implementation-artifacts/iteration-three/data',{recursive:true});
await writeFile('_bmad-output/implementation-artifacts/iteration-three/data/source-statuses.json',JSON.stringify(entries,null,2)+'\n');
console.log(JSON.stringify(entries.filter(entry=>entry.retirement==='unmapped-unavailable'),null,2));
