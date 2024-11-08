import type { DocumentDto } from 'api-4markdown-contracts';
import { BASE_COMMANDS } from '../utils/commands';
import { Gherkin } from '../utils/gherkin';
import { uid } from '../utils/uid';

const { When, Given } = Gherkin({
  ...BASE_COMMANDS,
  'I see enabled visibility options': () => {
    Given(`I see not disabled button`, [
      `Make this document permanent`,
      `Make this document private`,
      `Make this document public`,
    ]);
  },
});

const DOCS_MANAGEMENT_SCENARIOS = {
  'I delete document': (name: DocumentDto['name']) => {
    return When(`I click button`, [
      `More document options`,
      `Delete current document`,
    ])
      .And(`I type in input`, `Type document name`, name)
      .And(`I click button`, [`Confirm document removal`])
      .Then(`I see disabled button`, [
        `Confirm document removal`,
        `Cancel document removal`,
        `Close document removal`,
      ])
      .And(`I not see text`, [`Delete current document`, name]);
  },
  'I change document visiblity': () => {
    const documentName = `${uid(`S`)} next next`;
    const editedDocumentName = `${uid(`S`)} next next`;
    const editedDocumentDescription = `This is totally new description for permament document to prove edition mechanism works`;

    When(`I click button`, [`Create new document`])
      .Then(`I see text`, [`Create Document`, `Document Name*`, `Create`])
      .And(`I see disabled button`, [`Confirm document creation`])
      .When(
        `I type in input`,
        `"My Notes", "Basics of Computer Science", ...etc`,
        documentName,
      )
      .Then(`I see not disabled button`, [`Confirm document creation`])
      .When(`I click button`, [`Confirm document creation`])
      .Then(`I see disabled button`, [
        `Confirm document creation`,
        `Close document adding`,
      ])
      .And(`I not see button`, [
        `Confirm document creation`,
        `Close document adding`,
      ])
      .And(`I see text`, [documentName])
      .When(`I click button`, [`More document options`])
      .Then(`I not see button`, [`Edit current document`])
      .When(`I click button`, [
        `Make this document public`,
        `Confirm public document status change`,
      ])
      .Then(`I see disabled button`, [`Confirm public document status change`])
      .And(`I see enabled visibility options`)
      .When(`I click button`, [`Document preview`])
      .Then(`I see text`, [`Wait... Checking required stuff (～￣▽￣)～`])
      .When(`I reload page`)
      .Then(`I see elements`, [`Create any content`])
      .When(`I click elements`, [
        `Create any content`,
        `Continue editing the document`,
      ])
      .And(`I click button`, [`More document options`])
      .Then(`I not see button`, [`Edit current document`])
      .When(`I click button`, [
        `Make this document private`,
        `Confirm private document status change`,
      ])
      .Then(`I see disabled button`, [`Confirm private document status change`])
      .And(`I see enabled visibility options`)
      .When(`I click button`, [
        `Make this document permanent`,
        `Confirm permanent document policy`,
      ])
      .And(`I clear input`, [`Type document name`])
      .And(`I type in input`, `Type document name`, `Document Name`)
      .And(
        `I type in input`,
        `The description will be displayed in Google and under document`,
        `This is my permanent article description that will be displayed in Google for best possible SEO results`,
      )
      .And(`I type in input`, `React, ruby-on-rails, ...etc`, `react,angular`)
      .Then(`I see disabled button`, [`Make document permanent`])
      .When(`I clear input`, [`Type document name`])
      .And(`I type in input`, `Type document name`, documentName)
      .And(`I click button`, [`Make document permanent`])
      .Then(`I see disabled button`, [`Make document permanent`])
      .And(`I not see button`, [`Make document permanent`])
      .When(`I click button`, [`Document preview`])
      .And(`I click elements`, [
        `Create any content`,
        `Continue editing the document`,
      ])
      .When(`I click button`, [
        `More document options`,
        `Edit current document`,
      ])
      .And(`I clear input`, [
        `Type document name`,
        `The description will be displayed in Google and under document`,
        `React, ruby-on-rails, ...etc`,
      ])
      .And(`I type in input`, `Type document name`, editedDocumentName)
      .And(
        `I type in input`,
        `The description will be displayed in Google and under document`,
        editedDocumentDescription,
      )
      .And(`I type in input`, `React, ruby-on-rails, ...etc`, `angular,vue,node`)
      .And(`I click button`, [`Make document permanent`])
      .Then(`I see button`, [`Edit current document`])
      .And(`I see text`, [
        editedDocumentName,
        editedDocumentDescription,
        `angular, vue, node`,
      ])
      .When(`I click button`, [`Close additional options`]);

    DOCS_MANAGEMENT_SCENARIOS[`I delete document`](editedDocumentName)
      .Then(`I see text`, [`Markdown Cheatsheet`])
      .And(`I see text in creator`, `# Markdown Cheatsheet`);
  },
  'I create, edit and delete document': () => {
    const documentName = `Test document`;
    const documentNameEdited = `Doc 2`;

    return When(`I click button`, [`Create new document`])
      .Then(`I see text`, [`Create Document`, `Document Name*`, `Create`])
      .And(`I see disabled button`, [`Confirm document creation`])
      .When(
        `I type in input`,
        `"My Notes", "Basics of Computer Science", ...etc`,
        documentName,
      )
      .Then(`I see not disabled button`, [`Confirm document creation`])
      .When(`I click button`, [`Confirm document creation`])
      .Then(`I see disabled button`, [
        `Confirm document creation`,
        `Close document adding`,
      ])
      .And(`I not see button`, [
        `Confirm document creation`,
        `Close document adding`,
      ])
      .And(`I see text`, [documentName])
      .When(`I reload page`)
      .Then(`I see text`, [documentName])
      .When(`I click button`, [`Your documents`])
      .Then(`I see text`, [`Your Documents`, documentName])
      .When(`I click button`, [`Close your documents`])
      .Then(`I not see text`, [`Your Documents`])
      .When(`I click button`, [`Change document name`])
      .And(`I clear input`, [`Type document name*`])
      .And(`I type in input`, `Type document name*`, documentNameEdited)
      .And(`I click button`, [`Confirm name change`])
      .Then(`I see disabled button`, [
        `Confirm name change`,
        `Close document name edition`,
      ])
      .And(`I not see button`, [
        `Confirm name change`,
        `Close document name edition`,
      ])
      .And(`I see text`, [documentNameEdited])
      .When(`I reload page`)
      .Then(`I see text`, [documentNameEdited])
      .And(`I see not disabled button`, [`Change document name`])
      .When(`I click button`, [`More document options`])
      .Then(`I see text`, [`Details`])
      .When(`I click button`, [`Close additional options`])
      .Then(`I not see text`, [`Details`])
      .When(`I click button`, [
        `More document options`,
        `Delete current document`,
      ])
      .Then(`I see text`, [
        `Document Removal`,
        `Document Name*`,
        `Type ${documentNameEdited} to remove this document`,
      ])
      .And(`I click button`, [`Cancel document removal`])
      .Then(`I not see text`, [
        `Document Removal`,
        `Document Name*`,
        `Type ${documentNameEdited} to remove this document`,
      ])
      .When(`I click button`, [
        `More document options`,
        `Delete current document`,
      ])
      .And(`I type in input`, `Type document name`, documentNameEdited)
      .And(`I click button`, [`Confirm document removal`])
      .Then(`I see disabled button`, [
        `Confirm document removal`,
        `Cancel document removal`,
        `Close document removal`,
      ])
      .And(`I not see text`, [`Delete current document`, documentNameEdited])
      .And(`I see text`, [`Markdown Cheatsheet`])
      .And(`I see text in creator`, `# Markdown Cheatsheet`)
      .When(`I reload page`)
      .Then(`I see text`, [`Markdown Cheatsheet`])
      .And(`I see text in creator`, `# Markdown Cheatsheet`)
      .And(`I see button`, [`User details and options`]);
  },
} as const;

export { DOCS_MANAGEMENT_SCENARIOS };
