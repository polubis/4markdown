type ClickableControls =
  | 'Clear content'
  | 'Reset content'
  | `Change view display`
  | `Use markdown templates`
  | `Create new document`
  | `Open in separate window`
  | `Copy headings markdown`
  | `Copy link markdown`
  | `Copy image markdown`
  | `Copy code markdown`
  | `Copy table markdown`
  | `Navigation`
  | `Change theme`
  | `Close navigation`
  | `Sign in`
  | `User details and options`
  | `Sign out`
  | `Close your account panel`
  | `Confirm document creation`
  | `Close document adding`
  | `Change document name`
  | `Save changes`
  | `Close document name edition`
  | `Confirm name change`
  | `More document options`
  | `Confirm document removal`
  | `Cancel document removal`
  | `Close document removal`
  | `Delete current document`
  | `Close additional options`
  | `Your documents`
  | `Close your documents`;

let acc = 1;
let folder: string | undefined;

const BASE_COMMANDS = {
  'I sign in': () => {
    BASE_COMMANDS[`I click button`]([`Clear content`, `Sign in`]);
  },
  'I click button': (titles: ClickableControls[]) => {
    titles.forEach((title) => {
      cy.get(`button[title="${title}"]`).click();
    });
  },
  'I see button': (titles: ClickableControls[]) => {
    titles.forEach((title) => {
      cy.get(`button[title="${title}"]`);
    });
  },
  'I clear input': (placeholders: string[]) => {
    placeholders.forEach((placeholder) => {
      cy.get(
        `input[placeholder="${placeholder}"], textarea[placeholder="${placeholder}"]`,
      );
    });
  },
  'I clear creator': () => {
    cy.get(`textarea[aria-label="creator"]`).type(`{selectall}{backspace}`);
  },
  'I reload page': () => {
    cy.reload();
    BASE_COMMANDS[`I move mouse`]();
  },
  'I move mouse': () => {
    cy.get(`body`).trigger(`mousemove`, { clientX: 100, clientY: 200 });
  },
  'System sets pictures folder': (name: string) => {
    folder = name;
  },
  'System cleans pictures setup': () => {
    acc = 1;
    folder = undefined;
  },
  'System cleans local storage': async () => {
    cy.clearAllLocalStorage();
    cy.window().then((win) => {
      const indexedDB = win.indexedDB;
      if (indexedDB) {
        indexedDB.databases().then((databases) => {
          databases.forEach((database) => {
            if (database.name) {
              indexedDB.deleteDatabase(database.name);
            }
          });
        });
      }
    });
  },
  'System takes picture': () => {
    if (!folder) {
      throw Error(`Please specify folder for pictures`);
    }
    cy.matchImageSnapshot(`${folder}-${acc}`, { capture: `viewport` });
    acc += 1;
  },
  'I paste in creator': async () => {
    // @TODO
    // const text = await navigator.clipboard.readText();
    // cy.get(`textarea[aria-label="creator"]`).invoke(`val`, text);
  },
  'I see disabled button': (titles: ClickableControls[]) => {
    titles.forEach((title) => {
      cy.get(`button[title="${title}"]`).should(`be.disabled`);
    });
  },
  'I see not disabled button': (titles: ClickableControls[]) => {
    titles.forEach((title) => {
      cy.get(`button[title="${title}"]`).should(`be.enabled`);
    });
  },
  'I not see button': (title: ClickableControls[]) => {
    cy.get(`button[title="${title}"]`).should(`not.exist`);
  },
  'I type in input': (placeholder: string, value: string) => {
    cy.get(
      `input[placeholder="${placeholder}"], textarea[placeholder="${placeholder}"]`,
    ).type(value);
  },
  'I type in creator': (value: string) => {
    cy.get(`textarea[aria-label="creator"]`).type(value);
  },
  'I see empty creator': () => {
    cy.get(`textarea[aria-label="creator"]`).should(`be.empty`);
  },
  'I see empty input': (placeholders: string[]) => {
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
