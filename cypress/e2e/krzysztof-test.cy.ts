import { BASE_COMMANDS } from '../utils/commands';
import { Gherkin } from '../utils/gherkin';

describe(`Document creation works when`, () => {
  const { Given } = Gherkin(BASE_COMMANDS);

  it('feature is off for not authorized users', () => {
    Given(`Im on page`, `home`).When(`I click button`, ['Sign in']);
  });
});


// const dasidhjsas dadadsadasd