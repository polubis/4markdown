import { BASE_COMMANDS } from '../utils/commands';
import { Gherkin } from '../utils/gherkin';

describe(`Permament documents works when`, () => {
  const { Given } = Gherkin({
    ...BASE_COMMANDS,
    'I click explore "Naming generics in TypeScript"': () => {
      cy.get(`a[title="Explore Naming generics in TypeScript"]`).click();
    },
    'I see unchanged elements': () => {
      cy.get(`.markdown > div > :is(h1, h2, h3, h4, h5, h6)`).each(
        (element) => {
          cy.contains(element.text()).scrollIntoView();
          Given(`System takes picture`);
        },
      );
    },
    'I click explore "Creating reusable and framework agnostic link component"':
      () => {
        cy.get(
          `a[title="Creating reusable and framework agnostic link component"]`,
        ).click();
      },
    'I see unchanged user section': () => {
      cy.contains(`About Author`, { matchCase: true })
        .should(`exist`)
        .scrollIntoView();
      Given(`System takes picture`);
    },
  });

  before(() => {
    Given(`System sets pictures folder`, `permament-docs`);
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

  it(`user see unchanged permament document`, () => {
    Given(`Im on page`, `education-zone`)
      .Then(`I see text`, [
        `Naming generics in TypeScript`,
        `Why you should start using Zod`,
        `Managing legacy URLs on Netlify`,
        `Implementing Queue in JavaScript`,
        `Using Zod and TypeScript to write typesafe code`,
        `Creating reusable and framework agnostic link component`,
      ])
      .When(`I click explore "Naming generics in TypeScript"`)
      .Then(`I see unchanged elements`);
  });

  it(`custom avatar is displayed for user with display name and bio but without avatar`, () => {
    Given(`Im on page`, `education-zone`).Then(`I see text`, [
      `Naming generics in TypeScript`,
      `Why you should start using Zod`,
      `Managing legacy URLs on Netlify`,
      `Implementing Queue in JavaScript`,
      `Using Zod and TypeScript to write typesafe code`,
      `Creating reusable and framework agnostic link component`,
    ]);
    // Given(`Im on page`, `education-zone`).When(
    //   `I click explore "Creating reusable and framework agnostic link component"`,
    // );
    // .Then(`I see unchanged user section`);
  });
});
