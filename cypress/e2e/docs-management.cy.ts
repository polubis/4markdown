import { DOCS_MANAGEMENT_SCENARIOS } from '../scenarios/docs-management';
import { LOG_IN_OUT_SCENARIOS } from '../scenarios/log-in-out';
import { BASE_COMMANDS } from '../utils/commands';
import { Gherkin } from '../utils/gherkin';

describe(`Docs management works when`, () => {
  const { Given } = Gherkin(BASE_COMMANDS);

  beforeEach(() => {
    Given(`System cleans local storage`)
      .And(`Im on page`, `home`)
      .And(`System has accepted cookies`);
  });

  afterEach(() => {
    Given(`System cleans pictures setup`).And(`System cleans local storage`);
  });

  it(`user may create, edit, delete document and change its visibility`, () => {
    LOG_IN_OUT_SCENARIOS[`I log in`]().When(`I click button`, [
      `Close your account panel`,
    ]);
    DOCS_MANAGEMENT_SCENARIOS[`I create, edit and delete document`]();
    DOCS_MANAGEMENT_SCENARIOS[`I change document visiblity`]();
  });
});
