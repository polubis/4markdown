import { CREATOR_SCENARIOS } from '../scenarios/creator';
import { BASE_COMMANDS } from '../utils/commands';
import { Gherkin } from '../utils/gherkin';

describe(`Creator works when`, () => {
  const { Given } = Gherkin(BASE_COMMANDS);

  before(() => {
    Given(`System sets pictures folder`, `creator`);
  });

  after(() => {
    Given(`System cleans pictures setup`);
  });

  it(`user may use editor controls in both themes`, () => {
    CREATOR_SCENARIOS[`I played with editor`]().When(`I click button`, [
      `Change theme`,
      `Reset content`,
      `Reset content`,
    ]);
    CREATOR_SCENARIOS[`I played with editor`]();
  });
});
