import { DOCS_MANAGEMENT_SCENARIOS } from '../scenarios/docs-management';
import { LOG_IN_OUT_SCENARIOS } from '../scenarios/log-in-out';
import { BASE_COMMANDS } from '../utils/commands';
import { Gherkin } from '../utils/gherkin';

describe(`Docs management works when`, () => {
  const { Given } = Gherkin(BASE_COMMANDS);

  beforeEach(() => {
    Given(`System cleans local storage`).And(`Im on page`, `home`);
  });

  afterEach(() => {
    Given(`System cleans pictures setup`).And(`System cleans local storage`);
  });

  it(`user may create, edit and delete document`, () => {
    Given(`System sets pictures folder`, `docs-management`);

    LOG_IN_OUT_SCENARIOS[`I log in`]().When(`I click button`, [
      `Close your account panel`,
    ]);
    DOCS_MANAGEMENT_SCENARIOS[`I create, edit and delete document`]().When(
      `I click button`,
      [`Change theme`],
    );
    DOCS_MANAGEMENT_SCENARIOS[`I create, edit and delete document`]();
  });

  it(`user may change document visiblity`, () => {
    Given(`System sets pictures folder`, `docs-visiblity`);

    LOG_IN_OUT_SCENARIOS[`I log in`]().When(`I click button`, [
      `Close your account panel`,
    ]);
    DOCS_MANAGEMENT_SCENARIOS[`I change document visiblity`]();
  });
});
