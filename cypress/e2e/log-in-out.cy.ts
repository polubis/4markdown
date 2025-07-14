import { BASE_COMMANDS } from "../utils/commands";
import { gherkin } from "../utils/gherkin";

describe(`Log in and out works when`, () => {
  const given = gherkin({
    ...BASE_COMMANDS,
    "I log out": () => {
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
  });

  it(`user may log in and log out`, () => {
    given(`System has accepted cookies`)
      .and(`Im on page`, `home`)
      .when(`I log in`)
      .and(`I log out`);
  });
});
