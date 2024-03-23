import { Id, Path } from './general';

const IMAGE_EXTENSIONS = [`png`, `jpeg`, `jpg`, `gif`] as const;

type ImageExtension = (typeof IMAGE_EXTENSIONS)[number];
type ImageContentType = `image/${ImageExtension}`;

interface UploadImageDto {
  extension: ImageExtension;
  contentType: ImageContentType;
  url: Path;
  id: Id;
}
type UploadImagePayload = { image: FileReader['result'] };

export { IMAGE_EXTENSIONS };
export type {
  UploadImageDto,
  UploadImagePayload,
  ImageExtension,
  ImageContentType,
};
