import { BASE_COMMANDS } from '../utils/commands';
import { Gherkin } from '../utils/gherkin';

describe(`Docs management works when`, () => {
  const { Given } = Gherkin(BASE_COMMANDS);

  before(() => {
    Given(`System sets pictures folder`, `docs-management`).And(
      `System cleans local storage`,
    );
  });

  after(() => {
    Given(`System cleans pictures setup`).And(`System cleans local storage`);
  });

  it(`user may sign in and sign out`, () => {
    Given(`Im on page`, `home`).When(`I try to sign in`);
  });
});
