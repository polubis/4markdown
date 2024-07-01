import { expect } from '@jest/globals';
import { analyze } from './md-code-commands';

describe(`Commands parsing from md code works when`, () => {
  it(`analyzes commands syntax`, () => {
    expect(analyze(`lang-[tabs]`).tabs).toBe(true);
    expect(analyze(`[tabs]`).tabs).toBe(true);
    expect(analyze(`[tabs][other=1,2]`).tabs).toBe(true);
    expect(analyze(`[other=1,2][tabs]`).tabs).toBe(true);
    expect(analyze(`lang-[tabss]`).tabs).toBe(false);
    expect(analyze(`lang-[tab]`).tabs).toBe(false);
    expect(analyze(`[tab]`).tabs).toBe(false);
    expect(analyze(`tabs`).tabs).toBe(false);
    expect(analyze(`[tabs`).tabs).toBe(false);
    expect(analyze(`tabs]`).tabs).toBe(false);
    expect(analyze(`tab`).tabs).toBe(false);
  });
});
