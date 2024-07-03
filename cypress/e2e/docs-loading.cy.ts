/* eslint-disable no-template-curly-in-string */
import { LOG_IN_OUT_SCENARIOS } from '../scenarios/log-in-out';
import { BASE_COMMANDS } from '../utils/commands';
import { Gherkin } from '../utils/gherkin';
import { GET_DOCS_RESPONSE } from '../utils/mocks';

describe(`Documents loading works when`, () => {
  const { Given } = Gherkin(BASE_COMMANDS);

  beforeEach(() => {
    Given(`System sets pictures folder`, `docs-loading`)
      .And(`System cleans local storage`)
      .And(`Im on page`, `home`);
  });

  afterEach(() => {
    Given(`System cleans local storage`).And(`System cleans pictures setup`);
  });

  it(`loaded documents view match design`, () => {
    Given(`System mocks api`, {
      endpoint: `getDocs`,
      code: 200,
      response: GET_DOCS_RESPONSE,
    });

    LOG_IN_OUT_SCENARIOS[`I log in`]()
      .When(`I click button`, [`Close your account panel`])
      .Then(`I not see button`, [`Close your account panel`])
      .And(`I see not disabled button`, [`Your documents`])
      .When(`I click button`, [`Your documents`])
      .Then(`I see text`, [`Mediator pattern in TypeScript`])
      .And(`I wait`, 1500)
      .And(`System takes picture`);
  });
});
