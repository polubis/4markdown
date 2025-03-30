import { LOG_IN_OUT_SCENARIOS } from '../scenarios/log-in-out';
import { BASE_COMMANDS } from '../utils/commands';
import { Gherkin } from '../utils/gherkin';

describe(`Log in and out works when`, () => {
  const { Given } = Gherkin({ ...BASE_COMMANDS, ...LOG_IN_OUT_SCENARIOS });

  it(`user may log in and log out`, () => {
    Given(`System has accepted cookies`)
      .And(`Im on page`, `home`)
      .When(`I log in`)
      .And(`I log out`);
  });
});
