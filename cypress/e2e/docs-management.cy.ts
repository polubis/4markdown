import { DOCS_MANAGEMENT_SCENARIOS } from '../scenarios/docs-management';
import { LOG_IN_OUT_SCENARIOS } from '../scenarios/log-in-out';
import { BASE_COMMANDS } from '../utils/commands';
import { Gherkin } from '../utils/gherkin';

describe(`Docs management works when`, () => {
  const { Given } = Gherkin(BASE_COMMANDS);

  before(() => {
    Given(`System sets pictures folder`, `docs-management`);
  });

  beforeEach(() => {
    Given(`System cleans local storage`).And(`Im on page`, `home`);
  });

  after(() => {
    Given(`System cleans pictures setup`).And(`System cleans local storage`);
  });

  it(`user may create, edit and delete document`, () => {
    LOG_IN_OUT_SCENARIOS[`I log in`]().When(`I click button`, [
      `Close your account panel`,
    ]);
    DOCS_MANAGEMENT_SCENARIOS[`I create, edit and delete document`]().When(
      `I click button`,
      [`Change theme`],
    );
    DOCS_MANAGEMENT_SCENARIOS[`I create, edit and delete document`]();
  });

  it.only(`user may browse his documents`, () => {
    const [documentName1, documentName2] = [`Test1`, `Custom2`];
    const [documentCode1, documentCode2] = [
      `# This is my heading`,
      `## My content`,
    ];

    LOG_IN_OUT_SCENARIOS[`I log in`]()
      .When(`I click button`, [`Close your account panel`])
      .And(`I type in creator`, documentCode1)
      .Then(`I see text`, [documentCode1]);

    DOCS_MANAGEMENT_SCENARIOS[`I create document`](documentName1)
      .And(`I see text`, [documentCode1])
      .When(`I type in creator`, documentCode2)
      .Then(`I see text`, [documentCode2]);
    DOCS_MANAGEMENT_SCENARIOS[`I create document`](documentName2).And(
      `I see text`,
      [documentCode2],
    );
  });
});
