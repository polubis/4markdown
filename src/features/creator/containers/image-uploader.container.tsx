import { Button } from 'design-system/button';
import Modal from 'design-system/modal';
import { useFileInput } from 'development-kit/use-file-input';
import { useToggle } from 'development-kit/use-toggle';
import React from 'react';
import { BiImageAdd } from 'react-icons/bi';

const ImageUploaderContainer = () => {
  const modal = useToggle<File | null>();

  const [upload] = useFileInput({
    accept: `image/png, image/jpeg, image/jpg`,
    onChange: (e) => {
      modal.openWithData(e.target.files ? e.target.files[0] : null);
    },
  });

  return (
    <>
      <Button i={1} s={2} title="Upload image" onClick={upload}>
        <BiImageAdd />
      </Button>
      {modal.opened && <Modal>{modal.data?.name}</Modal>}
    </>
  );
};

export { ImageUploaderContainer };
