import { type Doc } from 'models/doc';
import { BASE_COMMANDS } from '../utils/commands';
import { uid } from '../utils/uid';
import { gherkin } from '@greenstack/gherkin';

const { given } = gherkin((_, key) => cy.log(key))({
  ...BASE_COMMANDS,
  'I see enabled visibility options': () => {
    given(`I see not disabled button`, [
      `Make this document permanent`,
      `Make this document private`,
      `Make this document public`,
    ]);
  },
});

const DOCS_MANAGEMENT_SCENARIOS = {
  'I delete document': (name: Doc['name']) => {
    return given(`I click button`, [
      `More document options`,
      `Delete current document`,
    ])
      .and(`I type in input`, `Type document name`, name)
      .and(`I click button`, [`Confirm document removal`])
      .then(`I see disabled button`, [
        `Confirm document removal`,
        `Cancel document removal`,
        `Close document removal`,
      ])
      .and(`I not see text`, [`Delete current document`, name]);
  },
  'I change document visiblity': () => {
    const documentName = uid(`S`);
    const editedDocumentName = uid(`K`);
    const editedDocumentDescription = `This is totally new description for permament document to prove edition mechanism works`;

    given(`I click button`, [`Create new document`])
      .then(`I see text`, [`Create Document`, `Document name*`, `Create`])
      .and(`I see disabled button`, [`Confirm document creation`])
      .when(`I type in input`, `Type document name`, documentName)
      .then(`I see not disabled button`, [`Confirm document creation`])
      .when(`I click button`, [`Confirm document creation`])
      .then(`I see disabled button`, [
        `Confirm document creation`,
        `Close document adding`,
      ])
      .and(`I not see button`, [
        `Confirm document creation`,
        `Close document adding`,
      ])
      .and(`I see text`, [documentName])
      .when(`I click button`, [`More document options`])
      .then(`I not see button`, [`Edit current document`])
      .when(`I click button`, [
        `Make this document public`,
        `Confirm public document status change`,
      ])
      .then(`I see disabled button`, [`Confirm public document status change`])
      .and(`I see enabled visibility options`)
      .when(`I click button`, [`Document preview`])
      .then(`I see text`, [`Wait... Checking required stuff (～￣▽￣)～`])
      .when(`I reload page`)
      .then(`I see elements`, [`Go to creator`])
      .when(`I click elements`, [`Go to creator`])
      .and(`I click button`, [`More document options`])
      .then(`I not see button`, [`Edit current document`])
      .when(`I click button`, [
        `Make this document private`,
        `Confirm private document status change`,
      ])
      .then(`I see disabled button`, [`Confirm private document status change`])
      .and(`I see enabled visibility options`)
      .when(`I click button`, [
        `Make this document permanent`,
        `Confirm permanent document policy`,
      ])
      .and(`I clear input`, [`Type document name`])
      .and(`I type in input`, `Type document name`, documentName)
      .and(
        `I type in input`,
        `Describe your document in 3-4 sentences. The description will be displayed in Google`,
        `This is my permanent article description that will be displayed in Google for best possible SEO results`,
      )
      .and(`I type in input`, `Separate tags with a comma`, `react,angular`)
      .and(`I click button`, [`Make document permanent`])
      .then(`I see disabled button`, [`Make document permanent`])
      .and(`I not see button`, [`Make document permanent`])
      .when(`I click button`, [`Document preview`])
      .and(`I click elements`, [`Go to creator`])
      .when(`I click button`, [
        `More document options`,
        `Edit current document`,
      ])
      .and(`I clear input`, [
        `Type document name`,
        `Describe your document in 3-4 sentences. The description will be displayed in Google`,
        `Separate tags with a comma`,
      ])
      .and(`I type in input`, `Type document name`, editedDocumentName)
      .and(
        `I type in input`,
        `Describe your document in 3-4 sentences. The description will be displayed in Google`,
        editedDocumentDescription,
      )
      .and(`I type in input`, `Separate tags with a comma`, `angular,vue,node`)
      .and(`I click button`, [`Make document permanent`])
      .then(`I see button`, [`Edit current document`])
      .and(`I see text`, [
        editedDocumentName,
        editedDocumentDescription,
        `angular, vue, node`,
      ])
      .when(`I click button`, [`Close additional options`]);

    return DOCS_MANAGEMENT_SCENARIOS[`I delete document`](
      editedDocumentName,
    ).then(`I see text`, [`# Start from scratch`, `Start from scratch`]);
  },
  'I create, edit and delete document': () => {
    const documentName = `Test document`;
    const documentNameEdited = `Doc 2`;

    return given(`I click button`, [`Create new document`])
      .then(`I see text`, [`Create Document`, `Document name*`, `Create`])
      .and(`I see disabled button`, [`Confirm document creation`])
      .when(`I type in input`, `Type document name`, documentName)
      .then(`I see not disabled button`, [`Confirm document creation`])
      .when(`I click button`, [`Confirm document creation`])
      .then(`I see disabled button`, [
        `Confirm document creation`,
        `Close document adding`,
      ])
      .and(`I not see button`, [
        `Confirm document creation`,
        `Close document adding`,
      ])
      .and(`I see text`, [documentName])
      .when(`I reload page`)
      .then(`I see text`, [documentName])
      .when(`I click button`, [`Your documents`])
      .then(`I see text`, [`Your Documents`, documentName])
      .when(`I click button`, [`Close your documents`])
      .then(`I not see text`, [`Your Documents`])
      .when(`I click button`, [`Change document name`])
      .and(`I clear input`, [`Type document name*`])
      .and(`I type in input`, `Type document name*`, documentNameEdited)
      .and(`I click button`, [`Confirm name change`])
      .then(`I see disabled button`, [
        `Confirm name change`,
        `Close document name edition`,
      ])
      .and(`I not see button`, [
        `Confirm name change`,
        `Close document name edition`,
      ])
      .and(`I see text`, [documentNameEdited])
      .when(`I reload page`)
      .then(`I see text`, [documentNameEdited])
      .and(`I see not disabled button`, [`Change document name`])
      .when(`I click button`, [`More document options`])
      .then(`I see text`, [`Details`])
      .when(`I click button`, [`Close additional options`])
      .then(`I not see text`, [`Details`])
      .when(`I click button`, [
        `More document options`,
        `Delete current document`,
      ])
      .then(`I see text`, [
        `Document Removal`,
        `Document name*`,
        `Type ${documentNameEdited} to remove this document`,
      ])
      .and(`I click button`, [`Cancel document removal`])
      .then(`I not see text`, [
        `Document Removal`,
        `Document name*`,
        `Type ${documentNameEdited} to remove this document`,
      ])
      .when(`I click button`, [
        `More document options`,
        `Delete current document`,
      ])
      .and(`I type in input`, `Type document name`, documentNameEdited)
      .and(`I click button`, [`Confirm document removal`])
      .then(`I see disabled button`, [
        `Confirm document removal`,
        `Cancel document removal`,
        `Close document removal`,
      ])
      .and(`I not see text`, [`Delete current document`, documentNameEdited])
      .and(`I see text`, [`# Start from scratch`, `Start from scratch`])
      .when(`I reload page`)
      .then(`I see text`, [`# Start from scratch`, `Start from scratch`])
      .and(`I see button`, [`User details and options`]);
  },
} as const;

export { DOCS_MANAGEMENT_SCENARIOS };
