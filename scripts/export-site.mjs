import { readFile, writeFile, mkdir, rename, rm, cp, stat, readdir } from 'node:fs/promises';
import { resolve, join, dirname, relative } from 'node:path';
import { createHash, randomUUID } from 'node:crypto';
import { pathToFileURL } from 'node:url';
import { validSnapshot, validBundledManifest, validBundledSnapshot, supportedSeasons, validAssetPath, calendarDate, utcTimestamp } from '../app/shared/validation.ts';
import { candidateSeasons, validSnapshotV2, supportEntryV2, validBundledManifestV2, validBundledSnapshotV2 } from '../app/shared/evidence.ts';

const checksum = value => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const readJson = async path => JSON.parse(await readFile(path, 'utf8'));
const pick = (record, fields) => Object.fromEntries(fields.map(field => [field, record[field]]));
const publicMetric = metric => metric.kind === 'value' ? pick(metric, ['kind','value']) : pick(metric, ['kind','reason']);
// Never forward storage metadata or unknown provider fields into public payloads.
export function publicSnapshot(snapshot) {
  const rows = (field, fields, metrics = []) => snapshot[field].map(row => ({...pick(row, fields), ...Object.fromEntries(metrics.map(key => [key, publicMetric(row[key])]))}));
  return {...pick(snapshot, ['schemaVersion','snapshotId','season','refreshedAt']),
    coverage: {checkedRounds: [...snapshot.coverage.checkedRounds], gaps: [...snapshot.coverage.gaps]},
    schedule: rows('schedule', ['round','name','date','gp','sprint','qualifying']),
    drivers: Object.fromEntries(Object.entries(snapshot.drivers).map(([id, driver]) => [id, pick(driver, ['id','name','code','nationality'])])),
    constructors: Object.fromEntries(Object.entries(snapshot.constructors).map(([id, team]) => [id, pick(team, ['id','name','nationality'])])),
    results: rows('results', ['round','kind','driverId','constructorId','classification','status'], ['position','points']),
    qualifying: rows('qualifying', ['round','driverId','constructorId'], ['position']),
    driverStandings: rows('driverStandings', ['round','driverId','constructorIds'], ['position','points']),
    constructorStandings: rows('constructorStandings', ['round','constructorId'], ['position','points'])};
}
const publicProvenance = rows => rows.map(row => pick(row,['sourceUrl','observedAt','note']));
const publicSlot = row => pick(row,row.status === 'exception' ? ['kind','identity','season','status','attemptedSources','blocker','visualCheck','visualEvidence','reviewedAt','acceptance'] : ['kind','identity','season','status','filename','sourceUrl','creator','license','licenseUrl','attribution','applicableSeasons','photographDate','cropNotes','visualCheck','sha256','bytes','width','height']);
export function publicSnapshotV2(snapshot) {
  const clean = publicSnapshot(snapshot);
  const audit = pick(snapshot.audit,['auditId','auditedAt','status','failures']);
  audit.provenance = publicProvenance(snapshot.audit.provenance);
  audit.completion = publicProvenance(snapshot.audit.completion);
  audit.endpoints = snapshot.audit.endpoints.map(row => pick(row,['sourceUrl','expectedPages','fetchedPages']));
  if (snapshot.audit.migration) audit.migration = pick(snapshot.audit.migration,['fromSchemaVersion','snapshotId','migratedAt']);
  return {...clean,lifecycle:snapshot.lifecycle,analysisRounds:[...snapshot.analysisRounds],audit,
    schedule:clean.schedule.map((row,i) => ({...row,sessions:Object.fromEntries(['gp','qualifying','sprint'].map(kind => {
      const session=snapshot.schedule[i].sessions[kind];
      return [kind,{...pick(session,['applicable','lifecycle']),provenance:publicProvenance(session.provenance)}];
    }))}))};
}
function validCredits(credits, snapshots) {
  const text = value => typeof value === 'string' && !!value.trim();
  const url = value => { try { return text(value) && ['http:','https:'].includes(new URL(value).protocol); } catch { return false; } };
  const identity = (entry, season) => snapshots.some(snapshot=>snapshot.season===season) && ['portrait','constructor'].includes(entry.kind) && text(entry.identity) &&
    !!snapshots.find(snapshot => snapshot.season === season)?.[entry.kind === 'portrait' ? 'drivers' : 'constructors'][entry.identity];
  const valid = !!credits && Array.isArray(credits.assets) && Array.isArray(credits.fallbacks) &&
    new Set(credits.assets.map(asset => asset?.filename)).size === credits.assets.length &&
    credits.assets.every(asset => !!asset && Array.isArray(asset.seasons) && asset.seasons.length > 0 && new Set(asset.seasons).size === asset.seasons.length && asset.seasons.every(season => identity(asset, season)) &&
      validAssetPath(`media/${asset.filename}`) && !asset.filename.startsWith('media/') && url(asset.sourceUrl) && text(asset.creator) && text(asset.license) && url(asset.licenseUrl) && text(asset.attribution) && text(asset.cropNotes) && (asset.portraitDate === 'unknown' || calendarDate(asset.portraitDate))) &&
    credits.fallbacks.every(entry => !!entry && identity(entry, entry.season) && text(entry.reason));
  if (!valid) return false;
  const key = (kind, identity, season) => JSON.stringify([kind, identity, season]);
  const slots = [...credits.assets.flatMap(asset => asset.seasons.map(season => key(asset.kind, asset.identity, season))),
    ...credits.fallbacks.map(entry => key(entry.kind, entry.identity, entry.season))];
  const expected = snapshots.flatMap(snapshot => [...Object.keys(snapshot.drivers).map(id => key('portrait', id, snapshot.season)),
    ...Object.keys(snapshot.constructors).map(id => key('constructor', id, snapshot.season))]);
  const unique = new Set(slots);
  return unique.size === slots.length && slots.length === expected.length && expected.every(slot => unique.has(slot));
}
function legacyCredits(raw) {
  const text=v=>typeof v==='string' && !!v.trim();
  const url=v=>{try{return text(v)&&['http:','https:'].includes(new URL(v).protocol);}catch{return false;}};
  const identity=row=>row && ['portrait','constructor'].includes(row.kind) && text(row.identity);
  if (!raw || !Array.isArray(raw.assets) || !Array.isArray(raw.fallbacks) ||
    raw.assets.some(a=>!identity(a)||!Array.isArray(a.seasons)||!a.seasons.length||new Set(a.seasons).size!==a.seasons.length||a.seasons.some(y=>!candidateSeasons.includes(y))||!validAssetPath(`media/${a.filename}`)||a.filename.startsWith('media/')||![a.creator,a.license,a.attribution,a.cropNotes].every(text)||!url(a.sourceUrl)||!url(a.licenseUrl)||!(a.portraitDate==='unknown'||calendarDate(a.portraitDate))) ||
    raw.fallbacks.some(row=>!identity(row)||!candidateSeasons.includes(row.season)||!text(row.reason)) || new Set(raw.assets.map(a=>a.filename)).size!==raw.assets.length) throw new Error('Invalid media credits or provenance.');
  const slots=[...raw.assets.flatMap(a=>a.seasons.map(y=>`${y}/${a.kind}/${a.identity}`)),...raw.fallbacks.map(a=>`${a.season}/${a.kind}/${a.identity}`)];
  if(new Set(slots).size!==slots.length)throw new Error('Invalid media credits or provenance: duplicate slot.');
  return {assets:raw.assets.map(a=>({...a,seasons:a.seasons.filter(y=>supportedSeasons.includes(y))})).filter(a=>a.seasons.length),fallbacks:raw.fallbacks.filter(a=>supportedSeasons.includes(a.season))};
}
function validInvestigations(rows) {
  const text=v=>typeof v==='string' && !!v.trim();
  const url=v=>{try{return text(v)&&['http:','https:'].includes(new URL(v).protocol);}catch{return false;}};
  return Array.isArray(rows) && new Set(rows.map(row=>`${row?.season}/${row?.kind}/${row?.identity}`)).size===rows.length && rows.every(row=>row && candidateSeasons.includes(row.season) && ['portrait','constructor'].includes(row.kind) && text(row.identity) && row.status==='exception' && Array.isArray(row.attemptedSources) && row.attemptedSources.length && row.attemptedSources.every(url) && text(row.blocker) && row.blocker.trim().length>=32 && !/^(not vetted|unavailable|missing|no image|fallback)[.! ]*$/i.test(row.blocker.trim()) && text(row.visualCheck) && validAssetPath(row.visualEvidence) && utcTimestamp(row.reviewedAt) && (row.acceptance===undefined || text(row.acceptance)));
}
async function matchingRelease(staged, existing) {
  const expected = await readdir(staged, {withFileTypes:true});
  const actual = await readdir(existing, {withFileTypes:true});
  if (expected.length !== actual.length) return false;
  for (const entry of expected) {
    const other = actual.find(candidate => candidate.name === entry.name);
    if (!other || other.isSymbolicLink() || entry.isDirectory() !== other.isDirectory() || entry.isFile() !== other.isFile()) return false;
    if (entry.isDirectory() ? !await matchingRelease(join(staged,entry.name),join(existing,entry.name)) : !(await readFile(join(staged,entry.name))).equals(await readFile(join(existing,entry.name)))) return false;
  }
  return true;
}
export async function exportSite({ cacheDirectory, payloadDirectory, mediaDirectory = resolve('public/media'), outputDirectory = resolve('public/bundled'), exportedAt = new Date().toISOString(), iterationThree = false, evidenceDirectory = resolve('.') } = {}) {
  cacheDirectory ??= resolve(iterationThree ? '.cache/seasons-v2' : '.cache/seasons');
  const snapshots = [];
  for (const year of iterationThree ? candidateSeasons : supportedSeasons) {
    const raw = await readJson(join(payloadDirectory ?? cacheDirectory, `${year}.json`)).catch(error => { throw new Error(`Missing or unreadable snapshot for ${year}: ${error.message}`); });
    const snapshot = payloadDirectory ? raw : raw?.snapshot;
    if (!payloadDirectory && (typeof raw?.checksum !== 'string' || raw.checksum !== checksum(snapshot))) throw new Error(`Cache checksum mismatch for ${year}.`);
    if (iterationThree ? (!validSnapshotV2(snapshot,year) || snapshot.audit.status !== 'verified') : (!validSnapshot(snapshot, year) || !snapshot.snapshotId.trim() || snapshot.coverage.gaps.length)) throw new Error(`Unverified or invalid snapshot for ${year}.`);
    snapshots.push(iterationThree ? publicSnapshotV2(snapshot) : publicSnapshot(snapshot));
  }
  const sourceCredits = await readJson(join(mediaDirectory, 'credits.json'));
  const rawCredits = iterationThree ? sourceCredits : legacyCredits(sourceCredits);
  if (!validCredits(rawCredits, snapshots)) throw new Error('Invalid media credits or provenance.');
  const credits = {assets:rawCredits.assets.map(asset => pick(asset,['kind','identity','seasons','filename','sourceUrl','creator','license','licenseUrl','attribution','portraitDate','cropNotes'])),fallbacks:rawCredits.fallbacks.map(entry => pick(entry,['kind','identity','season','reason']))};
  const mediaFiles = [];
  {
    const { inventoryMedia } = await import('./media-inventory.mjs');
    const sourceInvestigations = await readJson(join(mediaDirectory,'investigations.json'));
    if(!validInvestigations(sourceInvestigations)) throw new Error('Invalid media investigations.');
    if(sourceInvestigations.some(row=>sourceCredits.assets.some(asset=>asset.kind===row.kind && asset.identity===row.identity && asset.seasons.includes(row.season)))) throw new Error('Invalid media investigations: duplicate mapped slot.');
    const investigations = sourceInvestigations.filter(row=>iterationThree || supportedSeasons.includes(row.season)).map(publicSlot);
    const rawInventory = await readJson(join(mediaDirectory,'inventory.json'));
    if(rawInventory.inventoryVersion!==2 || !utcTimestamp(rawInventory.checkedAt) || !Array.isArray(rawInventory.coverage) || !Array.isArray(rawInventory.slots)) throw new Error('Invalid declared media inventory.');
    const savedInventory = {...pick(rawInventory,['inventoryVersion','checkedAt']),coverage:rawInventory.coverage.map(row=>pick(row,['season','kind','total','actual','exceptions','unresolved'])),slots:rawInventory.slots.map(publicSlot)};
    const checked = await inventoryMedia({snapshots,credits,investigations,mediaDirectory,evidenceDirectory,strict:iterationThree,checkedAt:rawInventory.checkedAt});
    if (iterationThree && (JSON.stringify(savedInventory.coverage) !== JSON.stringify(checked.coverage) || JSON.stringify(savedInventory.slots) !== JSON.stringify(checked.slots.map(publicSlot)))) throw new Error('Saved media inventory does not match validated slots, provenance or file bytes.');
    const inventory=iterationThree?{...savedInventory,scope:checked.scope}:checked;
    for (const [path,value] of [['inventory.json',inventory],['investigations.json',investigations]]) mediaFiles.push({path,bytes:Buffer.from(JSON.stringify(value,null,2))});
    for (const item of investigations) {
      if (!validAssetPath(item.visualEvidence)) throw new Error(`Invalid visual evidence for ${item.season}/${item.identity}`);
      mediaFiles.push({path:`evidence/${item.visualEvidence}`,bytes:await readFile(resolve(evidenceDirectory,item.visualEvidence))});
      const metadata=join(dirname(item.visualEvidence),'metadata.json');
      try {
        const raw=await readJson(resolve(evidenceDirectory,metadata));
        const clean={observedAt:raw.observedAt,records:raw.records.map(row=>({...pick(row,['title','filename']),info:{...pick(row.info,['url','thumburl','descriptionurl','descriptionshorturl']),extmetadata:Object.fromEntries(['Artist','LicenseShortName','LicenseUrl','Credit','AttributionRequired','Copyrighted','UsageTerms'].filter(key=>row.info.extmetadata?.[key]).map(key=>[key,pick(row.info.extmetadata[key],['value'])]))}}))};
        mediaFiles.push({path:`evidence/${metadata}`,bytes:Buffer.from(JSON.stringify(clean,null,2))});
      } catch(error) { if(error.code !== 'ENOENT') throw error; }
    }
  }
  for (const asset of credits.assets) {
    const filename = asset.filename;
    const path = typeof filename === 'string' ? filename.replace(/^\/?media\//, '') : '';
    if (!validAssetPath(`media/${path}`) || typeof asset.sourceUrl !== 'string' || !asset.sourceUrl || typeof asset.creator !== 'string' || !asset.creator || typeof asset.license !== 'string' || !asset.license || typeof asset.attribution !== 'string') throw new Error('Media asset has invalid provenance or filename.');
    const input = resolve(mediaDirectory, path);
    if (relative(resolve(mediaDirectory), input).startsWith('..') || !(await stat(input)).isFile()) throw new Error('Missing or unsafe media asset.');
    mediaFiles.push({ path, bytes: await readFile(input) });
  }
  // Release IDs include media bytes, not just filenames, so replaced assets never reuse stale URLs.
  const identity = createHash('sha256').update(JSON.stringify(snapshots)).update(JSON.stringify(credits));
  for (const file of mediaFiles) identity.update(file.bytes);
  const releaseId = identity.digest('hex').slice(0, 24);
  const manifest = iterationThree ? {bundleVersion:2,exportedAt,seasons:snapshots.map(snapshot => ({...supportEntryV2(snapshot),assetPath:`bundled/releases/${releaseId}/${snapshot.season}.json`}))} : { bundleVersion: 1, exportedAt, seasons: snapshots.map(snapshot => ({ season: snapshot.season, verified: true, lastCheckedRound: Math.max(...snapshot.coverage.checkedRounds), knownGaps: [], snapshotId: snapshot.snapshotId, schemaVersion: snapshot.schemaVersion, refreshedAt: snapshot.refreshedAt, assetPath: `bundled/releases/${releaseId}/${snapshot.season}.json` })) };
  if (!(iterationThree ? validBundledManifestV2(manifest) : validBundledManifest(manifest)) || !snapshots.every((snapshot, index) => (iterationThree ? validBundledSnapshotV2 : validBundledSnapshot)(snapshot, manifest.seasons[index]))) throw new Error('Invalid bundle identity or metadata.');
  const output = resolve(outputDirectory);
  const staging = join(dirname(output), `.bundle-stage-${randomUUID()}`);
  const manifestTemp = join(output, `.manifest-${randomUUID()}.tmp`);
  try {
    await mkdir(join(staging, 'media'), { recursive: true });
    for (const snapshot of snapshots) await writeFile(join(staging, `${snapshot.season}.json`), JSON.stringify(snapshot));
    await writeFile(join(staging, 'media/credits.json'), JSON.stringify(credits, null, 2));
    for (const file of mediaFiles) { await mkdir(dirname(join(staging, 'media', file.path)), { recursive: true }); await writeFile(join(staging, 'media', file.path), file.bytes); }
    await mkdir(join(output, 'releases'), { recursive: true });
    const release = join(output, 'releases', releaseId);
    let exists = false;
    try { await stat(release); exists = true; } catch (error) { if (error.code !== 'ENOENT') throw error; }
    if (exists) {
      if (!await matchingRelease(staging, release)) throw new Error('Existing immutable release is corrupt or incomplete; publication rejected.');
    } else await rename(staging, release);
    await writeFile(manifestTemp, JSON.stringify(manifest, null, 2));
    // The sole publishable pointer changes only after all payloads and media exist.
    await rename(manifestTemp, join(output, 'manifest.json'));
    return manifest;
  } finally {
    await rm(staging, { recursive: true, force: true });
    await rm(manifestTemp, { force: true });
  }
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const args = process.argv.slice(2); const options = {};
  const names = { '--cache-dir': 'cacheDirectory', '--payload-dir': 'payloadDirectory', '--media-dir': 'mediaDirectory', '--output-dir': 'outputDirectory', '--evidence-dir':'evidenceDirectory' };
  for (let index = 0; index < args.length; index += 2) {
    if (args[index] === '--iteration-three') { options.iterationThree=true; index--; continue; }
    const key = names[args[index]];
    if (!key || !args[index + 1]) throw new Error(`Invalid exporter argument: ${args[index]}`);
    options[key] = resolve(args[index + 1]);
  }
  const manifest = await exportSite(options);
  console.info(`Exported verified seasons ${manifest.seasons.map(season => season.season).join(', ')} at ${manifest.exportedAt}.`);
}
