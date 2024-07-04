import { BASE_COMMANDS } from '../utils/commands';
import { Gherkin } from '../utils/gherkin';

describe(`Docs creator works when`, () => {
  const { Given } = Gherkin(BASE_COMMANDS);

  before(() => {
    Given(`System sets pictures folder`, `docs-creator`);
  });

  beforeEach(() => {
    Given(`System cleans local storage`);
  });

  afterEach(() => {
    Given(`System cleans local storage`);
  });

  after(() => {
    Given(`System cleans pictures setup`);
  });

  it(`user is able to create nested lists`, () => {
    const sample = `Some text

1. First Item
    - Subitem A
    - Subitem B
        1. Sub-subitem I
        2. Sub-subitem II
    - Subitem C
2. Second Item
    - Subitem A
    - Subitem B
        1. Sub-subitem I
        2. Sub-subitem II
3. Third Item
    - Subitem A
        1. Sub-subitem I
        - Deepest Sub-sub-subitem a
        - Deepest Sub-sub-subitem b
        2. Sub-subitem II
    - Subitem B`;

    Given(`Im on page`, `home`)
      .And(`I see not disabled button`, [`Sign in`])
      .When(`I clear creator`)
      .And(`I type in creator`, sample)
      .Then(`I wait`, 2000)
      .And(`System takes picture`)
      .When(`I click button`, [`Change theme`])
      .Then(`System takes picture`);
  });
});
