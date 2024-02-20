import { LOG_IN_OUT_SCENARIOS } from '../scenarios/log-in-out';
import { BASE_COMMANDS } from '../utils/commands';
import { Gherkin } from '../utils/gherkin';

describe(`Log in and out works when`, () => {
  const { Given } = Gherkin({
    ...BASE_COMMANDS,
    'I go through sign in and out': () => {
      Given(`System takes picture`)
        .And(`I see text`, [`Markdown Editor`])
        .And(`System takes picture`)
        .When(`I click button`, [`Sign in`])
        .Then(`System takes picture`)
        .And(`I see not disabled button`, [`Your documents`])
        .And(`System takes picture`)
        .When(`I click button`, [`User details and options`])
        .Then(`I see text`, [`Your Account`])
        .And(`System takes picture`)
        .When(`I click button`, [`Close your account panel`])
        .Then(`System takes picture`)
        .When(`I click button`, [
          `User details and options`,
          `Sign out`,
          `Sign out`,
        ])
        .Then(`I not see text`, [`Your Account`])
        .And(`System takes picture`);
    },
  });

  beforeEach(() => {
    Given(`System cleans local storage`).And(`Im on page`, `home`);
  });

  afterEach(() => {
    Given(`System cleans local storage`).And(`System cleans pictures setup`);
  });

  it(`user may log in and log out`, () => {
    LOG_IN_OUT_SCENARIOS[`I log in`]()
      .When(`I click button`, [`Close your account panel`])
      .Then(`I not see text`, [`Your Account`])
      .And(`I not see button`, [`Close your account panel`]);

    LOG_IN_OUT_SCENARIOS[`I log out`]();
  });

  it(`user interface contains no regression and works in both themes`, () => {
    Given(`System sets pictures folder`, `log-in-out`)
      .And(`I go through sign in and out`)
      .Then(`I click button`, [`Change theme`])
      .And(`I go through sign in and out`);
  });
});
