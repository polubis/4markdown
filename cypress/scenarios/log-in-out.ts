import { BASE_COMMANDS } from '../utils/commands';
import { gherkin } from '@greenstack/gherkin';

const { given } = gherkin((_, key) => cy.log(key))(BASE_COMMANDS);

const LOG_IN_OUT_SCENARIOS = {
  'I log in': () => {
    return given(`I see disabled button`, [`Sign in`])
      .and(`I see not disabled button`, [`Sign in`])
      .when(`I click button`, [`Sign in`])
      .then(`I not see button`, [`Sign in`])
      .and(`I see disabled button`, [`Your documents`])
      .when(`I click button`, [`User details and options`])
      .then(`I see text`, [`Your Account`])
      .and(`I see button`, [`Sign out`])
      .and(`I see not disabled button`, [`Your documents`]);
  },
  'I log out': () => {
    return given(`I click button`, [`User details and options`])
      .and(`I click button`, [`Sign out`])
      .then(`I see text`, [`Are You Sure?`])
      .when(`I click button`, [`Sign out`])
      .then(`I see button`, [`Sign in`])
      .and(`I not see button`, [
        `User details and options`,
        `Your documents`,
        `Change document name`,
        `More document options`,
      ]);
  },
};

export { LOG_IN_OUT_SCENARIOS };
