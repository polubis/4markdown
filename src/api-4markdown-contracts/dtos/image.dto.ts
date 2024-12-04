import type { Id, Path } from '../atoms';

const IMAGE_EXTENSIONS = [`png`, `jpeg`, `jpg`, `gif`, `webp`] as const;

type ImageExtension = (typeof IMAGE_EXTENSIONS)[number];
type ImageContentType = `image/${ImageExtension}`;

type ImageDto = {
  extension: ImageExtension;
  contentType: ImageContentType;
  url: Path;
  id: Id;
};

export { IMAGE_EXTENSIONS };
export type { ImageDto };
