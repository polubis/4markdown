import { imageExtensions } from 'consts/image-restrictions';
import { Id, Path } from './general';

type ImageExtension = (typeof imageExtensions)[number];
type ImageContentType = `image/${ImageExtension}`;

interface UploadImageDto {
  extension: ImageExtension;
  contentType: ImageContentType;
  url: Path;
  id: Id;
}
type UploadImagePayload = { image: FileReader['result'] };

export { imageExtensions };
export type {
  UploadImageDto,
  UploadImagePayload,
  ImageExtension,
  ImageContentType,
};
