import {describe,it,expect,vi} from 'vitest';
import {applyCurrentSelection} from './selection-context';

describe('deferred Progress navigation',()=>{
 it('rejects a callback after a year roundtrip with the exact same cached snapshot',()=>{
  const snapshot={},old={snapshot,category:'drivers',season:2026,view:'progress',generation:4};
  const mutateUrl=vi.fn();
  expect(applyCurrentSelection(old,{...old,generation:6},mutateUrl)).toBe(false);
  expect(mutateUrl).not.toHaveBeenCalled();
  expect(applyCurrentSelection({...old,generation:6},{...old,generation:6},mutateUrl)).toBe(true);
  expect(mutateUrl).toHaveBeenCalledTimes(1);
 });
 it('rejects obsolete history/category/snapshot contexts without a URL or history mutation',()=>{
  const old={snapshot:{},category:'drivers',season:2026,view:'progress',generation:1},mutateUrl=vi.fn();
  for(const current of [{...old,generation:2},{...old,category:'constructors'},{...old,snapshot:{}},{...old,view:'compare'}])expect(applyCurrentSelection(old,current,mutateUrl)).toBe(false);
  expect(mutateUrl).not.toHaveBeenCalled();
 });
});
