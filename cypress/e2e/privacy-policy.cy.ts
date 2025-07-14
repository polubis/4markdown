import { BASE_COMMANDS } from "../utils/commands";
import { gherkin } from "../utils/gherkin";

describe(`Privacy policy works when`, () => {
  const policyPageId = `[privacy-policy]:container`;

  const given = gherkin({
    ...BASE_COMMANDS,
    "Im on privacy policy page": () => {
      BASE_COMMANDS[`I see text`]([`Privacy Policy`]);
      cy.url().should(`include`, `/privacy-policy/`);
    },
    "I click privacy policy link": () => {
      cy.get(`[title="${`Check privacy policy`}"]`).click({
        force: true,
      });
    },
  });

  it(`there is no regression for desktop and different themes`, () => {
    given(`System has accepted cookies`)
      .and(`Im on page`, `home`)
      .and(`I see not disabled button`, [`Sign in`])
      .and(`I set white theme`)
      .when(`I click button`, [`Navigation`])
      .then(`I see not disabled button`, [`Close navigation`])
      .when(`I click privacy policy link`)
      .then(`Im on privacy policy page`)
      .and(`I see not disabled button`, [`Sign in`])
      .and(
        `System takes element picture`,
        `[data-testid="${policyPageId}"]`,
        `privacy-policy-page-content`,
      );
  });
});
