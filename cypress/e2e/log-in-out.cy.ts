import { LOG_IN_OUT_SCENARIOS } from '../scenarios/log-in-out';
import { BASE_COMMANDS } from '../utils/commands';
import { Gherkin } from '../utils/gherkin';

describe(`Log in and out works when`, () => {
  const { Given } = Gherkin(BASE_COMMANDS);

  beforeEach(() => {
    Given(`System cleans local storage`).And(`Im on page`, `home`);
  });

  afterEach(() => {
    Given(`System cleans local storage`);
  });

  it(`user may log in and log out`, () => {
    LOG_IN_OUT_SCENARIOS[`I log in`]()
      .When(`I click button`, [`Close your account panel`])
      .Then(`I not see text`, [`Your Account`])
      .And(`I not see button`, [`Close your account panel`]);

    LOG_IN_OUT_SCENARIOS[`I log out`]();
  });
});
