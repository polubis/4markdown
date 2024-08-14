const fs = require(`fs`);
const path = require(`path`);

const result = JSON.parse(
  fs.readFileSync(path.join(__dirname, `public`, `webpack.stats.json`), `utf8`),
);

const LIMIT = 100;
const UNIT = `kB`;

const stats = {};

Object.entries(result.namedChunkGroups).forEach(([chunkKey, chunkValue]) => {
  const size = Number.parseFloat((chunkValue.assetsSize / 1024).toFixed(2));

  stats[chunkKey] = {
    size,
  };

  if (Array.isArray(chunkValue.assets) && chunkValue.assets.length > 0) {
    stats[chunkKey].maxAllowedSize = LIMIT * chunkValue.assets.length;
    stats[chunkKey].foundAssets = chunkValue.assets.length;
  }
});

console.table({
  limitPerFile: LIMIT,
  unit: UNIT,
});
console.table(stats);

if (Object.values(stats).some(({ size }) => size >= LIMIT)) {
  throw Error(`Benchmark check failed - limit is ${LIMIT}${UNIT} per page`);
}
