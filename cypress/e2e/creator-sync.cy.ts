import { BASE_COMMANDS } from '../utils/commands';
import { Gherkin } from '../utils/gherkin';

describe(`Creator sync works when`, () => {
  it(`user see changes from local storage after page refresh`, () => {
    const { Given } = Gherkin(BASE_COMMANDS);

    Given(`Im on page`, `home`)
      .And(`I accept cookies`)
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
