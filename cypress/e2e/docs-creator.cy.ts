/* eslint-disable no-useless-escape */
import { BASE_COMMANDS } from '../utils/commands';
import { Gherkin } from '../utils/gherkin';

describe(`Docs creator works when`, () => {
  const { Given } = Gherkin({
    ...BASE_COMMANDS,
    'I scroll to': (text: string) => {
      cy.contains(text).scrollIntoView();
    },
    'I test creator syntax': (content: string, name: string) => {
      Given(`I clear creator`)
        .And(`I type in creator`, content)
        .Then(`I wait`, 1000)
        .And(`picture`, `${name}-before-change-theme`)
        .When(`I change theme`)
        .Then(`picture`, `${name}-after-change-theme`)
        .When(`I change theme`);
    },
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
      Given(`System has accepted cookies`)
        .And(`Im on page`, `home`)
        .And(`I see not disabled button`, [`Sign in`])
        .And(`theme is set to white`)
        .When(`I test creator syntax`, lists, `lists`)
        .And(`I test creator syntax`, math, `math`)
        .And(`I test creator syntax`, code, `code`)
        .And(`I test creator syntax`, headings, `headings`)
        .When(`I click button`, [`Cheatsheet`])
        .Then(`I see text`, cheatsheetText)
        .When(`I scroll to`, cheatsheetText[0])
        .Then(`picture`, `info-typography`)
        .When(`I scroll to`, cheatsheetText[1])
        .Then(`picture`, `info-lists`)
        .When(`I scroll to`, cheatsheetText[2])
        .Then(`picture`, `info-blocks`)
        .When(`I scroll to`, cheatsheetText[3])
        .Then(`picture`, `info-thanks`)
        .When(`I click button`, [`Close markdown cheatsheet`])
        .Then(`I not see text`, cheatsheetText);
    });
  });
});
