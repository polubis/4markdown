import type { Element } from '../utils/commands';
import { BASE_COMMANDS } from '../utils/commands';
import { Gherkin } from '../utils/gherkin';

describe(`Privacy policy works when`, () => {
  const { Given } = Gherkin({
    ...BASE_COMMANDS,
    'Im on privacy policy page': () => {
      BASE_COMMANDS[`I see text`]([`Privacy Policy`]);
      cy.url().should(`include`, `/privacy-policy/`);
    },
    'I scroll to': (text: string) => {
      cy.contains(text).scrollIntoView();
    },
    'I see policy headings': () => {
      const policyPageId = `[privacy-policy]:container`;

      cy.get(
        `[data-testid="${policyPageId}"] > h1, [data-testid="${policyPageId}"] > h2`,
      ).each((h) => {
        cy.contains(h.text()).scrollIntoView();
        BASE_COMMANDS[`System takes picture`](h.text());
      });
    },
    'I click privacy policy link': () => {
      cy.get(`[title="${`Check privacy policy` as Element}"]`).click({
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
      .And(`I see policy headings`);
  });
});
