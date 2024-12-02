import { Button } from 'design-system/button';
import { Modal } from 'design-system/modal';
import { useFileInput } from 'development-kit/use-file-input';
import { useToggle } from 'development-kit/use-toggle';
import React from 'react';
import { BiX } from 'react-icons/bi';
import { UploadImageButton } from '../components/upload-image-button';
import ErrorModal from 'components/error-modal';
import { useDocsStore } from 'store/docs/docs.store';
import { useCopy } from 'development-kit/use-copy';
import { Status } from 'design-system/status';
import { IMAGE_EXTENSIONS, type ImageDto } from 'api-4markdown-contracts';
import { uploadImageAct } from 'acts/upload-image.act';
import { useUploadImageState } from 'store/upload-image';

const imagesStoreRestrictions = {
  type: IMAGE_EXTENSIONS.map((extension) => `image/${extension}`).join(`, `),
  size: 4,
} as const;

const ImageUploaderAuthContainer = () => {
  const imageModal = useToggle<ImageDto | null>();
  const errorModal = useToggle();
  const docsStore = useDocsStore();
  const imagesState = useUploadImageState();
  const [copyState, copy] = useCopy();

  const [upload] = useFileInput({
    accept: imagesStoreRestrictions.type,
    maxSize: imagesStoreRestrictions.size,
    onChange: async ({ target: { files } }) => {
      if (!!files && files.length === 1) {
        const result = await uploadImageAct(files[0]);
        result.is === `ok`
          ? imageModal.openWithData(result.data)
          : errorModal.open();
      }
    },
    onError: errorModal.open,
  });

  const copyAndClose = (): void => {
    if (!imageModal.data)
      throw Error(`There is no data assigned to image modal`);

    copy(`![Alt](${imageModal.data.url})\n*Description*`);
    imageModal.close();
  };

  return (
    <>
      {copyState.is === `copied` && <Status>Image copied</Status>}
      {imagesState.is === `busy` && <Status>Uploading image...</Status>}

      <UploadImageButton
        disabled={docsStore.is === `busy` || imagesState.is === `busy`}
        onClick={upload}
      />

      {errorModal.opened && (
        <ErrorModal
          heading="Invalid image"
          message={
            <>
              Please ensure that the image format is valid. Supported formats
              include <strong>{imagesStoreRestrictions.type}</strong>, with a
              maximum file size of{` `}
              <strong>{imagesStoreRestrictions.size} megabytes</strong>
            </>
          }
          onClose={errorModal.close}
        />
      )}

      {imageModal.opened && (
        <Modal onEscape={imageModal.close}>
          <div className="flex items-center justify-between gap-4 mb-6">
            <h6 className="text-xl">Image uploaded ✅</h6>
            <Button
              type="button"
              i={2}
              s={1}
              title="Close image upload"
              onClick={imageModal.close}
            >
              <BiX />
            </Button>
          </div>
          <p>
            To use <strong>uploaded image</strong> in markdown editor click
            below button.
          </p>
          <Button
            title="Copy image link"
            className="capitalize mt-8 ml-auto"
            auto
            s={2}
            i={2}
            onClick={copyAndClose}
          >
            Copy Link
          </Button>
        </Modal>
      )}
    </>
  );
};

export default ImageUploaderAuthContainer;
