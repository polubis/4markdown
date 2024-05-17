import { LOG_IN_OUT_SCENARIOS } from '../scenarios/log-in-out';
import { BASE_COMMANDS } from '../utils/commands';
import { Gherkin } from '../utils/gherkin';

describe(`User profile works when`, () => {
  const displayNameInput = `Examples: tom1994, work_work, pro-grammer, ...etc`;
  const bioInput = `Example: I like programming and playing computer games...`;
  const githubInput = `https://github.com/your-profile`;
  const fbInput = `https://facebook.com/your-profile`;
  const twitterInput = `https://twitter.com/your-profile`;
  const blogInput = `https://your-blog-domain`;
  const linkedInInput = `https://linkedin.com/your-profile`;

  const { Given } = Gherkin({
    ...BASE_COMMANDS,
    'I see no profile section': () => {
      Given(`I see text`, [
        `Your Account`,
        `Make Yourself visible`,
        `You have not created a profile yet. A profile is like a business card that allows others to recognize the documents you have created.`,
        `Profile cards may be changed or removed any time.`,
      ]).And(`I see not disabled button`, [`Create your user profile`]);
    },
    'I create partial profile': () => {
      Given(`I see text`, [`Your Profile Edition`])
        .When(`I type in input`, displayNameInput, `tom_riddle`)
        .And(
          `I type in input`,
          githubInput,
          `https://github.com/polubis/Dream-stack-for-React-dev`,
        )
        .And(`I click button`, [`Save user profile`])
        .Then(`I see disabled button`, [`Save user profile`]);
    },
    'I clear profile': () => {
      Given(`I see text`, [`Your Profile Edition`])
        .When(`I clear input`, [
          displayNameInput,
          bioInput,
          githubInput,
          fbInput,
          twitterInput,
          blogInput,
          linkedInInput,
        ])
        .And(`I click button`, [`Save user profile`])
        .Then(`I see disabled button`, [`Save user profile`]);
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
      `Open user profile settings`,
      `Create your user profile`,
      `Close your account panel`,
      `Sign out`,
    ])
      .And(`I see no profile section`)
      .When(`I click button`, [`Create your user profile`])
      .And(`I create partial profile`)
      .Then(`I see no profile section`)
      .When(`I click button`, [`Create your user profile`])
      .And(`I clear profile`)
      .Then(`I see no profile section`);

    // Given(`I see not disabled button`, [
    //   `User details and options`,
    //   `Your documents`,
    // ])
    //   .And(`I see not disabled button`, [
    //     `Open user profile settings`,
    //     `Create your user profile`,
    //     `Close your account panel`,
    //     `Sign out`,
    //   ])
    //   .And(`I see text`, [`Your Account`])
    //   .And(`I see no profile yet section`)
    //   .When(`I click button`, [`Create your user profile`])
    //   .Then(`I see not disabled button`, [
    //     `Close your profile form`,
    //     `Back to user profile`,
    //   ])
    //   .And(`I see disabled button`, [`Save user profile`])
    //   .And(`I see text`, [`Your Profile Edition`])
    //   .When(`I click button`, [`Back to user profile`])
    //   .Then(`I see text`, [`Your Account`])
    //   .When(`I click button`, [`Create your user profile`])
    //   .And(`I change display name`, `tom_riddle`)
    //   .When(`I clear display name`)
    //   .And(`I change display name`, `tom_riddle`)
    //   .Then(`I see not disabled button`, [`Save user profile`])
    //   .When(`I clear display name`)
    //   .Then(`I see not disabled button`, [`Save user profile`])
    //   .When(
    //     `I change bio`,
    //     `I worked as a developer already 10 years and I know React with NextJS`,
    //   )
    //   .And(
    //     `I change Github link`,
    //     `https://github.com/polubis/Dream-stack-for-React-dev`,
    //   )
    //   .When(`I click button`, [`Save user profile`])
    //   .Then(`I see text`, [`Updating your profile`])
    //   .And(`I see disabled button`, [`Save user profile`])
    //   .And(`I see text`, [`Your Account`])
    //   .And(`I see no profile yet section`)
    //   .When(`I create profile`)
    //   .And(`I reset profile`)
    //   .Then(`I see no profile yet section`);
    // .Then(`I see text`, [`Your Account`])
    // .And(`System takes picture`)
    // .When(`I click button`, [`Open user profile settings`])
    // .And(`I clear display name`)
    // .And(`I click button`, [`Save user profile`])
    // .Then(`I see disabled button`, [`Save user profile`])
    // .And(`I see text`, [`Your Account`, `Updating your profile...`])
    // .And(`System takes picture`)
    // .When(`I click button`, [`Open user profile settings`])
    // .Then(`System takes picture`)
    // .When(`I clear bio`)
    // .And(
    //   `I change Facebook link`,
    //   `https://www.facebook.com/profile.php?id=100004388103426`,
    // )
    // .And(`I change Twitter link`, `https://twitter.com/home?lang=en`)
    // .And(`I change blog link`, `https://greenonsoftware.com/`)
    // .And(
    //   `I change LinkedIn link`,
    //   `https://www.linkedin.com/in/adrian-po%C5%82ubi%C5%84ski-281ab2172/`,
    // )
    // .And(`I change avatar`, `../assets/cringe.jpg`)
    // .Then(`System takes picture`)
    // .When(`I click button`, [`Save user profile`])
    // .Then(`I see disabled button`, [`Save user profile`])
    // .And(`I see text`, [`Your Account`])
    // .Then(`System takes picture`);
  });
});
