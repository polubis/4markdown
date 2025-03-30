import { BASE_COMMANDS } from '../utils/commands';
import { Gherkin } from '../utils/gherkin';

describe(`User profile works when`, () => {
  const userProfileFormSelectors = {
    displayName: `Examples: tom1994, work_work, pro-grammer, ...etc`,
    bio: `Example: I like programming and playing computer games...`,
    githubUrl: `https://github.com/your-profile`,
    blogUrl: `https://your-blog-domain`,
    linkedInUrl: `https://linkedin.com/your-profile`,
    fbUrl: `https://facebook.com/your-profile`,
    twitterUrl: `https://twitter.com/your-profile`,
  } as const;

  const { Given } = Gherkin({
    ...BASE_COMMANDS,
    'I clear all user profile form fields': () => {
      Given(`I type in input`, userProfileFormSelectors.displayName, `a`).And(
        `I clear input`,
        Object.values(userProfileFormSelectors),
      );
    },
    'I see user profile form is busy': () => {
      Given(`I see disabled button`, [
        `Save user profile`,
        `Back to user profile`,
        `Close your profile form`,
      ]).And(`I see text`, [`Updating your profile...`]);
    },
    'I clean up user profile form': () => {
      Given(`I click button`, [
        `User details and options`,
        `Open user profile settings`,
      ])
        .Then(`I see section`, `[user-profile-form]:container`)
        .When(`I clear all user profile form fields`)
        .Then(`I click button`, [`Save user profile`])
        .And(`I see user profile form is busy`)
        .Then(`I see section`, `[user-profile]:no-profile-yet`);
    },
    'I try to use other user display name': () => {
      Given(`I click button`, [`Open user profile settings`])
        .And(`I type in input`, userProfileFormSelectors.displayName, `polubis`)
        .When(`I click button`, [`Save user profile`])
        .Then(`I see user profile form is busy`)
        .And(`I see text`, [`Ups, something went wrong`])
        .And(`picture`, `error-screen-dupliated-username`)
        .When(`I click button`, [`Close error screen`])
        .Then(`I see section`, `[user-profile-form]:container`)
        .When(`I clear input`, [userProfileFormSelectors.displayName])
        .And(`I click button`, [`Save user profile`])
        .Then(`I see user profile form is busy`)
        .And(`I see section`, `[user-profile]:no-profile-yet`);
    },
  });

  it(`user is able to manage own profile`, () => {
    Given(`System has accepted cookies`)
      .And(`Im on page`, `home`)
      .And(`I log in`)
      .And(`theme is set to white`)
      .When(`I click button`, [`User details and options`])
      .Then(`I see section`, `[user-profile]:no-profile-yet`)
      .And(`picture`, `no-profile-yet`)
      .When(`I click button`, [`Sync your profile`])
      .Then(`I see section`, `[user-profile]:profile-loading`)
      .And(`I see section`, `[user-profile]:no-profile-yet`)
      .When(`I click button`, [`Create your user profile`])
      .Then(`I see section`, `[user-profile-form]:container`)
      .When(`I clear all user profile form fields`)
      .And(`picture`, `empty-user-profile-form`)
      .When(`I type in input`, userProfileFormSelectors.displayName, `a`)
      .Then(`I see disabled button`, [`Save user profile`])
      .When(
        `I type in input`,
        userProfileFormSelectors.displayName,
        `apt_tom-riddle`,
      )
      .Then(`I see not disabled button`, [`Save user profile`])
      .When(`I type in input`, userProfileFormSelectors.bio, `s`.repeat(9))
      .Then(`I see disabled button`, [`Save user profile`])
      .When(`I type in input`, userProfileFormSelectors.bio, `  s   `.repeat(9))
      .Then(`I see not disabled button`, [`Save user profile`])
      .When(`I click button`, [`Save user profile`])
      .Then(`I see user profile form is busy`)
      .And(`I see section`, `[user-profile]:profile-ready`)
      .Then(`picture`, `profile-ready`)
      .When(`I click button`, [`Open user profile settings`])
      .Then(`I see section`, `[user-profile-form]:container`)
      .And(`I see disabled button`, [`Save user profile`])
      .When(
        `I type in input`,
        userProfileFormSelectors.githubUrl,
        `https://github.com/polubis`,
      )
      .Then(`I see not disabled button`, [`Save user profile`])
      .When(`I clear input`, [userProfileFormSelectors.githubUrl])
      .And(
        `I type in input`,
        userProfileFormSelectors.githubUrl,
        `http:wrong-urlformat.de`,
      )
      .Then(`I see disabled button`, [`Save user profile`])
      .When(`I click button`, [`Back to user profile`])
      .Then(`I see section`, `[user-profile]:profile-ready`)
      .When(`I click button`, [`Close your account panel`])
      .Then(`I not see section`, `[user-profile]:profile-ready`)
      .And(`I clean up user profile form`)
      .When(`I try to use other user display name`);
  });
});
