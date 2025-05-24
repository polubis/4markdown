import { BASE_COMMANDS, SELECT_COMMANDS } from '../utils/commands';
import { gherkin } from '../utils/gherkin';

describe(`Design System Components`, () => {
  const buttonVariantsContainerId = `button-variants-container`;

  const given = gherkin({
    ...BASE_COMMANDS,
    ...SELECT_COMMANDS,
    'I navigate to design system page': () => {
      cy.visit(`/design-system`);
    },
    'I take screenshot of button variants': () => {
      cy.get(`[data-testid="${buttonVariantsContainerId}"]`).scrollIntoView();
      BASE_COMMANDS[`System takes element picture`](
        `[data-testid="${buttonVariantsContainerId}"]`,
        `button-variants-screenshot`,
      );
    },
    'I take screenshot of individual button': (label: string) => {
      cy.contains(label).scrollIntoView();
      cy.contains(label)
        .parent()
        .find(`button`)
        .should(`be.visible`)
        .then(($button) => {
          const buttonId = `button-${label.replace(/[^a-zA-Z0-9]/g, `-`).toLowerCase()}`;
          cy.wrap($button).invoke(`attr`, `data-test-button-id`, buttonId);
          BASE_COMMANDS[`System takes element picture`](
            `[data-test-button-id="${buttonId}"]`,
            `button-variant-${label.replace(/[^a-zA-Z0-9]/g, `-`).toLowerCase()}`,
          );
          cy.wrap($button).invoke(`removeAttr`, `data-test-button-id`);
        });
    },
  });

  it(`captures screenshots of all button variants`, () => {
    given(`System has accepted cookies`)
      .and(`I set white theme`)
      .when(`I navigate to design system page`)
      .then(`I take screenshot of button variants`);

    const buttonLabels = [
      `s=1, i=1`,
      `s=1, i=2`,
      `s=2, i=1`,
      `s=2, i=2`,
      `auto s=1, i=1`,
      `auto s=1, i=2`,
      `auto s=2, i=1`,
      `auto s=2, i=2`,
      `pill s=1, i=2`,
      `pill s=2, i=2`,
      `disabled`,
    ];

    buttonLabels.forEach((label) => {
      given(`I take screenshot of individual button`, label);
    });
  });

  it(`verifies select component behavior`, () => {
    given(`System has accepted cookies`)
      .and(`I set white theme`)
      .when(`I navigate to design system page`)
      .and(`I select from`, `combobox`, `Banana`)
      .then(`I verify select value`, `combobox`, `Banana`)
      .when(`I select from`, `combobox`, `Apple`)
      .then(`I verify select value`, `combobox`, `Apple`);
  });
});
