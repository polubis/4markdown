type ClickableControls =
  | 'Clear content'
  | 'Reset content'
  | `Change view display`
  | `Use markdown templates`
  | `Create new document`
  | `Open in separate window`
  | `Copy heading markdown`
  | `Copy link markdown`
  | `Copy image markdown`
  | `Copy code markdown`
  | `Copy table markdown`;
type TypeableControls = '';

const BASE_COMMANDS = {
  'I click button': (title: ClickableControls[]) => {
    cy.get(`button[title="${title}"]`).click();
  },
  'I see the same UI as before': () => {
    // cy.screenshot();
  },
  'I see disabled button': (titles: ClickableControls[]) => {
    titles.forEach((title) => {
      cy.get(`button[title="${title}"]`).should(`be.disabled`);
    });
  },
  'I type in input': (placeholder: TypeableControls, value: string) => {
    cy.get(
      `input[placeholder="${placeholder}"], textarea[placeholder="${placeholder}"]`,
    ).type(value);
  },
  'I type in creator': (value: string) => {
    cy.get(`textarea[aria-label="creator"]`).type(value);
  },
  'I see empty input': (placeholders: TypeableControls[]) => {
    placeholders.forEach((placeholder) => {
      cy.get(
        `input[placeholder="${placeholder}"], textarea[placeholder="${placeholder}"]`,
      ).should(`be.empty`);
    });
  },
  'I see text': (values: string[]) => {
    values.forEach((text) => {
      cy.contains(text, { matchCase: true }).should(`exist`);
    });
  },
  'I not see text': (values: string[]) => {
    values.forEach((text) => {
      cy.contains(text, { matchCase: true }).should(`not.exist`);
    });
  },
  'Im on page': (name: 'home') => {
    if (name === `home`) {
      cy.visit(`/`);
    }
  },
} as const;

export { BASE_COMMANDS };
