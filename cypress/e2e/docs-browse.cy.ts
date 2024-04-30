import { LOG_IN_OUT_SCENARIOS } from '../scenarios/log-in-out';
import { BASE_COMMANDS } from '../utils/commands';
import { uid } from '../utils/uid';
import { gherkin } from '@greenstack/gherkin';

describe(`Docs browse works when`, () => {
  const { given } = gherkin((_, key) => cy.log(key))(BASE_COMMANDS);

  before(() => {
    given(`System sets pictures folder`, `docs-browse`);
  });

  beforeEach(() => {
    given(`System cleans local storage`).and(`Im on page`, `home`);
  });

  after(() => {
    given(`System cleans pictures setup`).and(`System cleans local storage`);
  });

  it(`user may browse his documents`, () => {
    const [documentName1, documentName2] = [uid(`S`), uid(`K`)];
    const [documentCode1, documentCode2] = [
      `# This is my heading`,
      `## My content`,
    ];

    LOG_IN_OUT_SCENARIOS[`I log in`]()
      .when(`I click button`, [`Close your account panel`])
      .and(`I clear creator`)
      .and(`I type in creator`, documentCode1)
      .then(`I see text`, [documentCode1, `This is my heading`])
      .and(`I see button`, [`Your documents`])
      .when(`I click button`, [`Create new document`])
      .and(`I type in input`, `Type document name`, documentName1)
      .and(`I click button`, [`Confirm document creation`])
      .then(`I see text`, [documentName1, documentCode1])
      .and(`I not see button`, [`Confirm document creation`])
      .and(`I see button`, [`Your documents`])
      .when(`I click button`, [`Your documents`])
      .then(`I see text`, [documentName1, `Your Documents`])
      .when(`I click button`, [`Close your documents`])
      .then(`I not see text`, [`Your Documents`])
      .and(`I not see button`, [`Confirm document creation`])
      .when(`I reload page`)
      .then(`I see not disabled button`, [`User details and options`])
      .and(`I see text`, [documentName1, documentCode1])
      .and(`I see button`, [`Your documents`])
      .when(`I clear creator`)
      .and(`I type in creator`, documentCode2)
      .and(`I reload page`)
      .then(`I see not disabled button`, [`User details and options`])
      .and(`I see text`, [documentCode2, documentName1])
      .when(`I click button`, [`Create new document`])
      .and(`I type in input`, `Type document name`, documentName2)
      .and(`I click button`, [`Confirm document creation`])
      .then(`I see text`, [documentName2, documentCode2])
      .when(`I click button`, [`Your documents`])
      .then(`I see text`, [documentName1, documentName2, `Your Documents`])
      .when(`I select document`, documentName1)
      .then(`I not see text`, [`Your Documents`])
      .and(`I see text`, [documentName1])
      .when(`I click button`, [`Change theme`])
      .and(`I click button`, [
        `More document options`,
        `Delete current document`,
      ])
      .when(`I type in input`, `Type document name`, documentName1)
      .and(`I click button`, [`Confirm document removal`])
      .then(`I see text`, [documentName2, documentCode2])
      .when(`I click button`, [
        `More document options`,
        `Delete current document`,
      ])
      .and(`I type in input`, `Type document name`, documentName2)
      .and(`I click button`, [`Confirm document removal`])
      .then(`I see text`, [`# Start from scratch`, `Start from scratch`]);
  });
});
