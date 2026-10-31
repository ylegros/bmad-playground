import { mkdir, readFile, writeFile, cp, rm } from 'node:fs/promises';
import { resolve, join, sep } from 'node:path';
import { exportSite } from './export-site.mjs';

// Copy an explicit source allowlist; local repository metadata and cache envelopes
// never enter the Site checkout. Its returned hosting identity stays in place.
export async function prepareSiteSource(destination = resolve('.site-source/pit-wall'), sourceDirectory = resolve('.'), {iterationThree=false,bundleDirectory} = {}) {
  const source = resolve(sourceDirectory);
  destination = resolve(destination);
  if (source === destination || source.startsWith(destination + sep)) throw new Error('Site source must be a separate checkout.');
  bundleDirectory=resolve(bundleDirectory??join(source,'public/bundled'));
  if(bundleDirectory===join(destination,'public/bundled') || bundleDirectory.startsWith(join(destination,'public')+sep)) throw new Error('Bundle staging must be outside the replaced public subtree.');
  const hosting = JSON.parse(await readFile(join(destination, '.openai/hosting.json'), 'utf8'));
  if (!hosting.project_id || hosting.static?.directory !== 'dist') throw new Error('Persist the returned static Site identity before preparing source.');
  const manifest = await exportSite({cacheDirectory:join(source,iterationThree?'.cache/seasons-v2':'.cache/seasons'),mediaDirectory:join(source,'public/media'),outputDirectory:bundleDirectory,iterationThree,evidenceDirectory:source});
  for (const name of ['app/client', 'app/shared', 'index.html', 'vite.config.ts', 'package-lock.json']) {
    await mkdir(resolve(destination, name, '..'), { recursive: true });
    await cp(join(source, name), join(destination, name), { recursive: true, filter: file => !file.endsWith('.test.ts') });
  }
  // Only replace the generated public subtree in this separate checkout.
  const publicTarget = resolve(destination, 'public');
  if (!publicTarget.startsWith(destination + sep)) throw new Error('Invalid public destination.');
  await rm(publicTarget, { recursive: true, force: true });
  const releasePath = manifest.seasons[0].assetPath.split('/').slice(0,-1).join('/');
  const releaseDirectory=join(bundleDirectory,'releases',manifest.seasons[0].assetPath.split('/')[2]);
  await mkdir(join(publicTarget,releasePath),{recursive:true});
  await cp(releaseDirectory,join(publicTarget,releasePath),{recursive:true});
  await cp(join(releaseDirectory,'media'),join(publicTarget,'media'),{recursive:true});
  await cp(join(bundleDirectory,'manifest.json'),join(publicTarget,'bundled/manifest.json'));
  await mkdir(join(destination, 'scripts'), { recursive: true });
  await cp(join(source,'scripts/export-site.mjs'), join(destination, 'scripts/export-site.mjs'));
  {
    await cp(join(source,'scripts/media-inventory.mjs'),join(destination,'scripts/media-inventory.mjs'));
    const investigations=JSON.parse(await readFile(join(publicTarget,'media/investigations.json'),'utf8'));
    for (const item of investigations) {
      await mkdir(resolve(destination,item.visualEvidence,'..'),{recursive:true});
      await cp(join(publicTarget,'media/evidence',item.visualEvidence),join(destination,item.visualEvidence));
      const metadata=join(item.visualEvidence,'..','metadata.json');
      try { await cp(join(publicTarget,'media/evidence',metadata),join(destination,metadata)); } catch(error) { if(error.code !== 'ENOENT') throw error; }
    }
  }
  await mkdir(join(destination, 'data'), { recursive: true });
  for (const entry of manifest.seasons) {
    const snapshot = await readFile(join(releaseDirectory,`${entry.season}.json`), 'utf8');
    await writeFile(join(destination, 'data', `${entry.season}.json`), snapshot);
  }
  const sourcePackage = JSON.parse(await readFile(join(source,'package.json'), 'utf8'));
  const pkg = Object.fromEntries(['name','version','private','type','engines','dependencies','devDependencies'].filter(key=>key in sourcePackage).map(key=>[key,sourcePackage[key]]));
  pkg.scripts = {
    build: `node scripts/export-site.mjs --payload-dir data${iterationThree?' --iteration-three':''} && tsc --noEmit && vite build --mode bundled`,
    check: 'tsc --noEmit',
  };
  await writeFile(join(destination, 'package.json'), JSON.stringify(pkg, null, 2) + '\n');
  const tsconfig = JSON.parse(await readFile(join(source,'tsconfig.json'), 'utf8'));
  tsconfig.include = ['app/client', 'app/shared', 'vite.config.ts'];
  await writeFile(join(destination, 'tsconfig.json'), JSON.stringify(tsconfig, null, 2) + '\n');
  await writeFile(join(destination, '.gitignore'), 'node_modules/\ndist/\n*.log\n.env*\n');
  await writeFile(join(destination, 'README.md'), '# F1 Pit Wall bundled snapshot\n\nRun `npm install` then `npm run build`. The default build validates sanitized 2010/2021 payloads and media before compiling the bundled client. No local API or raw cache is required. Source timestamps describe data freshness; export/publication time is separate.\n');
  if(iterationThree) await writeFile(join(destination,'README.md'),'# F1 Pit Wall iteration-three bundled snapshot\n\nRun `npm install` then `npm run build`. The build validates all 17 sanitized 2010–2026 v2 payloads, credited media and inventories before compiling the static client. Install the Playwright Chromium browser for image integrity validation. Source freshness is separate from export time. Investigated exceptions retain their pending user acceptance; source preparation does not approve them or publish the Site.\n');
  return { destination, seasons: manifest.seasons.map(s => s.season), project_id: hosting.project_id };
}
if (process.argv[1]?.endsWith('prepare-site-source.mjs')) console.info(JSON.stringify(await prepareSiteSource(undefined,undefined,{iterationThree:process.argv.includes('--iteration-three')})));
