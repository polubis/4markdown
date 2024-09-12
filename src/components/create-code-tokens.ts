type Tokens = {
  a: number[];
  d: number[];
  e: number[];
};

type OkTokens = {
  is: `ok`;
} & Tokens;

type FailTokens = {
  is: `fail`;
};

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

// console.log(tokensGroup["d"]);

const createCodeTokens = (command: string): OkTokens | FailTokens => {
  try {
    const instructions = command.split(/\(|\)/).filter(Boolean);

    const tokensGroup: Tokens = {
      a: [],
      d: [],
      e: [],
    };

    instructions.forEach((instruction) => {
      const [action, ...tokens] = instruction.split(`,`);

      tokensGroup[action].push(
        ...tokens
          .map((token) => token.split(`-`).map(Number))
          .flatMap((tokens) => {
            if (tokens.length === 2) {
              const [start, end] = tokens;

              return Array.from(
                { length: end - start + 1 },
                (_, index) => start + index,
              );
            }

            return tokens;
          }),
      );
    });

    return {
      is: `ok`,
      a: [0, 0],
      d: [0, 0],
      e: [0, 0],
    };
  } catch {
    return {
      is: `fail`,
    };
  }
};

export { createCodeTokens };

// Dict

// Command - > (a,1,2)(d,1,15)(e,1-4,19,21,24)
// Instruction -> { a: [1,2] }
