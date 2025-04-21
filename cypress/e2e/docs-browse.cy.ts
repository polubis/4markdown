import { BASE_COMMANDS } from '../utils/commands';
import { gherkin } from '../utils/gherkin';
import { uid } from '../utils/uid';

describe(`Docs browse works when`, () => {
  const given = gherkin(BASE_COMMANDS);

  it(`user may browse his documents`, () => {
    const [documentName1, documentName2] = [uid(`S`), uid(`K`)];
    const [documentCode1, documentCode2] = [
      `# This is my heading`,
      `## My content`,
    ];

    given(`System has accepted cookies`)
      .and(`Im on page`, `home`)
      .and(`I log in`)
      .and(`I set white theme`)
      .and(`I clear creator`)
      .and(`I type in creator`, documentCode1)
      .then(`I see text`, [`This is my heading`])
      .and(`I see text in creator`, documentCode1)
      .and(`I see button`, [`Your documents`])
      .when(`I click button`, [`Create new document`])
      .and(`I click button`, [`Go to manual document creation form`])
      .and(
        `I type in input`,
        `My Notes, Basics of Computer Science, ...etc`,
        documentName1,
      )
      .and(`I click button`, [`Confirm document creation`])
      .then(`I see text`, [documentName1])
      .and(`I see text in creator`, documentCode1)
      .and(`I not see button`, [`Confirm document creation`])
      .and(`I see button`, [`Your documents`])
      .when(`I click button`, [`Your documents`])
      .then(`I see text`, [documentName1, `Your Documents`])
      .when(`I click button`, [`Close your documents`])
      .then(`I not see text`, [`Your Documents`])
      .and(`I not see button`, [`Confirm document creation`])
      .when(`I reload page`)
      .then(`I see not disabled button`, [`User details and options`])
      .and(`I see text`, [documentName1])
      .and(`I see text in creator`, documentCode1)
      .and(`I see button`, [`Your documents`])
      .when(`I clear creator`)
      .and(`I type in creator`, documentCode2)
      .then(`I see text`, [`My content`])
      .when(`I reload page`)
      .then(`I see not disabled button`, [`User details and options`])
      .and(`I see text`, [documentName1])
      .and(`I see text in creator`, documentCode2)
      .when(`I click button`, [`Create new document`])
      .and(`I click button`, [`Go to manual document creation form`])
      .and(
        `I type in input`,
        `My Notes, Basics of Computer Science, ...etc`,
        documentName2,
      )
      .and(`I click button`, [`Confirm document creation`])
      .then(`I see text`, [documentName2])
      .and(`I see text in creator`, documentCode2)
      .when(`I click button`, [`Your documents`])
      .then(`I see text`, [documentName1, documentName2, `Your Documents`])
      .when(`I select document`, documentName1)
      .then(`I not see text`, [`Your Documents`])
      .and(`I see text`, [documentName1])
      .when(`I change theme`)
      .and(`I click button`, [
        `More document options`,
        `Delete current document`,
      ])
      .when(`I type in input`, `Type document name`, documentName1)
      .and(`I click button`, [`Confirm document removal`])
      .then(`I see text`, [`Markdown Cheatsheet`])
      .and(`I see text in creator`, `# Markdown Cheatsheet`);
  });
});
