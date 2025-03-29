import { BASE_COMMANDS } from '../utils/commands';
import { Gherkin } from '../utils/gherkin';
import { uid } from '../utils/uid';

describe(`Docs browse works when`, () => {
  const { Given } = Gherkin(BASE_COMMANDS);

  it(`user may browse his documents`, () => {
    const [documentName1, documentName2] = [uid(`S`), uid(`K`)];
    const [documentCode1, documentCode2] = [
      `# This is my heading`,
      `## My content`,
    ];

    Given(`System has accepted cookies`)
      .And(`Im on page`, `home`)
      .And(`I log in`)
      .And(`theme is set to white`)
      .And(`I clear creator`)
      .And(`I type in creator`, documentCode1)
      .Then(`I see text`, [`This is my heading`])
      .And(`I see text in creator`, documentCode1)
      .And(`I see button`, [`Your documents`])
      .When(`I click button`, [`Create new document`])
      .And(
        `I type in input`,
        `My Notes, Basics of Computer Science, ...etc`,
        documentName1,
      )
      .And(`I click button`, [`Confirm document creation`])
      .Then(`I see text`, [documentName1])
      .And(`I see text in creator`, documentCode1)
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
      .And(`I see text in creator`, documentCode1)
      .And(`I see button`, [`Your documents`])
      .When(`I clear creator`)
      .And(`I type in creator`, documentCode2)
      .Then(`I see text`, [`My content`])
      .When(`I reload page`)
      .Then(`I see not disabled button`, [`User details and options`])
      .And(`I see text`, [documentName1])
      .And(`I see text in creator`, documentCode2)
      .When(`I click button`, [`Create new document`])
      .And(
        `I type in input`,
        `My Notes, Basics of Computer Science, ...etc`,
        documentName2,
      )
      .And(`I click button`, [`Confirm document creation`])
      .Then(`I see text`, [documentName2])
      .And(`I see text in creator`, documentCode2)
      .When(`I click button`, [`Your documents`])
      .Then(`I see text`, [documentName1, documentName2, `Your Documents`])
      .When(`I select document`, documentName1)
      .Then(`I not see text`, [`Your Documents`])
      .And(`I see text`, [documentName1])
      .When(`I change theme`)
      .And(`I click button`, [
        `More document options`,
        `Delete current document`,
      ])
      .When(`I type in input`, `Type document name`, documentName1)
      .And(`I click button`, [`Confirm document removal`])
      .Then(`I see text`, [`Markdown Cheatsheet`])
      .And(`I see text in creator`, `# Markdown Cheatsheet`);
  });
});
