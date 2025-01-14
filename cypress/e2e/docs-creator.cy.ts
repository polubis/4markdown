/* eslint-disable no-useless-escape */
import { BASE_COMMANDS } from '../utils/commands';
import { Gherkin } from '../utils/gherkin';

describe(`Docs creator works when`, () => {
  const { Given } = Gherkin({
    ...BASE_COMMANDS,
    'I test creator syntax': (content: string) => {
      Given(`I clear creator`)
        .And(`I type in creator`, content)
        .Then(`I wait`, 2000)
        .And(`System takes picture`)
        .When(`I click button`, [`Change theme`])
        .Then(`System takes picture`);
    },
  });

  before(() => {
    Given(`System sets pictures folder`, `docs-creator`);
  });

  beforeEach(() => {
    Given(`System cleans local storage`).And(`System has accepted cookies`);
  });

  afterEach(() => {
    Given(`System cleans local storage`);
  });

  after(() => {
    Given(`System cleans pictures setup`);
  });

  it(`user is able to create nested lists`, () => {
    const lists = `Some text

1. First Item
    - Subitem A $1/4$
    - Subitem B
        1. Sub-subitem I
        2. Sub-subitem II
    - Subitem C
2. Second Item
    - [ ] Subitem A
    - [x] Subitem B
        1. Sub-subitem I
        2. Sub-subitem II
3. Third Item
    - Subitem A
        1. Sub-subitem I
        - Deepest Sub-sub-subitem a
        - Deepest Sub-sub-subitem b
        2. Sub-subitem II
    - Subitem B`;

    const code = `It's some code example with \`inline=a\`:

\`\`\`
// Some imagined framework code
controller(\`users/{id}\`, async (_, rawPayload) => {
  // Validation
  const { id } = parse(rawPayload);
  // Getting user from DB by "id"
  const user = await getUser(id);

  return user;
});
\`\`\``;

    cy.readFile(`cypress/samples/math.md`).then((math) => {
      Given(`Im on page`, `home`)
        .And(`I see not disabled button`, [`Sign in`])
        .When(`I test creator syntax`, lists)
        .And(`I test creator syntax`, math)
        .And(`I test creator syntax`, code);
    });
  });
});
