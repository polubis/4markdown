import { LOG_IN_OUT_SCENARIOS } from '../scenarios/log-in-out';
import { BASE_COMMANDS } from '../utils/commands';
import { Gherkin } from '../utils/gherkin';

describe(`User profile works when`, () => {
  const { Given } = Gherkin({
    ...BASE_COMMANDS,
    'I change display name': (value: string) => {
      const { Given } = Gherkin(BASE_COMMANDS);

      Given(
        `I type in input`,
        `Examples: tom1994, work_work, pro-grammer, ...etc`,
        value,
      );
    },
    'I change bio': (value: string) => {
      const { Given } = Gherkin(BASE_COMMANDS);

      Given(
        `I type in input`,
        `Example: I like programming and playing computer games...`,
        value,
      );
    },
    'I change Github link': (value: string) => {
      const { Given } = Gherkin(BASE_COMMANDS);

      Given(`I type in input`, `//github.com/your-profile`, value);
    },
  });

  before(() => {
    Given(`System sets pictures folder`, `user-profile`);
  });

  beforeEach(() => {
    Given(`System cleans local storage`).And(`Im on page`, `home`);
  });

  after(() => {
    Given(`System cleans pictures setup`);
  });

  it(`user may edit his profile`, () => {
    LOG_IN_OUT_SCENARIOS[`I log in`]();

    Given(`I see not disabled button`, [
      `User details and options`,
      `Your documents`,
    ])
      .When(`I click button`, [`User details and options`])
      .Then(`I see not disabled button`, [
        `Open user profile settings`,
        `Create your user profile`,
        `Close your account panel`,
        `Sign out`,
      ])
      .And(`I see text`, [
        `Your Account`,
        `Make Yourself visible`,
        `You have not created a profile yet. A profile is like a business card that allows others to recognize the documents you have created.`,
        `Profile cards may be changed or removed any time.`,
      ])
      .And(`System takes picture`)
      .When(`I click button`, [`Create your user profile`])
      .Then(`I see not disabled button`, [
        `Close your profile form`,
        `Back to user profile`,
      ])
      .And(`I see disabled button`, [`Save user profile`])
      .And(`I see text`, [`Your Profile Edition`])
      .And(`System takes picture`)
      .When(`I click button`, [`Back to user profile`])
      .Then(`I see text`, [`Your Account`])
      .When(`I click button`, [`Create your user profile`])
      .And(`I change display name`, `tom_riddle`)
      .Then(`I see not disabled button`, [`Save user profile`])
      .When(`I change display name`, ``)
      .Then(`I see disabled button`, [`Save user profile`])
      .When(
        `I change bio`,
        `I worked as a developer already 10 years and I know React with NextJS`,
      )
      .And(
        `I change Github link`,
        `https://github.com/polubis/Dream-stack-for-React-dev`,
      );
  });
});
