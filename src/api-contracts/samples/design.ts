import { mock } from 'api';

// The response is defined internally in library, so there is no need to specify it
// It mocks it on "memory" level. Not like MSW for instance.
// It should be used for development only
const users = await mock(`getUsers`)({
  error: {
    // There is a 50% chance that there will be error throwed
    chance: 0.5,
    error: () => new Error(`Something went wrong`),
  },
  // Betweem 1.5 - 4.5
  delay: [1.5, 4.5],
});
