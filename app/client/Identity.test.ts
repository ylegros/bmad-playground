import { describe, expect, it, vi } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import type { SeasonSnapshot } from '../shared/contracts';
import { ConstructorIdentity } from './Identity';

vi.mock('./data-source', () => ({ dataSource: { mediaPath: (name: string) => `/media/${name}` } }));

describe('constructor identity', () => {
  const snapshot = (season: number, id: string, name: string) => ({
    season, constructors: { [id]: { name } },
  }) as SeasonSnapshot;

  it('leaves only the canonical name when no applicable mapping exists', () => {
    const html = renderToStaticMarkup(createElement(ConstructorIdentity, {
      snapshot: snapshot(2010, 'unmapped', 'Historical Team'), id: 'unmapped',
    }));
    expect(html).toBe('<span class="constructor-identity"><span>Historical Team</span></span>');
  });

  it('keeps a season-applicable logo decorative beside a single name', () => {
    const html = renderToStaticMarkup(createElement(ConstructorIdentity, {
      snapshot: snapshot(2021, 'ferrari', 'Ferrari'), id: 'ferrari',
    }));
    expect(html).toContain('alt=""');
    expect(html).toContain('constructor-frame');
    expect(html.match(/Ferrari/g)).toHaveLength(1);
  });

  it('does not substitute the mapped logo from a different season', () => {
    const html = renderToStaticMarkup(createElement(ConstructorIdentity, {
      snapshot: snapshot(2011, 'ferrari', 'Ferrari'), id: 'ferrari',
    }));
    expect(html).not.toContain('<img');
    expect(html).not.toContain('constructor-frame');
    expect(html.match(/Ferrari/g)).toHaveLength(1);
  });
});
