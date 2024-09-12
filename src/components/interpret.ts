type Instructions = {
  a: number[];
  d: number[];
  e: number[];
};

type InstructionSymbol = keyof Instructions;

type OkInstructions = {
  is: `ok`;
} & Instructions;

type FailedInstructions = {
  is: `failed`;
};

const interpret = (code: string): OkInstructions | FailedInstructions => {
  try {
    const commands = code.split(/\(|\)/).filter(Boolean);

    const instructions: Instructions = {
      a: [],
      d: [],
      e: [],
    };

    commands.forEach((command) => {
      const [symbol, ...ranges] = command.split(`,`);

      instructions[symbol as InstructionSymbol].push(
        ...ranges
          .map((ranges) => ranges.split(`-`).map(Number))
          .flatMap((ranges) => {
            if (ranges.length === 2) {
              const [start, end] = ranges;

              return Array.from(
                { length: end - start + 1 },
                (_, index) => start + index,
              );
            }

            return ranges;
          }),
      );
    });

    return {
      ...instructions,
      is: `ok`,
    };
  } catch {
    return {
      is: `failed`,
    };
  }
};

export { interpret };
