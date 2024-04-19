import { Button } from 'design-system/button';
import Modal from 'design-system/modal';
import { useFileInput } from 'development-kit/use-file-input';
import { useToggle } from 'development-kit/use-toggle';
import React from 'react';
import { BiX } from 'react-icons/bi';
import { authStoreSelectors } from 'store/auth/auth.store';
import { UploadImageButton } from '../components/upload-image-button';
import ErrorModal from 'components/error-modal';
import { useDocsStore } from 'store/docs/docs.store';
import { useImagesStore } from 'store/images/images.store';
import { useCopy } from 'development-kit/use-copy';
import { Status } from 'design-system/status';
import { UploadImageDto } from 'models/image';
import { imageRestrictions } from 'consts/restrictions';

const ImageUploaderAuthContainer = () => {
  const imageModal = useToggle<UploadImageDto | null>();
  const errorModal = useToggle();
  const docsStore = useDocsStore();
  const imagesStore = useImagesStore();
  const [copyState, copy] = useCopy();

  const [upload] = useFileInput({
    accept: imageRestrictions.type,
    maxSize: imageRestrictions.size,
    onChange: ({ target: { files } }) => {
      const uploadAndOpen = async (): Promise<void> => {
        if (!!files && files.length === 1) {
          try {
            const result = await authStoreSelectors
              .authorized()
              .uploadImage(files[0]);
            imageModal.openWithData(result);
          } catch {
            errorModal.open();
          }
        }
      };

      uploadAndOpen();
    },
    onError: errorModal.open,
  });

  const copyAndClose = (): void => {
    if (!imageModal.data)
      throw Error(`There is no data assigned to image modal`);

    copy(`![Alt](${imageModal.data.url})*Description*`);
    imageModal.close();
  };

  return (
    <>
      <Status open={copyState.is === `copied`}>Image copied</Status>
      <Status open={imagesStore.is === `busy`}>Uploading image...</Status>

      <UploadImageButton
        disabled={docsStore.is === `busy` || imagesStore.is === `busy`}
        onClick={upload}
      />

      {errorModal.opened && (
        <ErrorModal
          heading="Invalid image"
          message={
            <>
              Please ensure that the image format is valid. Supported formats
              include <strong>{imageRestrictions.type}</strong>, with a maximum
              file size of{` `}
              <strong>{imageRestrictions.size} megabytes</strong>
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
          <p className="text-md">
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
