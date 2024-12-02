const { readFileSync } = require(`fs`);
const path = require(`path`);

const currentBenchmark = JSON.parse(
  readFileSync(path.join(__dirname, `public`, `benchmark.json`), `utf8`),
);

console.log(`@@@ Current benchmark @@@`);
console.table(currentBenchmark);

if (currentBenchmark.failed) {
  throw Error(
    `Benchmark check failed - limit is ${currentBenchmark.limitPerChunkGroup}${currentBenchmark.limitUnit} per chunk`,
  );
}
