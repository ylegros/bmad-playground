import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
const baseline='7d91d16c390f8286d6cbbec5e47a36aab4b1f12d';
const paths=['app','scripts','tests','package.json','playwright.config.ts','playwright.audit.config.ts','playwright.hosted.config.ts'];
const run=args=>{const result=spawnSync('git',args,{encoding:'utf8'});if(result.status!==0)throw new Error(result.stderr);return result.stdout;};
let diff=run(['diff',baseline,'--',...paths]);
for(const path of run(['ls-files','--others','--exclude-standard','--',...paths]).split(/\r?\n/).filter(Boolean)){
  if(/app\/fixtures\/iteration-three\/(calendar-evidence|audited-calendars)\//.test(path))continue;
  const text=readFileSync(path,'utf8');
  diff+=`\ndiff --git a/${path} b/${path}\nnew file mode 100644\n--- /dev/null\n+++ b/${path}\n@@ -0,0 +1,${text.split('\n').length} @@\n`+text.split('\n').map(line=>'+'+line).join('\n')+'\n';
}
const filename=join(tmpdir(),'bmad-iteration-three-core-review.diff');writeFileSync(filename,diff);console.log(filename);console.log(`${Buffer.byteLength(diff)} bytes`);
