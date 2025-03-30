import { DOCS_MANAGEMENT_SCENARIOS } from '../scenarios/docs-management';
import { BASE_COMMANDS } from '../utils/commands';
import { Gherkin } from '../utils/gherkin';

describe(`Docs management works when`, () => {
  const { Given } = Gherkin({
    ...BASE_COMMANDS,
    ...DOCS_MANAGEMENT_SCENARIOS,
  });

  it(`user may create, edit, delete document and change its visibility`, () => {
    Given(`System has accepted cookies`)
      .And(`Im on page`, `home`)
      .And(`I log in`)
      .When(`I create, edit and delete document`)
      .And(`I change document visiblity`);
  });
});
