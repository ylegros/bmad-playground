import { expect, test } from 'vitest';
import { SeasonOperations } from './operations';

test('a refresh invalidates a delayed cached read and an older refresh', () => {
  const operations = new SeasonOperations();
  const read = operations.begin(2021);
  const refresh = operations.begin(2021);
  expect(operations.isCurrent(2021, read)).toBe(false);
  expect(operations.isCurrent(2021, refresh)).toBe(true);
  const nextRefresh = operations.begin(2021);
  expect(operations.isCurrent(2021, refresh)).toBe(false);
  expect(operations.isCurrent(2021, nextRefresh)).toBe(true);
});

test('rapid season switching keeps each season generation independent', () => {
  const operations = new SeasonOperations();
  const current = operations.begin(2021);
  const oldSeason = operations.begin(2010);
  expect(operations.isCurrent(2021, current)).toBe(true);
  expect(operations.isCurrent(2010, oldSeason)).toBe(true);
  operations.begin(2021);
  expect(operations.isCurrent(2021, current)).toBe(false);
  expect(operations.isCurrent(2010, oldSeason)).toBe(true);
});
