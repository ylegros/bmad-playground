import {createElement} from 'react';
import {describe,expect,it,vi} from 'vitest';
import {renderToStaticMarkup} from 'react-dom/server';
import type {SeasonSnapshot} from '../shared/contracts';
vi.mock('./data-source',()=>({dataSource:{mode:'local',mediaPath:(name:string)=>`/media/${name}`}}));
import {ConstructorIdentity} from './Identity';
import {seasonMediaCoverage} from './media';

const snapshot={season:2021,constructors:{ferrari:{name:'Ferrari'},unmapped:{name:'Readable team'}}} as unknown as SeasonSnapshot;
describe('constructor presentation',()=>{
 it('renders a standings logo as the sole visible and accessible identity',()=>{
  const html=renderToStaticMarkup(createElement(ConstructorIdentity,{snapshot,id:'ferrari',presentation:'standings'}));
  expect(html).toContain('alt="Ferrari"');
  expect(html.match(/Ferrari/g)).toHaveLength(1);
  expect(html).not.toContain('>Ferrari<');
 });
 it('keeps named affiliations and renders unmapped names without a badge',()=>{
  const named=renderToStaticMarkup(createElement(ConstructorIdentity,{snapshot,id:'ferrari'}));
  expect(named).toContain('alt=""');expect(named).toContain('>Ferrari<');
  const fallback=renderToStaticMarkup(createElement(ConstructorIdentity,{snapshot,id:'unmapped',presentation:'standings'}));
  expect(fallback).toContain('>Readable team<');expect(fallback).not.toContain('<img');expect(fallback).not.toContain('constructor-frame');
 });
 it('does not turn readable fallback text into acquired image coverage',()=>{
  const coverage=seasonMediaCoverage({...snapshot,drivers:{}}).find(row=>row.kind==='constructor')!;
  expect(coverage.total).toBe(2);expect(coverage.actual).toBe(1);expect(coverage.unresolved).toBe(1);
 });
});

