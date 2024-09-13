const measure = (func: () => void): number => {
  const start = performance.now();
  func();
  const end = performance.now();

  return end - start;
};

const runProbes = ({
  func,
  iterations,
}: {
  func: () => void;
  iterations: number;
}): number[] => {
  let i = 0;
  const result: number[] = [];

  while (i < iterations) {
    result.push(measure(func));
    i++;
  }

  return result;
};

interface Summary<K extends string> {
  key: K;
  total: number;
}

interface Config<K extends string> {
  key: K;
  values: number[];
}

const benchmark = <K extends string>({
  key,
  values,
}: Config<K>): Summary<K> => {
  const total = parseFloat(
    values
      .reduce(
        (acc, sum) => parseFloat(acc.toFixed(4)) + parseFloat(sum.toFixed(4)),
        0,
      )
      .toFixed(4),
  );

  return {
    key,
    total,
  };
};

export { runProbes, benchmark };
