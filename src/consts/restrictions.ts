import { imageExtensions } from 'models/image';

const imageRestrictions = {
  type: imageExtensions.map((extension) => `image/${extension}`).join(`, `),
  size: 4,
} as const;

const thumbnailRestrictions = {
  type: imageExtensions
    .filter((extension) => extension !== `gif`)
    .map((extension) => `image/${extension}`)
    .join(`, `),
  size: 1,
} as const;

export { imageRestrictions, thumbnailRestrictions };
