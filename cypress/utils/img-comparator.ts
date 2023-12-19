import fs from 'fs';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

const compare = (path1: string, path2: string) => {
  const img1 = PNG.sync.read(fs.readFileSync(path1));
  const img2 = PNG.sync.read(fs.readFileSync(path2));

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

  fs.writeFileSync(`path/to/diff.png`, PNG.sync.write(diff));

  if (numDiffPixels > 0) {
    throw Error(`Images are different`);
  }
};

export { compare };
