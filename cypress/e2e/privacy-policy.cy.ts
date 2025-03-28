import type { Element } from '../utils/commands';
import { BASE_COMMANDS } from '../utils/commands';
import { Gherkin } from '../utils/gherkin';

describe(`Privacy policy works when`, () => {
  const policyPageId = `[privacy-policy]:container`;

  const { Given } = Gherkin({
    ...BASE_COMMANDS,
    'Im on privacy policy page': () => {
      Given(`I see text`, [`Privacy Policy`]);
      cy.url().should(`include`, `/privacy-policy/`);
    },
    'I scroll to': (text: string) => {
      cy.contains(text).scrollIntoView();
    },
    'I see policy headings': () => {
      cy.get(
        `[data-testid="${policyPageId}"] > h1, [data-testid="${policyPageId}"] > h2`,
      ).each((h) => {
        cy.contains(h.text()).scrollIntoView();
        Given(`System takes picture`);
      });
    },
    'I click privacy policy link': () => {
      cy.get(`[title="${`Check privacy policy` as Element}"]`).click({
        force: true,
      });
    },
  });

  before(() => {
    Given(`System sets pictures folder`, `privacy-policy`).And(
      `System has accepted cookies`,
    );
  });

  beforeEach(() => {
    Given(`System cleans local storage`);
  });

  afterEach(() => {
    Given(`System cleans local storage`);
  });

  after(() => {
    Given(`System cleans pictures setup`);
  });

  it(`there is no regression for desktop and different themes`, () => {
    Given(`Im on page`, `home`)
      .And(`I see not disabled button`, [`Sign in`])
      .When(`I click button`, [`Navigation`])
      .Then(`I see not disabled button`, [`Close navigation`])
      .When(`I click privacy policy link`)
      .Then(`Im on privacy policy page`)
      .And(`I see not disabled button`, [`Sign in`])
      .And(`I see policy headings`);
  });
});
