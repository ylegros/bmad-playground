import { SnapshotService, candidateSeasons } from './service.ts';
const service = new SnapshotService();
for (const season of candidateSeasons) {
  const snapshot = await service.get(season);
  console.log(JSON.stringify({ season, rounds: snapshot.schedule.length, results: snapshot.results.length, qualifying: snapshot.qualifying.length, gaps: snapshot.coverage.gaps }));
}
console.log(JSON.stringify(await service.manifest(), null, 2));
