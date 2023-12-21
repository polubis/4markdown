import { LOG_IN_OUT_SCENARIOS } from '../scenarios/log-in-out';
import { BASE_COMMANDS } from '../utils/commands';
import { Gherkin } from '../utils/gherkin';

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
    const [documentName1, documentName2] = [`Test1`, `Custom2`];
    const [documentCode1, documentCode2] = [
      `# This is my heading`,
      `## My content`,
    ];

    LOG_IN_OUT_SCENARIOS[`I log in`]()
      .When(`I click button`, [`Close your account panel`])
      .And(`I clear creator`)
      .And(`I type in creator`, documentCode1)
      .Then(`I see text`, [documentCode1, `This is my heading`])
      .And(`I not see button`, [`Your documents`])
      .And(`System takes picture`)
      .When(`I click button`, [`Create new document`])
      .And(`I type in input`, `Type document name...`, documentName1)
      .And(`I click button`, [`Confirm document creation`])
      .Then(`I see text`, [documentName1, documentCode1])
      .And(`I see button`, [`Your documents`])
      .And(`System takes picture`)
      .When(`I click button`, [`Your documents`])
      .Then(`I see text`, [documentName1, `Your Documents`])
      .And(`System takes picture`)
      .When(`I click button`, [`Close your documents`])
      .Then(`I not see text`, [`Your Document`])
      .When(`I reload page`)
      .Then(`I see text`, [documentName1, documentCode1])
      .And(`I see button`, [`Your documents`])
      .And(`System takes picture`)
      .When(`I clear creator`)
      .And(`I type in creator`, documentCode2)
      .And(`I reload page`)
      .And(`I move mouse`)
      .Then(`I see text`, [documentCode2, documentName1])
      .And(`System takes picture`)
      .When(`I click button`, [`Create new document`])
      .And(`I type in input`, `Type document name...`, documentName2)
      .And(`I click button`, [`Confirm document creation`])
      .Then(`I see text`, [documentName2, documentCode2])
      .When(`I click button`, [`Your documents`])
      .Then(`I see text`, [documentName1, documentName2, `Your Documents`])
      .And(`System takes picture`)
      .When(`I select document`, documentName1)
      .Then(`I not see text`, [`Your Documents`])
      .And(`I see text`, [documentName1])
      .And(`System takes picture`);
  });
});
