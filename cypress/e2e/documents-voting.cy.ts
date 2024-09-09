import { BASE_COMMANDS } from '../utils/commands';
import { Gherkin } from '../utils/gherkin';
import { uid } from '../utils/uid';

describe(`Voting for documents works when`, () => {
  const parentSelector = `[data-testid="[document-rating]:container"]`;
  const expectedAmountOfVotingIcons = 5;

  const { Given } = Gherkin({
    ...BASE_COMMANDS,
    'I see votes for each document in education zone': () => {
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
    'I see update rating section': () => {
      Given(`I see button`, [
        `Rate as bad`,
        `Rate as decent`,
        `Rate as good`,
        `Rate as perfect`,
        `Rate as ugly`,
      ]);
    },
    // 'I rate document': () => {
    //   // cy.get(parentSelector).should(`have.length`, 1);
    //   // cy.get(`${parentSelector} svg`).should(
    //   //   `have.length`,
    //   //   expectedAmountOfVotingIcons,
    //   // );
    //   0,2,0,0,2
    //   const initialVotes: string[] = [];

    //   cy.get(`${parentSelector} strong`).each((element) => {
    //     const text = element.text().trim();
    //     expect(text).to.match(/^\d+$/);
    //     initialVotes.push(text);
    //   });

    //   Given(`I click button`, [`Rate as ugly`]);

    //   const votesAfterFirstIteration: string[] = [];

    //   cy.get(`${parentSelector} strong`).each((element) => {
    //     const text = element.text().trim();
    //     expect(text).to.match(/^\d+$/);
    //     votesAfterFirstIteration.push(text);
    //   });

    //   cy.wrap(votesAfterFirstIteration).then((arr) => {
    //     expect(arr[0]).to.equal(`0`);
    //     expect(arr[arr.length - 1]).equal(`1`);
    //   });
    // },
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
    const documentName = `${uid(`documents voting`)}`;

    Given(`Im on page`, `education-zone`)
      .And(`I see votes for each document in education zone`)
      .When(`I click first document in education zone`)
      .Then(`I see votes at the top of the document`)
      .When(`I click button`, [`Sign in to rate`])
      .And(`I see update rating section`)
      .When(`I click elements`, [`Go to creator`])
      .And(`I click button`, [`Create new document`])
      .And(`I type in input`, `Type document name`, documentName)
      .Then(`I see not disabled button`, [`Confirm document creation`])
      .When(`I click button`, [`Confirm document creation`])
      .Then(`I see disabled button`, [
        `Confirm document creation`,
        `Close document adding`,
      ])
      .And(`I not see button`, [
        `Confirm document creation`,
        `Close document adding`,
      ])
      .And(`I see text`, [documentName])
      .When(`I click button`, [
        `More document options`,
        `Make this document public`,
        `Confirm public document status change`,
      ])
      .Then(`I see disabled button`, [`Confirm public document status change`])
      .When(`I click button`, [`Document preview`])
      .Then(`I see text`, [`Wait... Checking required stuff (～￣▽￣)～`])
      .And(`I see votes at the top of the document`)
      .And(`I see update rating section`);
  });
});
