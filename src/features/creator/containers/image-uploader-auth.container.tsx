import { Button } from 'design-system/button';
import { Modal } from 'design-system/modal';
import { useFileInput } from 'development-kit/use-file-input';
import React from 'react';
import ErrorModal from 'components/error-modal';
import { useDocsStore } from 'store/docs/docs.store';
import { useCopy } from 'development-kit/use-copy';
import { Status } from 'design-system/status';
import { IMAGE_EXTENSIONS, type ImageDto } from 'api-4markdown-contracts';
import { uploadImageAct } from 'acts/upload-image.act';
import { useUploadImageState } from 'store/upload-image';
import { UploadImageButton } from '../components/upload-image-button';
import { useSimpleFeature } from 'development-kit/use-simple-feature';
import { useFeature } from 'development-kit/use-feature';

const IMAGE_RULES = {
  type: IMAGE_EXTENSIONS.map((extension) => `image/${extension}`).join(`, `),
  size: 4,
} as const;

const ImageUploaderAuthContainer = () => {
  const imageModal = useFeature<ImageDto>();
  const errorModal = useSimpleFeature();
  const docsStore = useDocsStore();
  const imageState = useUploadImageState();
  const [copyState, copy] = useCopy();

  const [upload] = useFileInput({
    accept: IMAGE_RULES.type,
    maxSize: IMAGE_RULES.size,
    onChange: async ({ target: { files } }) => {
      if (!!files && files.length === 1) {
        const result = await uploadImageAct(files[0]);
        result.is === `ok` ? imageModal.on(result.data) : errorModal.on();
      }
    },
    onError: errorModal.on,
  });

  const copyAndClose = (): void => {
    if (imageModal.is === `off`)
      throw Error(`There is no data assigned to image modal`);

    copy(`![Alt](${imageModal.data.url})\n*Description*`);
    imageModal.off();
  };

  return (
    <>
      {copyState.is === `copied` && <Status>Image copied</Status>}
      {imageState.is === `busy` && <Status>Uploading image...</Status>}

      <UploadImageButton
        disabled={docsStore.is === `busy` || imageState.is === `busy`}
        onClick={upload}
      />

      {errorModal.isOn && (
        <ErrorModal
          heading="Invalid image"
          message={
            <>
              Please ensure that the image format is valid. Supported formats
              include <strong>{IMAGE_RULES.type}</strong>, with a maximum file
              size of{` `}
              <strong>{IMAGE_RULES.size} megabytes</strong>
            </>
          }
          onClose={errorModal.off}
        />
      )}

      {imageModal.is === `on` && (
        <Modal onClose={imageModal.off}>
          <Modal.Header
            title="Image uploaded ✅"
            closeButtonTitle="Close image upload"
          />
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

export { ImageUploaderAuthContainer };
