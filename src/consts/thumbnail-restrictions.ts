import { docThumbnailExtensions } from 'models/doc-thumbnail';

const thumbnailRestrictions = {
  type: docThumbnailExtensions.map((extension) => `image/${extension}`).join(`, `),
  size: 1,
} as const;

export { thumbnailRestrictions };
