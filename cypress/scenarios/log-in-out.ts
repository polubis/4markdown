import { BASE_COMMANDS } from '../utils/commands';
import { Gherkin } from '../utils/gherkin';

const { Given } = Gherkin(BASE_COMMANDS);

const LOG_IN_OUT_SCENARIOS = {
  'I log in': () => {
    return Given(`Im on page`, `home`)
      .When(`I click button`, [`Clear content`, `Sign in`])
      .Then(`I not see button`, [`Sign in`])
      .When(`I click button`, [`User details and options`])
      .And(`I see text`, [`Your Account`]);
  },
  'I log out': () => {
    return Given(`Im on page`, `home`)
      .When(`I click button`, [`User details and options`])
      .And(`I click button`, [`Sign out`])
      .Then(`I see text`, [`Are You Sure?`])
      .When(`I click button`, [`Sign out`])
      .Then(`I see button`, [`Sign in`])
      .And(`I not see button`, [`User details and options`]);
  },
} as const;

export { LOG_IN_OUT_SCENARIOS };
