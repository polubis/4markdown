import { BASE_COMMANDS } from '../utils/commands';
import { gherkin } from '../utils/gherkin';

describe(`Creator sync works when`, () => {
  const given = gherkin({
    ...BASE_COMMANDS,
    'I see sidebar': () => {
      cy.get(`[data-testid="[menu-nav-sidebar]:container"]`).should(`exist`);
    },
    'I see no sidebar': () => {
      cy.get(`[data-testid="[menu-nav-sidebar]:container"]`).should(
        `not.exist`,
      );
    },
  });

  it(`user see changes from local storage after page refresh`, () => {
    given(`System has accepted cookies`)
      .and(`Im on page`, `home`)
      .and(`I see not disabled button`, [`Sign in`])
      .and(`I set white theme`)
      .when(`I click button`, [`Navigation`])
      .then(`I see sidebar`)
      .and(`I wait`, 1000)
      .and(`System takes picture`, `before-change-theme`)
      .when(`I click button`, [`Change theme`])
      .then(`I wait`)
      .and(`System takes picture`, `after-change-theme`)
      .when(`I click button`, [`Close navigation`])
      .then(`I see no sidebar`)
      .when(`I clear creator`)
      .and(`I type in creator`, `## Markdown local storage sync test`)
      .then(`I see text`, [
        `## Markdown local storage sync test`,
        `Markdown local storage sync test`,
      ])
      .when(`I reload page`)
      .then(`I see text`, [
        `## Markdown local storage sync test`,
        `Markdown local storage sync test`,
      ]);
  });
});
