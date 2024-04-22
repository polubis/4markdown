import { Id, Url } from './general';

const docThumbnailExtensions = [`png`, `jpeg`, `jpg`, `webp`] as const;
const docThumbnailSizes = [`xl`, `lg`, `md`, `sm`, `xs`] as const;

type DocThumbnailExtension = (typeof docThumbnailExtensions)[number];
type DocThumbnailContentType = `image/${DocThumbnailExtension}`;
type DocThumbnailSize = (typeof docThumbnailSizes)[number];
type DocThumbnailUrls = Record<DocThumbnailSize, Url>;
interface DocThumbnail {
  id: Id;
  extension: DocThumbnailExtension;
  contentType: DocThumbnailContentType;
  urls: DocThumbnailUrls;
}

export type {
  DocThumbnailContentType,
  DocThumbnailExtension,
  DocThumbnailSize,
  DocThumbnailUrls,
  DocThumbnail,
};
export { docThumbnailExtensions, docThumbnailSizes };
