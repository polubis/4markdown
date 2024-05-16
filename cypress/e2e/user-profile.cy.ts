import { LOG_IN_OUT_SCENARIOS } from '../scenarios/log-in-out';
import { BASE_COMMANDS } from '../utils/commands';
import { Gherkin } from '../utils/gherkin';

describe(`User profile works when`, () => {
  const { Given: BaseGiven } = Gherkin(BASE_COMMANDS);

  const { Given } = Gherkin({
    ...BASE_COMMANDS,
    'I change display name': (value: string) => {
      BaseGiven(
        `I type in input`,
        `Examples: tom1994, work_work, pro-grammer, ...etc`,
        value,
      );
    },
    'I clear display name': () => {
      BaseGiven(`I clear input`, [
        `Examples: tom1994, work_work, pro-grammer, ...etc`,
      ]);
    },
    'I change bio': (value: string) => {
      BaseGiven(
        `I type in input`,
        `Example: I like programming and playing computer games...`,
        value,
      );
    },
    'I clear bio': () => {
      BaseGiven(`I clear input`, [
        `Example: I like programming and playing computer games...`,
      ]);
    },
    'I change Github link': (value: string) => {
      BaseGiven(`I type in input`, `https://github.com/your-profile`, value);
    },
    'I change LinkedIn link': (value: string) => {
      BaseGiven(`I type in input`, `https://linkedin.com/your-profile`, value);
    },
    'I change Facebook link': (value: string) => {
      BaseGiven(`I type in input`, `https://facebook.com/your-profile`, value);
    },
    'I change Twitter link': (value: string) => {
      BaseGiven(`I type in input`, `https://twitter.com/your-profile`, value);
    },
    'I change blog link': (value: string) => {
      BaseGiven(`I type in input`, `https://your-blog-domain`, value);
    },
    'I change avatar': (path: string) => {
      BaseGiven(`I click button`, [`Add your avatar`]);
      cy.get(`input[type="file"]`).selectFile(path);
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
      .And(`I see not disabled button`, [
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
      .Then(`System takes picture`)
      .When(`I clear display name`)
      .Then(`System takes picture`)
      .When(`I change display name`, `tom_riddle`)
      .And(`I see not disabled button`, [`Save user profile`])
      .When(`I clear display name`)
      .Then(`I see disabled button`, [`Save user profile`])
      .When(
        `I change bio`,
        `I worked as a developer already 10 years and I know React with NextJS`,
      )
      .And(
        `I change Github link`,
        `https://github.com/polubis/Dream-stack-for-React-dev`,
      )
      .When(`I click button`, [`Save user profile`])
      .Then(`I see text`, [`Your Account`])
      .And(`System takes picture`)
      .When(`I click button`, [`Open user profile settings`])
      .And(`I clear display name`)
      .And(`I click button`, [`Save user profile`])
      .Then(`I see disabled button`, [`Save user profile`])
      .And(`I see text`, [`Your Account`, `Updating your profile...`])
      .And(`System takes picture`)
      .When(`I click button`, [`Open user profile settings`])
      .Then(`System takes picture`)
      .When(`I clear bio`)
      .And(
        `I change Facebook link`,
        `https://www.facebook.com/profile.php?id=100004388103426`,
      )
      .And(`I change Twitter link`, `https://twitter.com/home?lang=en`)
      .And(`I change blog link`, `https://greenonsoftware.com/`)
      .And(
        `I change LinkedIn link`,
        `https://www.linkedin.com/in/adrian-po%C5%82ubi%C5%84ski-281ab2172/`,
      )
      .And(`I change avatar`, `../assets/cringe.jpg`)
      .And(`I wait`, 4000)
      .Then(`System takes picture`)
      .When(`I click button`, [`Save user profile`])
      .Then(`I see disabled button`, [`Save user profile`])
      .And(`I see text`, [`Your Account`])
      .When(`I wait`, 4000)
      .Then(`System takes picture`);
  });
});
