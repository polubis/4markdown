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

  console.table(newBenchmark.limits);
  console.table(newBenchmark.chunks);
  console.table({
    sum: newBenchmark.totalSize,
  });

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

checkCurrentBenchmark();
checkNewBenchmark();
