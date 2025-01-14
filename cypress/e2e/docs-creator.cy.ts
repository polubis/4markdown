/* eslint-disable no-useless-escape */
import { BASE_COMMANDS } from '../utils/commands';
import { Gherkin } from '../utils/gherkin';

describe(`Docs creator works when`, () => {
  const { Given } = Gherkin({
    ...BASE_COMMANDS,
    'I test creator syntax': (content: string) => {
      Given(`I clear creator`)
        .And(`I type in creator`, content)
        .Then(`I wait`, 1000)
        .And(`System takes picture`)
        .When(`I click button`, [`Change theme`])
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
        .Then(`I see text`, [
          `Typography`,
          `Lists`,
          `Blocks`,
          `Thanks for using our editor!`,
        ])
        .And(`System takes picture`)
        .When(`I click button`, [`Close markdown cheatsheet`])
        .Then(`I not see text`, [
          `Typography`,
          `Lists`,
          `Blocks`,
          `Thanks for using our editor!`,
        ]);
    });
  });
});
