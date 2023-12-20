import { LOG_IN_OUT_SCENARIOS } from '../scenarios/log-in-out';
import { BASE_COMMANDS } from '../utils/commands';
import { Gherkin } from '../utils/gherkin';

describe(`Docs management works when`, () => {
  const { Given } = Gherkin(BASE_COMMANDS);

  before(() => {
    Given(`System sets pictures folder`, `docs-management`)
      .And(`System cleans local storage`)
      .And(`Im on page`, `home`);
  });

  after(() => {
    Given(`System cleans pictures setup`).And(`System cleans local storage`);
  });

  it(`user may log in and log out`, () => {
    LOG_IN_OUT_SCENARIOS[`I log in`]().When(`I click button`, [
      `Close your account panel`,
    ]);
  });
});
