import { BASE_COMMANDS } from '../utils/commands';
import { Gherkin } from '../utils/gherkin';

const { Given } = Gherkin(BASE_COMMANDS);

const CREATOR_SCENARIOS = {
  'I played with editor': () => {
    return Given(`Im on page`, `home`)
      .When(`I move mouse`)
      .Then(`I see not disabled button`, [`Sign in`])
      .And(`I see text`, [`Markdown Cheatsheet`, `# Markdown Cheatsheet`])
      .And(`I see disabled button`, [`Reset content`])
      .And(`System takes picture`)
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
      .And(`System takes picture`)
      .When(`I click button`, [`Change view display`])
      .Then(`System takes picture`)
      .When(`I click button`, [`Change view display`])
      .Then(`System takes picture`)
      .When(`I click button`, [`Change view display`])
      .Then(`System takes picture`)
      .When(`I click button`, [`Use markdown templates`])
      .Then(`System takes picture`)
      .When(`I click button`, [`Copy headings markdown`])
      .Then(`I not see button`, [`Copy headings markdown`])
      .When(`I click button`, [`Clear content`])
      .And(`I click button`, [`Clear content`])
      .Then(`I see empty creator`)
      .When(`I click button`, [`Navigation`])
      .Then(`I see text`, [
        `Authors`,
        `Blog`,
        `Discord Channel`,
        `LinkedIn Profile`,
        `Facebook Group`,
        `Grammarly Extension`,
        `Markdown Cheatsheet`,
        `Source Code`,
        `Tutorial`,
        `YouTube Channel`,
        `by GreenOn Software`,
      ])
      .And(`System takes picture`)
      .When(`I click button`, [`Close navigation`])
      .Then(`I not see text`, [
        `Authors`,
        `Blog`,
        `Discord Channel`,
        `LinkedIn Profile`,
        `Facebook Group`,
        `Grammarly Extension`,
        `Markdown Cheatsheet`,
        `Source Code`,
        `Tutorial`,
        `YouTube Channel`,
        `by GreenOn Software`,
      ])
      .And(`System takes picture`);
  },
} as const;

export { CREATOR_SCENARIOS };
