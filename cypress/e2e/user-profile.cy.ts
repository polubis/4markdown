import { type API4MarkdownDto } from 'api-4markdown-contracts';
import { BASE_COMMANDS } from '../utils/commands';
import { gherkin } from '../utils/gherkin';

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

  const getYourAccountResponse: { result: API4MarkdownDto<`getYourAccount`> } =
    {
      result: {
        trusted: true,
        balance: {
          tokens: 50,
          refillStatus: `initialized`,
        },
      },
    };

  const given = gherkin({
    ...BASE_COMMANDS,
    'I see no profile section': () => {
      given(`I see text`, [
        `Your Account & Profile`,
        `Make Yourself visible`,
        `You have not created a profile yet. A profile is like a business card that allows others to recognize the documents you have created.`,
        `Profile cards may be changed or removed any time.`,
      ]).and(`I see not disabled button`, [`Open user profile settings`]);
    },
    'I create full profile': () => {
      given(`I see text`, [`Your Profile Edition`])
        .when(`I type in input`, displayNameInput, profileData.displayName)
        .and(`I type in input`, githubInput, profileData.githubUrl)
        .and(`I type in input`, bioInput, profileData.bio)
        .and(`I type in input`, fbInput, profileData.fbUrl)
        .and(`I type in input`, twitterInput, profileData.twitterUrl)
        .and(`I type in input`, blogInput, profileData.blogUrl)
        .and(`I type in input`, linkedInInput, profileData.linkedInUrl)
        .then(`System takes picture`, `full-user-profile-form`)
        .when(`I click button`, [`Save user profile`])
        .then(`I see disabled button`, [`Save user profile`]);
    },
    'I see profile card': () => {
      given(`I see text`, [
        `Your Account & Profile`,
        profileData.displayName,
        profileData.bio,
      ]);
    },
    'I create partial profile': () => {
      given(`I see text`, [`Your Profile Edition`])
        .when(`I type in input`, displayNameInput, profileData.displayName)
        .and(`I type in input`, githubInput, profileData.githubUrl)
        .then(`System takes picture`, `filled-user-profile-form`)
        .when(`I click button`, [`Save user profile`])
        .then(`I see disabled button`, [`Save user profile`]);
    },
    'I clear profile': () => {
      given(`I see text`, [`Your Profile Edition`])
        .when(`I clear input`, [
          displayNameInput,
          bioInput,
          githubInput,
          fbInput,
          twitterInput,
          blogInput,
          linkedInInput,
        ])
        .then(`System takes picture`, `cleaned-user-profile-form`)
        .when(`I click button`, [`Save user profile`])
        .then(`I see disabled button`, [`Save user profile`]);
    },
  });

  it(`user may edit his profile`, () => {
    given(`System mocks api`, {
      endpoint: `getYourAccount`,
      code: 200,
      response: getYourAccountResponse,
    })
      .and(`System has accepted cookies`)
      .and(`Im on page`, `home`)
      .and(`I log in`)
      .and(`I set white theme`)
      .when(`I click button`, [`User details and options`])
      .then(`I see not disabled button`, [
        `User details and options`,
        `Your documents`,
        `Open user profile settings`,
        `Open user profile settings`,
        `Close your account panel`,
        `Sign out`,
      ])
      .and(`I see no profile section`)
      .when(`I click button`, [`Open user profile settings`])
      .and(`I create partial profile`)
      .then(`I see no profile section`)
      .when(`I click button`, [`Open user profile settings`])
      .and(`I clear profile`)
      .then(`I see no profile section`)
      .when(`I click button`, [`Open user profile settings`])
      .and(`I create full profile`)
      .then(`I see profile card`)
      .and(`I see elements`, [
        `Your Blog link`,
        `Your Facebook link`,
        `Your Github link`,
        `Your LinkedIn link`,
        `Your Twitter link`,
      ])
      .when(`I click button`, [`Open user profile settings`])
      .and(`I clear profile`)
      .then(`I see no profile section`)
      .and(`System takes picture`, `no-profile-section`);
  });
});
