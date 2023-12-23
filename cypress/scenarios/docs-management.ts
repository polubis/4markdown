import { BASE_COMMANDS } from '../utils/commands';
import { Gherkin } from '../utils/gherkin';

const { When } = Gherkin(BASE_COMMANDS);

const DOCS_MANAGEMENT_SCENARIOS = {
  'I create, edit and delete document': () => {
    const documentName = `Test document`;
    const documentNameEdited = `Doc 2`;

    return When(`I click button`, [`Create new document`])
      .Then(`I see text`, [`Create Document`, `Document name*`, `Create`])
      .And(`I see disabled button`, [`Confirm document creation`])
      .When(`I type in input`, `Type document name...`, documentName)
      .Then(`I see not disabled button`, [`Confirm document creation`])
      .And(`System takes picture`)
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
      .And(`System takes picture`)
      .When(`I click button`, [`Close your documents`])
      .Then(`I not see text`, [`Your Documents`])
      .When(`I click button`, [`Change document name`])
      .And(`I clear input`, [`Type document name*`])
      .And(`I type in input`, `Type document name*`, documentNameEdited)
      .And(`System takes picture`)
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
      .Then(`I see text`, [`Additional Options`])
      .And(`I see button`, [`Make this document public`])
      .When(`I click button`, [`Close additional options`])
      .Then(`I not see text`, [`Additional Options`])
      .When(`I click button`, [`More document options`])
      .Then(`I see not disabled button`, [`Make this document public`])
      .And(`I see text`, [
        `Name: ${documentNameEdited}`,
        `Visibility: Private`,
        `Created`,
        `Edited`,
      ])
      .And(`I not see text`, [`Visibility: Private`, `URL: Preview`])
      .When(`I click button`, [`Make this document public`])
      .Then(`I see disabled button`, [
        `Close additional options`,
        `Delete current document`,
        `Make this document public`,
      ])
      .And(`I see not disabled button`, [
        `Make this document private`,
        `Delete current document`,
        `Close additional options`,
      ])
      .And(`I see text`, [
        `Name: ${documentNameEdited}`,
        `Visibility: Public`,
        `Created`,
        `Edited`,
        `URL: Preview`,
      ])
      .And(`I not see text`, [`Visibility: Private`])
      .When(`I click button`, [`Make this document private`])
      .Then(`I see disabled button`, [
        `Close additional options`,
        `Delete current document`,
        `Make this document private`,
      ])
      .And(`I see not disabled button`, [
        `Make this document public`,
        `Delete current document`,
        `Close additional options`,
      ])
      .And(`System takes picture`)
      .When(`I click button`, [`Delete current document`])
      .Then(`I see text`, [
        `Document Removal`,
        `Document name*`,
        `Type ${documentNameEdited} to remove this document`,
      ])
      .And(`System takes picture`)
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
      .And(`I type in input`, `Type document name...`, documentNameEdited)
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
      .And(`System takes picture`);
  },
} as const;

export { DOCS_MANAGEMENT_SCENARIOS };
