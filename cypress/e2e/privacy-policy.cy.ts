import { BASE_COMMANDS } from '../utils/commands';
import { Gherkin } from '../utils/gherkin';

describe(`Privacy policy works when`, () => {
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
      cy.get(`h2`).each(($h2) => {
        cy.contains($h2.text()).scrollIntoView();
        Given(`System takes picture`);
      });
    },
    'I see well aligned UI on mobile': () => {
      cy.viewport(320, 800);
      Given(`System takes picture`);
    },
  });

  before(() => {
    Given(`System sets pictures folder`, `privacy-policy`);
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

  it(`there is no regression for different devices and themes`, () => {
    Given(`Im on page`, `home`)
      .When(`I click button`, [`Navigation`])
      .Then(`I see not disabled button`, [`Close navigation`])
      .When(`I click elements`, [`Check privacy policy`])
      .Then(`Im on privacy policy page`)
      .When(`I scroll to`, `Privacy Policy`)
      .Then(`System takes picture`)
      .And(`I see policy headings`)
      .And(`I see well aligned UI on mobile`);
  });
});
