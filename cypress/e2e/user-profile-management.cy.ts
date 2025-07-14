import type { API4MarkdownDto } from "api-4markdown-contracts";
import { BASE_COMMANDS } from "../utils/commands";
import { gherkin } from "../utils/gherkin";

describe(`User profile works when`, () => {
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

  const userProfileFormSelectors = {
    displayName: `Examples: tom1994, work_work, pro-grammer, ...etc`,
    bio: `Example: I like programming and playing computer games...`,
    githubUrl: `https://github.com/your-profile`,
    blogUrl: `https://your-blog-domain`,
    linkedInUrl: `https://linkedin.com/your-profile`,
    fbUrl: `https://facebook.com/your-profile`,
    twitterUrl: `https://twitter.com/your-profile`,
  } as const;

  const given = gherkin({
    ...BASE_COMMANDS,
    "I clear all user profile form fields": () => {
      given(`I type in input`, userProfileFormSelectors.displayName, `a`).and(
        `I clear input`,
        Object.values(userProfileFormSelectors),
      );
    },
    "I see user profile form is busy": () => {
      given(`I see disabled button`, [
        `Save user profile`,
        `Back to user profile`,
        `Close your profile form`,
      ]).and(`I see text`, [`Updating your profile...`]);
    },
    "I clean up user profile form": () => {
      given(`I click button`, [
        `User details and options`,
        `Open user profile settings`,
      ])
        .then(`I see section`, `[user-profile-form]:container`)
        .when(`I clear all user profile form fields`)
        .then(`I click button`, [`Save user profile`])
        .and(`I see user profile form is busy`)
        .then(`I see section`, `[user-profile]:no-profile-yet`);
    },
    "I try to use other user display name": () => {
      given(`I click button`, [`Open user profile settings`])
        .and(`I type in input`, userProfileFormSelectors.displayName, `polubis`)
        .when(`I click button`, [`Save user profile`])
        .then(`I see user profile form is busy`)
        .and(`I see text`, [`Ups, something went wrong`])
        .and(`System takes picture`, `error-screen-dupliated-username`)
        .when(`I click button`, [`Close error screen`])
        .then(`I see section`, `[user-profile-form]:container`)
        .when(`I clear input`, [userProfileFormSelectors.displayName])
        .and(`I click button`, [`Save user profile`])
        .then(`I see user profile form is busy`)
        .and(`I see section`, `[user-profile]:no-profile-yet`);
    },
  });

  it(`user is able to manage own profile`, () => {
    given(`System mocks api`, {
      endpoint: `getYourAccount`,
      code: 200,
      response: getYourAccountResponse,
    })
      .and(`System has accepted cookies`)
      .and(`Im on page`, `home`)
      .and(`I log in`)
      .and(`I set white theme`)
      .and(`I wait for api`, `getYourAccount`, 200)
      .when(`I click button`, [`User details and options`])
      .then(`I see section`, `[user-profile]:no-profile-yet`)
      .and(`System takes picture`, `no-profile-yet`)
      .when(`I click button`, [`Sync your profile`])
      .then(`I see section`, `[user-profile]:profile-loading`)
      .and(`I see section`, `[user-profile]:no-profile-yet`)
      .when(`I click button`, [`Open user profile settings`])
      .then(`I see section`, `[user-profile-form]:container`)
      .when(`I clear all user profile form fields`)
      .and(`System takes picture`, `empty-user-profile-form`)
      .when(`I type in input`, userProfileFormSelectors.displayName, `a`)
      .then(`I see disabled button`, [`Save user profile`])
      .when(
        `I type in input`,
        userProfileFormSelectors.displayName,
        `apt_tom-riddle`,
      )
      .then(`I see not disabled button`, [`Save user profile`])
      .when(`I type in input`, userProfileFormSelectors.bio, `s`.repeat(9))
      .then(`I see disabled button`, [`Save user profile`])
      .when(`I type in input`, userProfileFormSelectors.bio, `  s   `.repeat(9))
      .then(`I see not disabled button`, [`Save user profile`])
      .when(`I click button`, [`Save user profile`])
      .then(`I see user profile form is busy`)
      .and(`I see section`, `[user-profile]:profile-ready`)
      .then(`System takes picture`, `profile-ready`)
      .when(`I click button`, [`Open user profile settings`])
      .then(`I see section`, `[user-profile-form]:container`)
      .and(`I see disabled button`, [`Save user profile`])
      .when(
        `I type in input`,
        userProfileFormSelectors.githubUrl,
        `https://github.com/polubis`,
      )
      .then(`I see not disabled button`, [`Save user profile`])
      .when(`I clear input`, [userProfileFormSelectors.githubUrl])
      .and(
        `I type in input`,
        userProfileFormSelectors.githubUrl,
        `http:wrong-urlformat.de`,
      )
      .then(`I see disabled button`, [`Save user profile`])
      .when(`I click button`, [`Back to user profile`])
      .then(`I see section`, `[user-profile]:profile-ready`)
      .when(`I click button`, [`Close your account panel`])
      .then(`I not see section`, `[user-profile]:profile-ready`)
      .and(`I clean up user profile form`)
      .when(`I try to use other user display name`);
  });
});
