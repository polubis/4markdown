/* eslint-disable no-useless-escape */
import { BASE_COMMANDS } from '../utils/commands';
import { Gherkin } from '../utils/gherkin';

describe(`Docs creator works when`, () => {
  const { Given } = Gherkin({
    ...BASE_COMMANDS,
    'I scroll to': (text: string) => {
      cy.contains(text).scrollIntoView();
    },
    'I test creator syntax': (content: string) => {
      Given(`I clear creator`)
        .And(`I type in creator`, content)
        .Then(`I wait`, 1000)
        .And(`System takes picture`)
        .When(`I change theme`)
        .Then(`System takes picture`);
    },
  });

  before(() => {
    Given(`System sets pictures folder`, `docs-creator`);
  });

  beforeEach(() => {
    Given(`System cleans local storage`).And(`System has accepted cookies`);
  });

  afterEach(() => {
    Given(`System cleans local storage`);
  });

  after(() => {
    Given(`System cleans pictures setup`);
  });

  it(`user is able to create nested lists`, () => {
    const names = [`lists`, `math`, `code`, `headings`] as const;

    const cheatsheetText = [
      `Typography`,
      `Lists`,
      `Blocks`,
      `Thanks for using our editor!`,
    ];

    Cypress.Promise.all<string>(
      names.map((name) => cy.readFile(`cypress/samples/${name}.md`)),
    ).then(([lists, math, code, headings]) => {
      Given(`Im on page`, `home`)
        .And(`I see not disabled button`, [`Sign in`])
        .When(`I test creator syntax`, lists)
        .And(`I test creator syntax`, math)
        .And(`I test creator syntax`, code)
        .And(`I test creator syntax`, headings)
        .When(`I click button`, [`Cheatsheet`])
        .Then(`I see text`, cheatsheetText)
        .And(`I wait`, 1000)
        .And(`System takes picture`)
        .When(`I scroll to`, cheatsheetText[0])
        .And(`I wait`, 1000)
        .Then(`System takes picture`)
        .When(`I scroll to`, cheatsheetText[1])
        .And(`I wait`, 1000)
        .Then(`System takes picture`)
        .When(`I scroll to`, cheatsheetText[2])
        .And(`I wait`, 1000)
        .Then(`System takes picture`)
        .When(`I scroll to`, cheatsheetText[3])
        .And(`I wait`, 1000)
        .Then(`System takes picture`)
        .When(`I click button`, [`Close markdown cheatsheet`])
        .Then(`I not see text`, cheatsheetText);
    });
  });
});
