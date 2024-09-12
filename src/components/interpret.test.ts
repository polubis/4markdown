import { expect } from '@jest/globals';
import { interpret } from './interpret';

describe(`Code interpretation works when`, () => {
  it(`proceed for supported code syntax`, () => {
    expect(interpret(`(a,1,2)(d,1,15)(e,1-4,19,21,24)`)).toEqual({
      is: `ok`,
      a: [1, 2],
      d: [1, 15],
      e: [1, 2, 3, 4, 19, 21, 24],
    });
  });

  it(`fails when uppsercase command is used`, () => {
    expect(interpret(`(a,1,2)(d,1,15),19,21,24)(E,1-18)`)).toEqual({
      is: `failed`,
    });
  });

  it(`fails for unsupported symbols`, () => {
    expect(interpret(`(g,1,2)(d,1,15)`)).toEqual({
      is: `failed`,
    });
  });

  it(`fails for incomplete code syntax`, () => {
    expect(interpret(`(a)`)).toEqual({
      is: `failed`,
    });
    expect(interpret(`(a,b-cd)`)).toEqual({
      is: `failed`,
    });
    expect(interpret(`(a)(a,1)`)).toEqual({
      is: `failed`,
    });
  });

  it(`blocks groups repetition`, () => {
    expect(interpret(`(a,1,2)(d,1,15)(e,1-4,19,21,24)(e,1,4)`)).toEqual({
      is: `failed`,
    });
  });
});
