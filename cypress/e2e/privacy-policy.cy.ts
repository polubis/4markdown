import { BASE_COMMANDS } from '../utils/commands';
import { Gherkin } from '../utils/gherkin';

describe(`Privacy policy works when`, () => {
  const policyPageId = `[privacy-policy]:container`;

  const { Given } = Gherkin({
    ...BASE_COMMANDS,
    'Im on privacy policy page': () => {
      BASE_COMMANDS[`I see text`]([`Privacy Policy`]);
      cy.url().should(`include`, `/privacy-policy/`);
    },
    'I click privacy policy link': () => {
      cy.get(`[title="${`Check privacy policy`}"]`).click({
        force: true,
      });
    },
  });

  it(`there is no regression for desktop and different themes`, () => {
    Given(`System has accepted cookies`)
      .And(`Im on page`, `home`)
      .And(`I see not disabled button`, [`Sign in`])
      .And(`I set white theme`)
      .When(`I click button`, [`Navigation`])
      .Then(`I see not disabled button`, [`Close navigation`])
      .When(`I click privacy policy link`)
      .Then(`Im on privacy policy page`)
      .And(`I see not disabled button`, [`Sign in`])
      .And(
        `System takes element picture`,
        `[data-testid="${policyPageId}"]`,
        `privacy-policy-page-content`,
      );
  });
});
