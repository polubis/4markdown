const fs = require(`fs`);
const path = require(`path`);

const args = process.argv;
const suiteName = args[2];

const sourcePath = path.join(
  __dirname,
  `cypress`,
  `screenshots`,
  `current`,
  suiteName,
);
const destinationPath = path.join(
  __dirname,
  `cypress`,
  `screenshots`,
  `baseline`,
  suiteName,
);

const createBaseline = () => {
  try {
    fs.mkdirSync(path.join(__dirname, `cypress`, `screenshots`));
  } catch {}
  try {
    fs.mkdirSync(path.join(__dirname, `cypress`, `screenshots`, `baseline`));
  } catch {}
  try {
    fs.mkdirSync(destinationPath);
  } catch {}

  try {
    fs.readdirSync(sourcePath).forEach((file) => {
      fs.copyFileSync(
        path.join(sourcePath, file),
        path.join(destinationPath, file),
      );
    });
  } catch {
    console.error(`No snapshots detected under cypress/screenshots/current`);
    process.exit(1);
  }
};

createBaseline();
