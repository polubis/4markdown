/* eslint-disable no-useless-escape */
import { BASE_COMMANDS } from '../utils/commands';
import { Gherkin } from '../utils/gherkin';

describe(`Docs creator works when`, () => {
  const cheatsheetModalId = `[cheatsheet-modal]:container`;

  const { Given } = Gherkin({
    ...BASE_COMMANDS,
    'I scroll to': (text: string) => {
      cy.contains(text).scrollIntoView();
    },
    'I check block': (text: string) => {
      Given(`I scroll to`, text);
      BASE_COMMANDS[`System takes element picture`](
        `[data-testid="${cheatsheetModalId}"]`,
        text,
      );
    },
    'I test creator syntax': (content: string, name: string) => {
      Given(`I clear creator`)
        .And(`I type in creator`, content)
        .Then(`I wait`, 1000)
        .And(`System takes picture`, `${name}-before-change-theme`)
        .When(`I change theme`)
        .Then(`System takes picture`, `${name}-after-change-theme`)
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
        .And(`I set white theme`)
        .When(`I test creator syntax`, lists, `lists`)
        .And(`I test creator syntax`, math, `math`)
        .And(`I test creator syntax`, code, `code`)
        .And(`I test creator syntax`, headings, `headings`)
        .When(`I click button`, [`Cheatsheet`])
        .Then(`I see text`, cheatsheetText)
        .When(`I scroll to`, `Application logo`)
        .And(`I wait`, 2000)
        .And(`I check block`, cheatsheetText[0])
        .And(`I check block`, cheatsheetText[1])
        .And(`I check block`, cheatsheetText[2])
        .And(`I check block`, cheatsheetText[3])
        .When(`I click button`, [`Close markdown cheatsheet`])
        .Then(`I not see text`, cheatsheetText);
    });
  });
});
