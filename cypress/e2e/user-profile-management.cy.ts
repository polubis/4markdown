import { LOG_IN_OUT_SCENARIOS } from '../scenarios/log-in-out';
import { BASE_COMMANDS } from '../utils/commands';
import { Gherkin } from '../utils/gherkin';

describe(`User profile works when`, () => {
  const { Given } = Gherkin({
    ...BASE_COMMANDS,
    'I log in': () => {
      Given(`I see disabled button`, [`Sign in`])
        .And(`I see not disabled button`, [`Sign in`])
        .When(`I click button`, [`Sign in`])
        .Then(`I not see button`, [`Sign in`])
        .And(`I see disabled button`, [`Your documents`])
        .And(`I see not disabled button`, [`Your documents`]);
    },
  });

  before(() => {
    Given(`System sets pictures folder`, `user-profile-management`);
  });

  beforeEach(() => {
    Given(`System cleans local storage`)
      .And(`Im on page`, `home`)
      .And(`System has accepted cookies`);
  });

  after(() => {
    Given(`System cleans pictures setup`);
  });

  it(`user is able to manage own profile`, () => {
    Given(`I log in`)
      .When(`I click button`, [`User details and options`])
      .Then(`I see section`, `[user-profile]:no-profile-yet`)
      .And(`System takes picture`)
      .When(`I click button`, [`Sync your profile`])
      .Then(`I see section`, `[user-profile]:profile-loading`)
      .And(`I see section`, `[user-profile]:no-profile-yet`)
      .When(`I click button`, [`Create your user profile`])
      .Then(`I see section`, `[user-profile-form]:container`)
      .And(`System takes picture`);
  });
});
