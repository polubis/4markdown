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

const ImageUploaderAuthContainer = () => {
  const imageModal = useToggle<File | null>();
  const errorModal = useToggle();
  const docsStore = useDocsStore();

  const [upload] = useFileInput({
    accept: `image/png, image/jpeg, image/jpg`,
    onChange: ({ target: { files } }) => {
      if (!!files && files.length === 0) {
        authStoreSelectors.authorized().uploadImage(files[0]);
      }
    },
    onError: errorModal.open,
  });

  return (
    <>
      <UploadImageButton disabled={docsStore.is === `busy`} onClick={upload} />

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
            <h6 className="text-xl">Image upload</h6>
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
        </Modal>
      )}
    </>
  );
};

export default ImageUploaderAuthContainer;
