const docThumbnailExtensions = [`png`, `jpeg`, `jpg`, `webp`] as const;

type DocThumbnailExtension = (typeof docThumbnailExtensions)[number];
type DocThumbnailContentType = `image/${DocThumbnailExtension}`;

export type { DocThumbnailContentType, DocThumbnailExtension };
export { docThumbnailExtensions };
