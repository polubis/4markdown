const { readFileSync } = require(`fs`);
const path = require(`path`);

const checkCurrentBenchmark = () => {
  console.log(`@@@ Current benchmark @@@`);
};

const checkNewBenchmark = () => {
  const newBenchmark = JSON.parse(
    readFileSync(path.join(__dirname, `public`, `benchmark.json`), `utf8`),
  );

  console.log(`@@@ New benchmark @@@`);

  console.table({
    limitPerChunkGroup: newBenchmark.limitPerChunkGroup,
    unit: newBenchmark.limitUnit,
  });
  console.table(newBenchmark.stats);
  console.table({
    sum: newBenchmark.totalSize,
  });

  if (newBenchmark.failed) {
    throw Error(
      `Benchmark check failed - limit is ${newBenchmark.limitPerChunkGroup}${newBenchmark.limitUnit} per chunk`,
    );
  }
};

checkCurrentBenchmark();
checkNewBenchmark();
