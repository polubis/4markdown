import { BASE_COMMANDS } from '../utils/commands';
import { Gherkin } from '../utils/gherkin';

describe(`Creator works when`, () => {
  const { Given } = Gherkin(BASE_COMMANDS);

  it(`user may use editor controls`, () => {
    Given(`Im on page`, `home`)
      .Then(`I see text`, [`Markdown Cheatsheet`, `# Markdown Cheatsheet`])
      .And(`I see disabled button`, [`Reset content`])
      .And(`I see the same UI as before`, `1`)
      .When(`I click button`, [`Clear content`])
      .Then(`I see text`, [`Sure?`])
      .When(`I click button`, [`Clear content`])
      .Then(`I not see text`, [`Markdown Cheatsheet`, `# Markdown Cheatsheet`])
      .And(`I see disabled button`, [`Clear content`])
      .When(`I type in creator`, `## My markdown`)
      .Then(`I see text`, [`## My markdown`, `My markdown`])
      .When(`I click button`, [`Clear content`])
      .Then(`I see text`, [`Sure?`])
      .When(`I click button`, [`Clear content`])
      .Then(`I not see text`, [`## My markdown`, `My markdown`])
      .When(`I click button`, [`Reset content`])
      .Then(`I see text`, [`Sure?`])
      .When(`I click button`, [`Reset content`])
      .Then(`I see text`, [`Markdown Cheatsheet`, `# Markdown Cheatsheet`])
      .And(`I see disabled button`, [`Reset content`])
      .And(`I see the same UI as before`, `2`)
      .When(`I click button`, [`Change view display`])
      .Then(`I see the same UI as before`, `3`)
      .When(`I click button`, [`Change view display`])
      .Then(`I see the same UI as before`, `4`)
      .When(`I click button`, [`Change view display`])
      .Then(`I see the same UI as before`, `5`)
      .When(`I click button`, [`Use markdown templates`])
      .Then(`I see the same UI as before`, `6`)
      .When(`I click button`, [`Copy headings markdown`])
      .Then(`I see text`, [`Copied`])
      .And(`I not see button`, [`Copy headings markdown`])
      .When(`I click button`, [`Clear content`])
      .And(`I click button`, [`Clear content`])
      .Then(`I see empty creator`)
      .And(`I not see text`, [`Copied`]);
  });
});
