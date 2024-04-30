import { gherkin } from '@greenstack/gherkin';
import { DOCS_MANAGEMENT_SCENARIOS } from '../scenarios/docs-management';
import { LOG_IN_OUT_SCENARIOS } from '../scenarios/log-in-out';
import { BASE_COMMANDS } from '../utils/commands';

describe(`Docs management works when`, () => {
  const { given } = gherkin((_, key) => cy.log(key))(BASE_COMMANDS);

  beforeEach(() => {
    given(`System cleans local storage`).and(`Im on page`, `home`).done();
  });

  afterEach(() => {
    given(`System cleans pictures setup`)
      .and(`System cleans local storage`)
      .done();
  });

  it(`user may create, edit and delete document`, () => {
    LOG_IN_OUT_SCENARIOS[`I log in`]()
      .when(`I click button`, [`Close your account panel`])
      .done();
    DOCS_MANAGEMENT_SCENARIOS[`I create, edit and delete document`]().done();
  });

  it(`user may change document visiblity`, () => {
    LOG_IN_OUT_SCENARIOS[`I log in`]()
      .when(`I click button`, [`Close your account panel`])
      .done();
    DOCS_MANAGEMENT_SCENARIOS[`I change document visiblity`]().done();
  });
});
