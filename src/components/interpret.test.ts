import { expect } from '@jest/globals';
import { interpret } from './interpret';

describe(`Code interpretation works when`, () => {
  it(`returns the correct tokens for a simple command`, () => {
    expect(interpret(`(a,1,2)(d,1,15)(e,1-4,19,21,24)`)).toEqual({
      is: `ok`,
      a: [1, 2],
      d: [1, 15],
      e: [1, 2, 3, 4, 19, 21, 24],
    });
    expect(interpret(`(a,1,2)(d,1,15),19,21,24)(E,1-18)`)).toEqual({
      is: `fail`,
    });
    expect(interpret(`(a)`)).toEqual({
      is: `fail`,
    });
    expect(interpret(`(a)(d,12---)`)).toEqual({
      is: `fail`,
    });
  });
});
