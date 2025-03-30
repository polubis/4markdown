import { BASE_COMMANDS } from '../utils/commands';

const LOG_IN_OUT_SCENARIOS = {
  'I log out': () => {
    BASE_COMMANDS[`I click button`]([`User details and options`]);
    BASE_COMMANDS[`I click button`]([`Sign out`]);
    BASE_COMMANDS[`I see text`]([`Are You Sure?`]);
    BASE_COMMANDS[`I click button`]([`Sign out`]);
    BASE_COMMANDS[`I see button`]([`Sign in`]);
    BASE_COMMANDS[`I not see button`]([
      `User details and options`,
      `Your documents`,
      `Change document name`,
      `More document options`,
    ]);
  },
} as const;

export { LOG_IN_OUT_SCENARIOS };
