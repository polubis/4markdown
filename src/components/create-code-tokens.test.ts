import { expect } from '@jest/globals';
import { createCodeTokens } from './create-code-tokens';

// const command = `(a,1,2)(d,1,15)(e,1-4,19,21,24)`;

// const instructions = command.split(/\(|\)/).filter(Boolean);

// console.log(instructions);

// const tokensGroup = {
//   a: [],
//   d: [],
//   e: [],
// };

// instructions.forEach((instruction) => {
//   const [action, ...tokens] = instruction.split(`,`);
//   tokensGroup[action].push(
//     ...tokens
//       .map((token) => token.split(`-`).map(Number))
//       .flatMap((tokens) => {
//         if (tokens.length === 2) {
//           const [start, end] = tokens;

//           return Array.from(
//             { length: end - start + 1 },
//             (_, index) => start + index
//           );
//         }

//         return tokens;
//       })
//   );
// });

// console.log(tokensGroup);

describe(`Tokens retrieve works when: `, () => {
  it(`returns the correct tokens for a simple command`, () => {
    expect(createCodeTokens(`(a,1,2)(d,1,15)(e,1-4,19,21,24)`)).toEqual({
      is: `ok`,
      a: [1, 2],
      d: [1, 15],
      e: [1, 2, 3, 4, 19, 21, 24],
    });
    expect(createCodeTokens(`(a,1,2)(d,1,15),19,21,24)(E,1-18)`)).toEqual({
      is: `fail`,
    });
    expect(createCodeTokens(`(a)`)).toEqual({
      is: `fail`,
    });
    expect(createCodeTokens(`(a)(d,12---)`)).toEqual({
      is: `fail`,
    });
  });
});
