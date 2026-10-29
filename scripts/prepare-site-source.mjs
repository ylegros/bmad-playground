import { mkdir, readFile, writeFile, cp, rm } from 'node:fs/promises';
import { resolve, join, sep } from 'node:path';
import { exportSite } from './export-site.mjs';

// Copy an explicit source allowlist; local repository metadata and cache envelopes
// never enter the Site checkout. Its returned hosting identity stays in place.
export async function prepareSiteSource(destination = resolve('.site-source/pit-wall'), sourceDirectory = resolve('.')) {
  const source = resolve(sourceDirectory);
  destination = resolve(destination);
  if (source === destination || source.startsWith(destination + sep)) throw new Error('Site source must be a separate checkout.');
  const manifest = await exportSite({cacheDirectory:join(source,'.cache/seasons'),mediaDirectory:join(source,'public/media'),outputDirectory:join(source,'public/bundled')});
  const hosting = JSON.parse(await readFile(join(destination, '.openai/hosting.json'), 'utf8'));
  if (!hosting.project_id || hosting.static?.directory !== 'dist') throw new Error('Persist the returned static Site identity before preparing source.');
  for (const name of ['app/client', 'app/shared', 'index.html', 'vite.config.ts', 'package-lock.json']) {
    await mkdir(resolve(destination, name, '..'), { recursive: true });
    await cp(join(source, name), join(destination, name), { recursive: true, filter: file => !file.endsWith('.test.ts') });
  }
  // Only replace the generated public subtree in this separate checkout.
  const publicTarget = resolve(destination, 'public');
  if (!publicTarget.startsWith(destination + sep)) throw new Error('Invalid public destination.');
  await rm(publicTarget, { recursive: true, force: true });
  const credits = JSON.parse(await readFile(join(source,'public/media/credits.json'),'utf8'));
  for (const name of ['credits.json', ...credits.assets.map(asset=>asset.filename)]) {
    const target = join(publicTarget,'media',name);
    await mkdir(resolve(target,'..'),{recursive:true});
    await cp(join(source,'public/media',name),target);
  }
  const releasePath = manifest.seasons[0].assetPath.split('/').slice(0,-1).join('/');
  await mkdir(join(publicTarget,releasePath),{recursive:true});
  await cp(join(source,'public',releasePath),join(publicTarget,releasePath),{recursive:true});
  await cp(join(source,'public/bundled/manifest.json'),join(publicTarget,'bundled/manifest.json'));
  await mkdir(join(destination, 'scripts'), { recursive: true });
  await cp(join(source,'scripts/export-site.mjs'), join(destination, 'scripts/export-site.mjs'));
  await mkdir(join(destination, 'data'), { recursive: true });
  for (const entry of manifest.seasons) {
    const snapshot = await readFile(join(source, 'public', entry.assetPath), 'utf8');
    await writeFile(join(destination, 'data', `${entry.season}.json`), snapshot);
  }
  const pkg = JSON.parse(await readFile(join(source,'package.json'), 'utf8'));
  pkg.scripts = {
    build: 'node scripts/export-site.mjs --payload-dir data && tsc --noEmit && vite build --mode bundled',
    check: 'tsc --noEmit',
  };
  await writeFile(join(destination, 'package.json'), JSON.stringify(pkg, null, 2) + '\n');
  const tsconfig = JSON.parse(await readFile(join(source,'tsconfig.json'), 'utf8'));
  tsconfig.include = ['app/client', 'app/shared', 'vite.config.ts'];
  await writeFile(join(destination, 'tsconfig.json'), JSON.stringify(tsconfig, null, 2) + '\n');
  await writeFile(join(destination, '.gitignore'), 'node_modules/\ndist/\n*.log\n.env*\n');
  await writeFile(join(destination, 'README.md'), '# F1 Pit Wall bundled snapshot\n\nRun `npm install` then `npm run build`. The default build validates sanitized 2010/2021 payloads and media before compiling the bundled client. No local API or raw cache is required. Source timestamps describe data freshness; export/publication time is separate.\n');
  return { destination, seasons: manifest.seasons.map(s => s.season), project_id: hosting.project_id };
}
if (process.argv[1]?.endsWith('prepare-site-source.mjs')) console.info(JSON.stringify(await prepareSiteSource()));
