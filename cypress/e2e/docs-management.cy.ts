import { DOCS_MANAGEMENT_SCENARIOS } from '../scenarios/docs-management';
import { BASE_COMMANDS } from '../utils/commands';
import { gherkin } from '../utils/gherkin';

describe(`Docs management works when`, () => {
  const given = gherkin({
    ...BASE_COMMANDS,
    ...DOCS_MANAGEMENT_SCENARIOS,
  });

  it(`user may create, edit, delete document and change its visibility`, () => {
    given(`System has accepted cookies`)
      .and(`Im on page`, `home`)
      .and(`I log in`)
      .when(`I create, edit and delete document`)
      .and(`I change document visiblity`);
  });
});
