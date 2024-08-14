const fs = require(`fs`);
const path = require(`path`);

const result = JSON.parse(
  fs.readFileSync(path.join(__dirname, `public`, `webpack.stats.json`), `utf8`),
);

const LIMIT = 100;
const UNIT = `kB`;

const currentStatsPath = path.join(__dirname, `build-benchmark.json`);

const currentStats = fs.existsSync(currentStatsPath)
  ? JSON.parse(fs.readFileSync(currentStatsPath, `utf8`))
  : {};

const stats = {};

Object.entries(result.namedChunkGroups).forEach(([chunkKey, chunkValue]) => {
  const size = Number.parseFloat((chunkValue.assetsSize / 1024).toFixed(2));
  const oldSize = Number.parseFloat(currentStats[chunkKey]?.size);

  stats[chunkKey] = {
    unit: UNIT,
    size,
  };

  if (Number.isNaN(oldSize)) return;

  const diff = Number.parseFloat((size - oldSize).toFixed(2));

  if (diff === 0) return;

  const absDiff = Math.abs(diff);

  stats[chunkKey].diff = diff < 0 ? `- ${absDiff}` : `+ ${absDiff}`;
});

console.table(stats);

if (Object.values(stats).some(({ size }) => size >= LIMIT)) {
  throw Error(`Benchmark check failed - limit is ${LIMIT}${UNIT} per page`);
}

fs.writeFile(
  path.join(__dirname, `build-benchmark.json`),
  JSON.stringify(stats, null, 2),
  (err) => {
    if (err) {
      console.error(`Error writing file:`, err);
    } else {
      console.log(`File has been written successfully.`);
    }
  },
);
