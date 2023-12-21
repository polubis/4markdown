const fs = require(`fs`);
const path = require(`path`);
const { PNG } = require(`pngjs`);
const pixelmatch = require(`pixelmatch`);

const args = process.argv;
const suiteName = args[2];

const createDiffs = () => {
  const baselineDirPath = path.join(
    __dirname,
    `cypress`,
    `screenshots`,
    `baseline`,
    suiteName,
  );

  fs.readdir(baselineDirPath, (err, files) => {
    if (err) {
      console.error(`Error reading directory:`, err);
      return;
    }

    // Filter out subdirectories
    const filePaths = files.filter((file) =>
      fs.statSync(path.join(baselineDirPath, file)).isFile(),
    );

    filePaths.forEach((file) => {
      const img1 = PNG.sync.read(
        fs.readFileSync(
          path.join(
            __dirname,
            `cypress`,
            `screenshots`,
            `baseline`,
            suiteName,
            file,
          ),
        ),
      );

      const img2 = PNG.sync.read(
        fs.readFileSync(
          path.join(
            __dirname,
            `cypress`,
            `screenshots`,
            `current`,
            suiteName,
            file,
          ),
        ),
      );

      const { width, height } = img1;
      const diff = new PNG({ width, height });

      const numDiffPixels = pixelmatch(
        img1.data,
        img2.data,
        diff.data,
        width,
        height,
        { threshold: 0.1 },
      );

      if (numDiffPixels > 0) {
        try {
          fs.mkdirSync(path.join(__dirname, `cypress`, `screenshots`));
        } catch {}
        try {
          fs.mkdirSync(path.join(__dirname, `cypress`, `screenshots`, `diffs`));
        } catch {}
        try {
          fs.mkdirSync(
            path.join(__dirname, `cypress`, `screenshots`, `diffs`, suiteName),
          );
        } catch {}

        fs.writeFileSync(
          path.join(
            __dirname,
            `cypress`,
            `screenshots`,
            `diffs`,
            suiteName,
            file,
          ),
          PNG.sync.write(diff),
        );
      }
    });
  });
};

createDiffs();
