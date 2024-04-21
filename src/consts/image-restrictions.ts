const imageExtensions = [`png`, `jpeg`, `jpg`, `gif`] as const;

const imageRestrictions = {
  type: imageExtensions.map((extension) => `image/${extension}`).join(`, `),
  size: 4,
} as const;

export { imageExtensions, imageRestrictions };
