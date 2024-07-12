import { LOG_IN_OUT_SCENARIOS } from '../scenarios/log-in-out';
import { BASE_COMMANDS } from '../utils/commands';
import { Gherkin } from '../utils/gherkin';
import { uid } from '../utils/uid';

describe(`Docs browse works when`, () => {
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

  it(`user may browse his documents`, () => {
    const [documentName1, documentName2] = [uid(`S`), uid(`K`)];
    const [documentCode1, documentCode2] = [
      `# This is my heading`,
      `## My content`,
    ];

    LOG_IN_OUT_SCENARIOS[`I log in`]()
      .When(`I click button`, [`Close your account panel`])
      .And(`I clear creator`)
      .And(`I type in creator`, documentCode1)
      .Then(`I see text`, [`This is my heading`])
      .And(`I see value in creator`, documentCode1)
      .And(`I see button`, [`Your documents`])
      .When(`I click button`, [`Create new document`])
      .And(`I type in input`, `Type document name`, documentName1)
      .And(`I click button`, [`Confirm document creation`])
      .Then(`I see text`, [documentName1])
      .And(`I see value in creator`, documentCode1)
      .And(`I not see button`, [`Confirm document creation`])
      .And(`I see button`, [`Your documents`])
      .When(`I click button`, [`Your documents`])
      .Then(`I see text`, [documentName1, `Your Documents`])
      .When(`I click button`, [`Close your documents`])
      .Then(`I not see text`, [`Your Documents`])
      .And(`I not see button`, [`Confirm document creation`])
      .When(`I reload page`)
      .Then(`I see not disabled button`, [`User details and options`])
      .And(`I see text`, [documentName1])
      .And(`I see value in creator`, documentCode1)
      .And(`I see button`, [`Your documents`])
      .When(`I clear creator`)
      .And(`I type in creator`, documentCode2)
      .Then(`I see text`, [`My content`])
      .When(`I reload page`)
      .Then(`I see not disabled button`, [`User details and options`])
      .And(`I see text`, [documentName1])
      .And(`I see value in creator`, documentCode2)
      .When(`I click button`, [`Create new document`])
      .And(`I type in input`, `Type document name`, documentName2)
      .And(`I click button`, [`Confirm document creation`])
      .Then(`I see text`, [documentName2])
      .And(`I see value in creator`, documentCode2)
      .When(`I click button`, [`Your documents`])
      .Then(`I see text`, [documentName1, documentName2, `Your Documents`])
      .When(`I select document`, documentName1)
      .Then(`I not see text`, [`Your Documents`])
      .And(`I see text`, [documentName1])
      .When(`I click button`, [`Change theme`])
      .And(`I click button`, [
        `More document options`,
        `Delete current document`,
      ])
      .When(`I type in input`, `Type document name`, documentName1)
      .And(`I click button`, [`Confirm document removal`])
      .Then(`I see text`, [`Markdown Cheatsheet`])
      .And(`I see value in creator`, `# Markdown Cheatsheet`);
  });
});
