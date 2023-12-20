import { LOG_IN_OUT_SCENARIOS } from '../scenarios/log-in-out';
import { BASE_COMMANDS } from '../utils/commands';
import { Gherkin } from '../utils/gherkin';

describe(`Docs management works when`, () => {
  const { Given } = Gherkin(BASE_COMMANDS);

  before(() => {
    Given(`System sets pictures folder`, `docs-management`).And(
      `System cleans local storage`,
    );
  });

  after(() => {
    Given(`System cleans pictures setup`).And(`System cleans local storage`);
  });

  it(`user may sign in and sign out`, () => {
    LOG_IN_OUT_SCENARIOS[`I log in`]();
    LOG_IN_OUT_SCENARIOS[`I log out`]();
  });
});
