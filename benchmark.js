const fs = require(`fs`);
const path = require(`path`);

try {
  const result = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, `public`, `webpack.stats.json`),
      `utf8`,
    ),
  );

  const stats = [];

  Object.entries(result.namedChunkGroups).forEach(([chunkKey, chunkValue]) => {
    stats.push({
      key: chunkKey,
      size: (chunkValue.assetsSize / 1024).toFixed(2) + ` kB`,
    });
  });

  console.table(stats);
} catch (err) {
  console.error(`Error reading file:`, err);
}
