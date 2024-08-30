import { BASE_COMMANDS } from '../utils/commands';
import { Gherkin } from '../utils/gherkin';

describe(`Voting for documents works when`, () => {
  const { Given } = Gherkin({
    ...BASE_COMMANDS,
    'I see votes for each document in education zone': () => {
      const expectedAmountOfVotingIcons = 5;
      const parentSelector = `[data-testid="[document-rating]:container"]`;

      cy.get(`main > ul > li`).then((elements) => {
        cy.get(parentSelector).should(`have.length`, elements.length);
        cy.get(`${parentSelector} svg`).should(
          `have.length`,
          elements.length * expectedAmountOfVotingIcons,
        );
        cy.get(`${parentSelector} strong`)
          .should(`have.length`, elements.length * expectedAmountOfVotingIcons)
          .each((element) => {
            const text = element.text().trim();
            expect(text).to.match(/^\d+$/);
          });
      });
    },
    'I click first document in education zone': () => {
      cy.get(`main > ul > li:first-of-type a`).click();
    },
    'I see votes at the top of the document': () => {
      const expectedAmountOfVotingIcons = 5;
      const parentSelector = `[data-testid="[document-rating]:container"]`;

      cy.get(parentSelector).should(`have.length`, 1);
      cy.get(`${parentSelector} svg`).should(
        `have.length`,
        expectedAmountOfVotingIcons,
      );
      cy.get(`${parentSelector} strong`)
        .should(`have.length`, expectedAmountOfVotingIcons)
        .each((element) => {
          const text = element.text().trim();
          expect(text).to.match(/^\d+$/);
        });
    },
    'I change rate': () => {
      Given(`I see button`, [
        `Rate as bad`,
        `Rate as decent`,
        `Rate as good`,
        `Rate as perfect`,
        `Rate as ugly`,
      ])
        .When(`I click button`, [`Rate as good`])
        .Then(`I see button`, [`Change document rate`]);
    },
  });

  before(() => {
    Given(`System sets pictures folder`, `documents-voting`);
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

  it(`user may vote when he is signed in and checking non-private documents`, () => {
    Given(`Im on page`, `education-zone`)
      .And(`I see votes for each document in education zone`)
      .When(`I click first document in education zone`)
      .Then(`I see votes at the top of the document`)
      .When(`I click button`, [`Sign in to rate`])
      .And(`I change rate`);
  });
});
