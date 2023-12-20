import { BASE_COMMANDS } from '../utils/commands';
import { Gherkin } from '../utils/gherkin';

const { When } = Gherkin(BASE_COMMANDS);

const LOG_IN_OUT_SCENARIOS = {
  'I log in': () => {
    return When(`I click button`, [`Clear content`, `Sign in`])
      .Then(`I see disabled button`, [`Sign in`])
      .And(`I not see button`, [`Sign in`])
      .And(`I see not disabled button`, [`User details and options`])
      .And(`I see text`, [`Your Account`]);
  },
  'I log out': () => {
    When(`I click button`, [`User details and options`])
      .And(`I click button`, [`Sign out`])
      .Then(`I see text`, [`Are You Sure?`])
      .When(`I click button`, [`Sign out`])
      .Then(`I see button`, [`Sign in`])
      .And(`I not see button`, [`User details and options`]);
  },
} as const;

export { LOG_IN_OUT_SCENARIOS };
