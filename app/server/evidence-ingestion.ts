import { randomUUID } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import type { EvidenceProvenance, RaceRoundV2, SeasonSnapshotV2 } from '../shared/contracts.ts';
import { analysisWindow, validSnapshotV2 } from '../shared/evidence.ts';
import { utcTimestamp } from '../shared/validation.ts';
import { buildSnapshot, DataError } from './jolpica.ts';
import { providerCache, type ProviderPage } from './provider-cache.ts';

// Reviewed calendar input is separate from research notes. No adapter silently
// upgrades research-only fixtures or invents cancellation/completion evidence.
export interface AuditedCalendar {
  season: number; lifecycle: 'ongoing' | 'complete';
  provenance: EvidenceProvenance[]; completion: EvidenceProvenance[];
  schedule: Pick<RaceRoundV2, 'round' | 'date' | 'sessions'>[];
}
export async function buildAuditedSnapshot(season: number, calendar: AuditedCalendar,
  source: { fetchPage: (url: string) => Promise<Record<string, any>>; observations: Map<string, ProviderPage> }): Promise<SeasonSnapshotV2> {
  if (calendar.season !== season || !Array.isArray(calendar.schedule) || !calendar.schedule.length ||
      calendar.schedule.some(r => !r.sessions || Object.values(r.sessions).some(s => !s || s.lifecycle === 'unknown')))
    throw new DataError('AUDIT_EVIDENCE', 'Independent complete session lifecycle evidence is required.');
  const observations = new Map<string, ProviderPage>();
  const base = await buildSnapshot(season, async url => {
    const payload = await source.fetchPage(url);
    const observation = source.observations.get(url);
    if (!observation || observation.sourceUrl !== url || !utcTimestamp(observation.observedAt)) throw new DataError('AUDIT_PROVENANCE', `Missing page observation: ${url}`);
    observations.set(url, observation);
    return payload;
  }, { rounds: calendar.schedule.length, sprints: calendar.schedule.filter(r => r.sessions.sprint.applicable).map(r => r.round), heldRounds: calendar.schedule.filter(r => r.sessions.gp.lifecycle === 'held').map(r => r.round) });
  const schedule = base.schedule.map(r => {
    const evidence = calendar.schedule.find(e => e.round === r.round);
    if (!evidence || evidence.date !== r.date) throw new DataError('AUDIT_CALENDAR', `Independent date/round mismatch: ${r.round}`);
    return { ...r, sessions: structuredClone(evidence.sessions) };
  });
  const endpoints = new Map<string, { sourceUrl: string; expectedPages: number; fetchedPages: number }>();
  for (const page of observations.values()) {
    const url = new URL(page.sourceUrl); url.searchParams.delete('offset');
    const key = url.toString(); const mr = page.payload.MRData;
    const expectedPages = Math.max(1, Math.ceil(Number(mr.total) / Number(mr.limit)));
    const entry = endpoints.get(key) ?? { sourceUrl: key, expectedPages, fetchedPages: 0 };
    if (entry.expectedPages !== expectedPages) throw new DataError('AUDIT_PAGINATION', 'Page inventory changed.');
    entry.fetchedPages++; endpoints.set(key, entry);
  }
  const snapshot: SeasonSnapshotV2 = { ...base, schemaVersion: 2, schedule,
    lifecycle: calendar.lifecycle, analysisRounds: [],
    // Source freshness is the oldest page in this generation, never audit time.
    refreshedAt: [...observations.values()].map(p => p.observedAt).sort()[0],
    audit: { auditId: randomUUID(), auditedAt: new Date().toISOString(), status: 'verified',
      provenance: [...calendar.provenance, ...[...observations.values()].map(p => ({ sourceUrl: p.sourceUrl, observedAt: p.observedAt, note: 'Validated saved provider page; original observation retained.' }))],
      endpoints: [...endpoints.values()], failures: [], completion: calendar.completion } };
  snapshot.analysisRounds = analysisWindow(snapshot);
  // Standings returned for an unheld round are contradictory, not filtered away.
  snapshot.coverage.gaps = [];
  for (const r of snapshot.schedule) {
    for (const kind of ['gp', 'qualifying', 'sprint'] as const) if (r.sessions[kind].lifecycle === 'held' && r[kind] === 'unavailable') snapshot.coverage.gaps.push(`Round ${r.round}: ${kind} successful-empty source gap`);
    if(r.sessions.gp.lifecycle==='held')for(const [kind,rows] of [['driver',snapshot.driverStandings],['constructor',snapshot.constructorStandings]] as const)if(!rows.some(s=>s.round===r.round))snapshot.coverage.gaps.push(`Round ${r.round}: ${kind} standings successful-empty source gap`);
  }
  if (!validSnapshotV2(snapshot, season)) throw new DataError('AUDIT_INVALID', 'Calendar, lifecycle, page inventory or canonical records failed v2 validation.');
  return snapshot;
}
export async function loadAuditedSnapshot(season: number, refresh = false, allowNetwork = true): Promise<SeasonSnapshotV2> {
  let calendar: AuditedCalendar;
  try { calendar = JSON.parse(await readFile(resolve(`app/fixtures/iteration-three/audited-calendars/${season}.json`), 'utf8')); }
  catch { throw new DataError('AUDIT_PENDING', `Season ${season} requires reviewed independent calendar/session evidence.`, 409); }
  return buildAuditedSnapshot(season, calendar, providerCache(undefined, allowNetwork, refresh));
}
