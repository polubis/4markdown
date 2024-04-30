import { gherkin } from '@greenstack/gherkin';
import { LOG_IN_OUT_SCENARIOS } from '../scenarios/log-in-out';
import { BASE_COMMANDS } from '../utils/commands';

describe(`Log in and out works when`, () => {
  const { given } = gherkin((_, key) => cy.log(key))(BASE_COMMANDS);

  beforeEach(() => {
    given(`System cleans local storage`).and(`Im on page`, `home`).done();
  });

  afterEach(() => {
    given(`System cleans local storage`)
      .and(`System cleans pictures setup`)
      .done();
  });

  it(`user may log in and log out`, () => {
    LOG_IN_OUT_SCENARIOS[`I log in`]()
      .when(`I click button`, [`Close your account panel`])
      .then(`I not see text`, [`Your Account`])
      .and(`I not see button`, [`Close your account panel`])
      .done();

    LOG_IN_OUT_SCENARIOS[`I log out`]().done();
  });
});
