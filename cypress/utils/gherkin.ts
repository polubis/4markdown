import { vibetest } from '@greenonsoftware/vibetest';

const gherkin = vibetest({
  mode: `gherkin`,
  engine: `cypress`,
});

export { gherkin };
