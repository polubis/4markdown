import { thumbnailExtensions } from 'models/thumbnail';

const thumbnailRestrictions = {
  type: thumbnailExtensions.map((extension) => `image/${extension}`).join(`, `),
  size: 1,
} as const;

export { thumbnailRestrictions };
