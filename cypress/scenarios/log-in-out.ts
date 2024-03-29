import { BASE_COMMANDS } from '../utils/commands';
import { Gherkin } from '../utils/gherkin';

const { When, Given } = Gherkin(BASE_COMMANDS);

const LOG_IN_OUT_SCENARIOS = {
  'I log in': () => {
    return Given(`I see disabled button`, [`Sign in`])
      .And(`I see not disabled button`, [`Sign in`])
      .When(`I click button`, [`Sign in`])
      .Then(`I not see button`, [`Sign in`])
      .And(`I see disabled button`, [`Your documents`])
      .When(`I click button`, [`User details and options`])
      .Then(`I see text`, [`Your Account`])
      .And(`I see button`, [`Sign out`])
      .And(`I see not disabled button`, [`Your documents`]);
  },
  'I log out': () => {
    return When(`I click button`, [`User details and options`])
      .And(`I click button`, [`Sign out`])
      .Then(`I see text`, [`Are You Sure?`])
      .When(`I click button`, [`Sign out`])
      .Then(`I see button`, [`Sign in`])
      .And(`I not see button`, [
        `User details and options`,
        `Your documents`,
        `Change document name`,
        `More document options`,
      ]);
  },
} as const;

export { LOG_IN_OUT_SCENARIOS };
