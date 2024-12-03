const { readFileSync } = require(`fs`);
const path = require(`path`);

const newBenchmark = JSON.parse(
  readFileSync(path.join(__dirname, `public`, `benchmark.json`), `utf8`),
);

const currentBenchmark = () => {
  return fetch(`https://soft-pithivier-093469.netlify.app/benchmark.json`)
    .then((response) => {
      if (!response.ok) {
        console.warn(`Failed to fetch data - new benchmark will be applied`);

        return newBenchmark;
      }
      return response.json();
    })
    .then((benchmark) => {
      return benchmark;
    })
    .catch(() => {
      console.warn(`Unhandled error - new benchmark will be applied`);
      return newBenchmark;
    });
};

currentBenchmark().then((currentBenchmark) => {
  const logSetup = () => {
    console.log(`@@@ Setup @@@`);
    console.table(newBenchmark.limits);
  };

  const logCurrentBenchmark = () => {
    console.log(`@@@ Current benchmark @@@`);

    console.table(
      Object.entries(currentBenchmark.chunks).reduce(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        (acc, [key, { sizes, ...values }]) => {
          acc[key] = values;
          return acc;
        },
        {},
      ),
    );

    console.table({
      sum: currentBenchmark.totalSize,
    });
  };

  const logNewBenchmark = () => {
    console.log(`@@@ New benchmark @@@`);

    console.table(
      Object.entries(newBenchmark.chunks).reduce(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        (acc, [key, { sizes, ...values }]) => {
          acc[key] = values;
          return acc;
        },
        {},
      ),
    );

    console.table({
      sum: newBenchmark.totalSize,
    });
  };

  const logDifferences = () => {
    console.log(`@@@ Differences @@@`);

    const sumDiff = newBenchmark.totalSize - currentBenchmark.totalSize;

    const chunksDiff = Object.entries(newBenchmark.chunks).reduce(
      (acc, [key, value]) => {
        if (value.totalSize !== currentBenchmark.chunks[key].totalSize) {
          const totalChunksGroupDiff =
            value.totalSize - currentBenchmark.chunks[key].totalSize;

          acc[key] = {
            sizesAsString: value.sizesAsString,
            totalSize:
              totalChunksGroupDiff > 0
                ? `+${totalChunksGroupDiff}`
                : `${totalChunksGroupDiff}`,
          };
        }

        return acc;
      },
      {},
    );

    console.table(chunksDiff);

    console.table({
      sum: sumDiff === 0 ? `=` : sumDiff > 0 ? `+${sumDiff}` : `${sumDiff}`,
    });
  };

  const verifyBenchmark = () => {
    if (newBenchmark.failedChunkGroups.length > 0) {
      throw Error(
        `
          Benchmark check failed - limit is ${newBenchmark.limits.chunk}${newBenchmark.limits.unit} per chunk. 
          
          Here you've list of failed chunk groups: 
  
          ${newBenchmark.failedChunkGroups.join(`,`)}
        `,
      );
    }
  };

  logSetup();
  logCurrentBenchmark();
  logNewBenchmark();
  logDifferences();
  verifyBenchmark();
});
