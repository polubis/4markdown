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

const ImageUploaderAuthContainer = () => {
  const imageModal = useToggle<File | null>();
  const errorModal = useToggle();
  const docsStore = useDocsStore();
  const imagesStore = useImagesStore();
  const [, copy] = useCopy();

  const [upload] = useFileInput({
    accept: `image/png, image/jpeg, image/jpg`,
    // Missing size check
    onChange: ({ target: { files } }) => {
      const uploadAndOpen = async (): Promise<void> => {
        if (!!files && files.length === 1) {
          try {
            await authStoreSelectors.authorized().uploadImage(files[0]);
            imageModal.open();
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
    copy(`![Image alt](URL_WILL_BE_HERE)*Image description!*`);
    imageModal.close();
  };

  return (
    <>
      <UploadImageButton
        disabled={docsStore.is === `busy` || imagesStore.is === `busy`}
        onClick={upload}
      />

      {errorModal.opened && (
        <ErrorModal
          heading="Invalid image"
          message="Please ensure that the image format is valid. Supported formats include PNG, JPG, and JPEG, with a maximum file size of 8MB"
          onClose={errorModal.close}
        />
      )}

      {imageModal.opened && (
        <Modal>
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
            <span className="text-md">
              To use <strong>uploaded image</strong> in markdown editor click
              below button.
            </span>
            <Button
              title="Copy image link"
              className="capitalize mt-4"
              auto
              s={1}
              i={2}
              onClick={copyAndClose}
            >
              Copy Link
            </Button>
          </p>
        </Modal>
      )}
    </>
  );
};

export default ImageUploaderAuthContainer;
