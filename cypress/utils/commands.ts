type ClickableControls =
  | 'Clear content'
  | 'Sync your profile'
  | 'Reset content'
  | `Create new document`
  | `Open in separate window`
  | `Copy headings markdown`
  | `Copy link markdown`
  | `Copy image markdown`
  | `Open markdown toolbox`
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
  | `Close your documents`
  | `Make this document public`
  | `Make this document private`
  | `Make this document permanent`
  | `Document preview`
  | `Sync documents`
  | `Confirm permanent document policy`
  | `Make document permanent`
  | `Confirm public document status change`
  | `Confirm private document status change`
  | `Edit current document`
  | `Open user profile settings`
  | `Create your user profile`
  | `Close your profile form`
  | `Back to user profile`
  | `Save user profile`
  | `Add your avatar`
  | `Recent documents`
  | `Old documents`
  | `Really Old documents`
  | `Accept cookies`
  | `Accept customized cookies`
  | `Cheatsheet`
  | `Close markdown cheatsheet`
  | `Close error screen`;

type Element =
  | `Create any content`
  | `Your Github link`
  | `Your Twitter link`
  | `Your Facebook link`
  | `Your Blog link`
  | `Your LinkedIn link`
  | `Check privacy policy`
  | `Continue editing the document`
  | `Create a new document`;

type Endpoint =
  | `getYourUserProfile`
  | `getYourDocuments`
  | `getAccessibleDocument`;

let acc = 1;
let folder: string | undefined;

type Section =
  | `[user-profile]:no-profile-yet`
  | `[user-profile]:profile-loading`
  | `[user-profile]:profile-ready`
  | `[user-profile-form]:container`;

const BASE_COMMANDS = {
  'I change to default viewport': () => {
    BASE_COMMANDS[`I change viewport`](1000, 600);
  },
  'I change viewport': (width: number, height: number) => {
    cy.viewport(width, height);
    cy.window().should(`have.property`, `innerWidth`, width);
    cy.window().should(`have.property`, `innerHeight`, height);
  },
  'I see text in creator': (value: string) => {
    cy.get(`textarea[aria-label="creator"]`)
      .invoke(`val`)
      .should(`include`, value);
  },
  'I see section': (section: Section) => {
    cy.get(`[data-testid="${section}"]`).should(`exist`);
  },
  'I not see section': (section: Section) => {
    cy.get(`[data-testid="${section}"]`).should(`not.exist`);
  },
  'I sign in': () => {
    BASE_COMMANDS[`I click button`]([`Clear content`, `Sign in`]);
  },
  'I open app navigation': () => {
    BASE_COMMANDS[`I click button`]([`Navigation`]);
  },
  'I change theme': () => {
    BASE_COMMANDS[`I open app navigation`]();
    cy.get(`[data-testid="[menu-nav-sidebar]:container"]`)
      .should(`be.visible`)
      .then(() => {
        BASE_COMMANDS[`I click button`]([`Change theme`, `Close navigation`]);
        cy.get(`[data-testid="[menu-nav-sidebar]:container"]`).should(
          `not.be.visible`,
        );
      });
  },
  'I click button': (titles: ClickableControls[]) => {
    titles.forEach((title) => {
      cy.get(`button[title="${title}"]`).click();
    });
  },
  'I click elements': (elements: Element[]) => {
    elements.forEach((element) => {
      cy.get(`[title="${element}"]`).click({ force: true });
    });
  },
  'I see elements': (elements: Element[]) => {
    elements.forEach((element) => {
      cy.get(`[title="${element}"]`);
    });
  },
  'I wait': (ms = 500) => {
    cy.wait(ms);
  },
  'I select document': (title: string) => {
    cy.get(`li[title="${title}"]`).click();
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
      ).type(`{selectall}{backspace}`);
    });
  },
  'I clear creator': () => {
    cy.get(`textarea[aria-label="creator"]`).type(`{selectall}{backspace}`);
  },
  'I reload page': () => {
    // cy.reload();
  },
  'System sets pictures folder': (name: string) => {
    folder = name;
  },
  'System cleans pictures setup': () => {
    acc = 1;
    folder = undefined;
  },
  'System has accepted cookies': () => {
    cy.setCookie(`acceptance`, `true`);
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
  'System mocks api': (config: {
    endpoint: Endpoint;
    code: number;
    response: Record<string | number | symbol, unknown>;
    delay?: number;
  }) => {
    cy.intercept(
      {
        method: `POST`,
        url: `**/**cloudfunctions.net/${config.endpoint}`,
      },
      (req) => {
        req.reply({
          delay: config.delay ?? 1000,
          statusCode: config.code,
          body: config.response,
        });
      },
    ).as(config.endpoint);
  },
  'I wait for api': (endpoint: Endpoint, code: number) => {
    cy.wait(`@${endpoint}`).its(`response.statusCode`).should(`equal`, code);
  },
  'System takes picture': () => {
    // 1000x660 viewport, full screen, 2x sidebars open, Hp monitor, 100% zoom.
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
    cy.get(`textarea[aria-label="creator"]`)
      .invoke(`val`, value)
      .trigger(`input`)
      .blur();
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
  'Im on page': (name: 'home' | `education-zone`) => {
    if (name === `home`) {
      cy.visit(`/`);
    }

    if (name === `education-zone`) {
      cy.visit(`/education-zone/`);
    }
  },
  'I interact with mouse': () => {
    cy.get(`body`)
      .trigger(`mouseover`)
      .trigger(`mousedown`, { which: 1 })
      .trigger(`mousemove`, {
        clientX: 100,
        clientY: 100,
        screenX: 100,
        screenY: 100,
        pageX: 100,
        pageY: 100,
      })
      .trigger(`mouseup`, { which: 1 });
  },
  'I accept cookies': () => {
    BASE_COMMANDS[`I interact with mouse`]();
    BASE_COMMANDS[`I click button`]([`Clear content`, `Accept cookies`]);
  },
} as const;

export type { Element, ClickableControls };
export { BASE_COMMANDS };
