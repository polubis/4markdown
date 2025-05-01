import { type API4MarkdownContractKey } from 'api-4markdown-contracts';

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
  | `Close error screen`
  | `Open search`
  | `Close search`
  | `Go to manual document creation form`;

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

type Section =
  | `[user-profile]:no-profile-yet`
  | `[user-profile]:profile-loading`
  | `[user-profile]:profile-ready`
  | `[user-profile-form]:container`;

const BASE_COMMANDS = {
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
  'I open app navigation': () => {
    BASE_COMMANDS[`I click button`]([`Navigation`]);
  },
  'I change theme': () => {
    BASE_COMMANDS[`I open app navigation`]();
    cy.get(`[data-testid="[menu-nav-sidebar]:container"]`).should(`exist`);
    BASE_COMMANDS[`I click button`]([`Change theme`, `Close navigation`]);
    cy.get(`[data-testid="[menu-nav-sidebar]:container"]`).should(`not.exist`);
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
  'I set white theme': () => {
    cy.get(`body`)
      .invoke(`attr`, `class`)
      .then((classList) => {
        const isDark = !!classList?.includes(`dark`);

        if (isDark) {
          BASE_COMMANDS[`I click button`]([
            `Navigation`,
            `Change theme`,
            `Close navigation`,
          ]);
        }
      });
  },
  'System has accepted cookies': () => {
    cy.setCookie(`acceptance`, `true`);
  },
  // @TODO[PRIO=2]: [add here generic type inference].
  'System mocks api': (config: {
    endpoint: API4MarkdownContractKey;
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
  'I wait for api': (endpoint: API4MarkdownContractKey, code: number) => {
    cy.wait(`@${endpoint}`).its(`response.statusCode`).should(`equal`, code);
  },
  'System takes picture': (name: string) => {
    cy.matchImageSnapshot(name, { capture: `viewport` });
  },
  'System takes element picture': (selector: string, name: string) => {
    cy.get(selector).matchImageSnapshot(name, { capture: `viewport` });
  },
  'I log in': () => {
    BASE_COMMANDS[`I see disabled button`]([`Sign in`]);
    BASE_COMMANDS[`I see not disabled button`]([`Sign in`]);
    BASE_COMMANDS[`I click button`]([`Sign in`]);
    BASE_COMMANDS[`I not see button`]([`Sign in`]);
    BASE_COMMANDS[`I see disabled button`]([`Your documents`]);
    BASE_COMMANDS[`I click button`]([`User details and options`]);
    BASE_COMMANDS[`I see text`]([`Your Account & Profile`]);
    BASE_COMMANDS[`I see button`]([`Sign out`]);
    BASE_COMMANDS[`I see not disabled button`]([`Your documents`]);
    BASE_COMMANDS[`I click button`]([`Close your account panel`]);
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
} as const;

export const SELECT_COMMANDS = {
  'I select from': (selectRole: string, optionLabel: string) => {
    cy.get(`[role="${selectRole}"]`).click();
    cy.get(`[role="listbox"]`).contains(optionLabel).click();
  },
  'I verify select value': (selectRole: string, value: string) => {
    cy.get(`[role="${selectRole}"]`).contains(value).should(`be.visible`);
  },
  'I press key on': (selectRole: string, key: string) => {
    cy.get(`[role="${selectRole}"]`).type(key);
  },
  'I verify select option': (option: string) => {
    cy.get(`[role="listbox"]`).contains(option).should(`be.visible`);
  },
  'I verify disabled select': () => {
    cy.get(`[role="combobox"][aria-disabled="true"]`).should(`exist`);
  },
} as const;

export type { Element, ClickableControls };
export { BASE_COMMANDS };
