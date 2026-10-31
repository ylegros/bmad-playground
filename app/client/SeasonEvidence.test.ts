import { describe, it, expect } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import SeasonEvidence, { standingsCaption } from './SeasonEvidence';
import { evidenceFixture } from '../shared/evidence.fixtures';
import { validSnapshotV2 } from '../shared/evidence';

describe('standings freshness labels',()=>{
  it('a complete season with a held source gap keeps earlier standings Current',()=>{
    const s=evidenceFixture();s.lifecycle='complete';s.audit.completion=s.audit.provenance;
    s.schedule[1].sessions.gp.lifecycle='held';s.schedule[1].sessions.qualifying.lifecycle='held';s.analysisRounds=[1,2];
    s.coverage.gaps=['gp','qualifying','driver standings','constructor standings'].map(kind=>`Round 2: ${kind} successful-empty source gap`);
    s.audit.endpoints.push(...['driverStandings','constructorStandings'].map(kind=>({sourceUrl:`https://example.org/ergast/f1/2026/2/${kind}.json?limit=100`,expectedPages:1,fetchedPages:1})));
    expect(validSnapshotV2(s,2026)).toBe(true);
    const html=renderToStaticMarkup(createElement(SeasonEvidence,{snapshot:s}));
    expect(standingsCaption(s,'drivers')).toContain('Current standings');
    expect(html).toContain('Current standings at round 1; 1 analyzed GPs behind');
    expect(html).not.toContain('Final standings');
    expect(html).toContain('Audited ');expect(html).toContain('Source freshness (oldest page)');
  });
  it('uses Final only when verified completion and official source reach the last held GP',()=>{
    const s=evidenceFixture();s.schedule=s.schedule.slice(0,1);s.coverage.checkedRounds=[1];s.lifecycle='complete';s.audit.completion=s.audit.provenance;
    expect(validSnapshotV2(s,2026)).toBe(true);
    expect(standingsCaption(s,'constructors')).toContain('Final standings');
  });
});
