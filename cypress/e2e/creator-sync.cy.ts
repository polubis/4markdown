import { BASE_COMMANDS } from '../utils/commands';
import { Gherkin } from '../utils/gherkin';

describe(`Creator sync works when`, () => {
  const { Given } = Gherkin({
    ...BASE_COMMANDS,
    'I verify navigation sidebar': () => {
      Given(`I open app navigation`);

      cy.get(`[data-testid="[menu-nav-sidebar]:container"]`)
        .should(`be.visible`)
        .wait(500)
        .then(() => {
          Given(`System takes picture`)
            .When(`I click button`, [`Change theme`])
            .Then(`System takes picture`)
            .When(`I click button`, [`Close navigation`]);

          cy.get(`[data-testid="[menu-nav-sidebar]:container"]`).should(
            `not.be.visible`,
          );
        });
    },
  });

  before(() => {
    Given(`System sets pictures folder`, `creator-sync`);
  });

  beforeEach(() => {
    Given(`System cleans local storage`)
      .And(`System has accepted cookies`)
      .And(`Im on page`, `home`);
  });

  after(() => {
    Given(`System cleans pictures setup`).And(`System cleans local storage`);
  });

  it(`user see changes from local storage after page refresh`, () => {
    Given(`I see not disabled button`, [`Sign in`])
      .And(`I verify navigation sidebar`)
      .And(`I clear creator`)
      .And(`I type in creator`, `## Markdown local storage sync test`)
      .Then(`I see text`, [
        `## Markdown local storage sync test`,
        `Markdown local storage sync test`,
      ])
      .When(`I reload page`)
      .Then(`I see text`, [
        `## Markdown local storage sync test`,
        `Markdown local storage sync test`,
      ]);
  });
});
