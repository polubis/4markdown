import { BASE_COMMANDS } from '../utils/commands';
import { gherkin } from '@greenstack/gherkin';

describe(`Creator sync works when`, () => {
  const { given } = gherkin((_, key) => cy.log(key))(BASE_COMMANDS);

  before(() => {
    given(`System sets pictures folder`, `creator-sync`);
  });

  beforeEach(() => {
    given(`System cleans local storage`);
  });

  after(() => {
    given(`System cleans pictures setup`).and(`System cleans local storage`);
  });

  it(`user see changes from local storage after page refresh`, () => {
    given(`Im on page`, `home`)
      .and(`I see not disabled button`, [`Sign in`])
      .when(`I click button`, [`Change theme`])
      .and(`I type in creator`, `## Markdown local storage sync test`)
      .then(`I see text`, [
        `## Markdown local storage sync test`,
        `Markdown local storage sync test`,
      ])
      .when(`I reload page`)
      .then(`I see text`, [
        `## Markdown local storage sync test`,
        `Markdown local storage sync test`,
      ]);
  });
});
