const imageExtensions = [`png`, `jpeg`, `jpg`, `gif`] as const;

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

export { imageExtensions, imageRestrictions, thumbnailRestrictions };
