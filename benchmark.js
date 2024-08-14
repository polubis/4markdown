const fs = require(`fs`);
const path = require(`path`);

const result = JSON.parse(
  fs.readFileSync(path.join(__dirname, `public`, `webpack.stats.json`), `utf8`),
);

const LIMIT = 150;
const UNIT = `kB`;

const stats = {};

const twoDecimal = (value) => Number.parseFloat(value.toFixed(2));

Object.entries(result.namedChunkGroups).forEach(([chunkKey, chunkValue]) => {
  const sizes = chunkValue.assets.map(({ size }) => twoDecimal(size / 1024));

  stats[chunkKey] = {
    sizes: sizes.join(`|`),
    totalSize: twoDecimal(sizes.reduce((sum, assetSize) => assetSize + sum, 0)),
  };
});

console.table({
  limitPerChunkGroup: LIMIT,
  unit: UNIT,
});
console.table(stats);

const hasToBigChunk = Object.values(stats)
  .flatMap(({ sizes }) =>
    sizes.split(`|`).map((size) => Number.parseFloat(size)),
  )
  .some((size) => size > LIMIT);

if (hasToBigChunk) {
  throw Error(`Benchmark check failed - limit is ${LIMIT}${UNIT} per page`);
}
