import { type Doc } from 'models/doc';
import { BASE_COMMANDS } from '../utils/commands';
import { Gherkin } from '../utils/gherkin';

const { When, Given } = Gherkin({
  ...BASE_COMMANDS,
  'I see disabled visibility options': () => {
    Given(`I see disabled button`, [
      `Make this document permanent`,
      `Make this document private`,
      `Make this document public`,
    ]);
  },
  'I see enabled visibility options': () => {
    Given(`I see not disabled button`, [
      `Make this document permanent`,
      `Make this document private`,
      `Make this document public`,
    ]);
  },
});

const DOCS_MANAGEMENT_SCENARIOS = {
  'I delete document': (name: Doc['name']) => {
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
    const documentName = `Test document`;

    When(`I click button`, [`Create new document`])
      .Then(`I see text`, [`Create Document`, `Document name*`, `Create`])
      .And(`I see disabled button`, [`Confirm document creation`])
      .When(`I type in input`, `Type document name`, documentName)
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
      .When(`I click button`, [
        `More document options`,
        `Make this document public`,
      ])
      .Then(`I see disabled visibility options`)
      .And(`I see enabled visibility options`)
      .When(`I click button`, [`Document preview`])
      .Then(`I see text`, [`Wait... Checking required stuff (～￣▽￣)～`])
      .When(`I reload page`)
      .Then(`I see button`, [`Go back to editor`])
      .When(`I click button`, [
        `Go back to editor`,
        `More document options`,
        `Make this document private`,
      ])
      .Then(`I see disabled visibility options`)
      .And(`I see enabled visibility options`)
      .When(`I click button`, [`Close additional options`]);

    DOCS_MANAGEMENT_SCENARIOS[`I delete document`](documentName).Then(
      `I see text`,
      [`# Start from scratch`, `Start from scratch`],
    );
  },
  'I create, edit and delete document': () => {
    const documentName = `Test document`;
    const documentNameEdited = `Doc 2`;

    return When(`I click button`, [`Create new document`])
      .Then(`I see text`, [`Create Document`, `Document name*`, `Create`])
      .And(`I see disabled button`, [`Confirm document creation`])
      .When(`I type in input`, `Type document name`, documentName)
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
        `Document name*`,
        `Type ${documentNameEdited} to remove this document`,
      ])
      .And(`I click button`, [`Cancel document removal`])
      .Then(`I not see text`, [
        `Document Removal`,
        `Document name*`,
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
      .And(`I see text`, [`# Start from scratch`, `Start from scratch`])
      .When(`I reload page`)
      .Then(`I see text`, [`# Start from scratch`, `Start from scratch`])
      .And(`I see button`, [`User details and options`]);
  },
} as const;

export { DOCS_MANAGEMENT_SCENARIOS };
