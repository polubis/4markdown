import { BASE_COMMANDS } from '../utils/commands';
import { Gherkin } from '../utils/gherkin';

describe(`Creator sync works when`, () => {
  const { Given } = Gherkin(BASE_COMMANDS);

  before(() => {
    Given(`System sets pictures folder`, `creator-sync`).And(
      `System cleans local storage`,
    );
  });

  after(() => {
    Given(`System cleans pictures setup`).And(`System cleans local storage`);
  });

  it(`user see changes from local storage after page refresh`, () => {
    Given(`Im on page`, `home`)
      .When(`I click button`, [`Change theme`])
      .And(`I type in creator`, `## Markdown local storage sync test`)
      .Then(`I see text`, [
        `## Markdown local storage sync test`,
        `Markdown local storage sync test`,
      ])
      .And(`System takes picture`)
      .When(`I reload page`)
      .Then(`I see text`, [
        `## Markdown local storage sync test`,
        `Markdown local storage sync test`,
      ])
      .And(`System takes picture`);
  });
});
