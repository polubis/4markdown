import { BASE_COMMANDS } from '../utils/commands';
import { Gherkin } from '../utils/gherkin';

describe(`Creator sync works when`, () => {
  const { Given } = Gherkin(BASE_COMMANDS);

  before(() => {
    Given(`System sets pictures folder`, `docs-browse`);
  });

  beforeEach(() => {
    Given(`System cleans local storage`).And(`Im on page`, `home`);
  });

  after(() => {
    Given(`System cleans pictures setup`).And(`System cleans local storage`);
  });

  it(`user see changes from local storage after page refresh`, () => {
    Given(`I accept cookies`)
      .And(`I see not disabled button`, [`Sign in`])
      .When(`I click button`, [`Change theme`])
      .And(`I type in creator`, `## Markdown local storage sync test`)
      .Then(`I see text`, [
        `## Markdown local storage sync test`,
        `Markdown local storage sync test`,
      ])
      .When(`I reload page`)
      .Then(`I see text`, [
        `## Markdown local storage sync test`,
        `Markdown local storage sync test`,
      ]);
  });
});
