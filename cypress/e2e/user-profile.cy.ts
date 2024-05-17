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

  const profileData = {
    displayName: `tom_ridle`,
    bio: `I worked as a developer already 10 years and I know React with NextJS`,
    githubUrl: `https://github.com/polubis/Dream-stack-for-React-dev`,
    blogUrl: `https://greenonsoftware.com/`,
    linkedInUrl: `https://www.linkedin.com/in/adrian-po%C5%82ubi%C5%84ski-281ab2172/`,
    fbUrl: `https://www.facebook.com/profile.php?id=100004388103426`,
    twitterUrl: `https://twitter.com/home?lang=en`,
  } as const;

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
    'I create full profile': () => {
      Given(`I see text`, [`Your Profile Edition`])
        .When(`I type in input`, displayNameInput, profileData.displayName)
        .And(`I type in input`, githubInput, profileData.githubUrl)
        .And(`I type in input`, bioInput, profileData.bio)
        .And(`I type in input`, fbInput, profileData.fbUrl)
        .And(`I type in input`, twitterInput, profileData.twitterUrl)
        .And(`I type in input`, blogInput, profileData.blogUrl)
        .And(`I type in input`, linkedInInput, profileData.linkedInUrl)
        .Then(`System takes picture`)
        .When(`I click button`, [`Save user profile`])
        .Then(`I see disabled button`, [`Save user profile`]);
    },
    'I see profile card': () => {
      Given(`I see text`, [
        `Your Account`,
        profileData.displayName,
        profileData.bio,
      ]);
    },
    'I create partial profile': () => {
      Given(`I see text`, [`Your Profile Edition`])
        .When(`I type in input`, displayNameInput, profileData.displayName)
        .And(`I type in input`, githubInput, profileData.githubUrl)
        .Then(`System takes picture`)
        .When(`I click button`, [`Save user profile`])
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
        .Then(`System takes picture`)
        .When(`I click button`, [`Save user profile`])
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
      .Then(`I see no profile section`)
      .When(`I click button`, [`Create your user profile`])
      .And(`I create full profile`)
      .Then(`I see profile card`)
      .And(`I see elements`, [
        `Your Blog link`,
        `Your Facebook link`,
        `Your Github link`,
        `Your LinkedIn link`,
        `Your Twitter link`,
      ])
      .When(`I click button`, [`Open user profile settings`])
      .And(`I clear profile`)
      .Then(`I see no profile section`);
  });
});
