import { BASE_COMMANDS } from '../utils/commands';
import { Gherkin } from '../utils/gherkin';

describe(`Creator sync works when`, () => {
  const { Given } = Gherkin({
    ...BASE_COMMANDS,
    'I see sidebar': () => {
      cy.get(`[data-testid="[menu-nav-sidebar]:container"]`).should(
        `be.visible`,
      );
    },
    'I see no sidebar': () => {
      cy.get(`[data-testid="[menu-nav-sidebar]:container"]`).should(
        `not.be.visible`,
      );
    },
  });

  it(`user see changes from local storage after page refresh`, () => {
    Given(`System has accepted cookies`)
      .And(`Im on page`, `home`)
      .And(`I see not disabled button`, [`Sign in`])
      .When(`I click button`, [`Navigation`])
      .Then(`I see sidebar`)
      .And(`I wait`, 1000)
      .And(`picture`, `before-change-theme`)
      .When(`I click button`, [`Change theme`])
      .Then(`I wait`)
      .And(`picture`, `after-change-theme`)
      .When(`I click button`, [`Close navigation`])
      .Then(`I see no sidebar`)
      .When(`I clear creator`)
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
