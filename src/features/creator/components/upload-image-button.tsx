import React from 'react';
import { Button, type ButtonProps } from 'design-system/button';
import { BiImageAdd } from 'react-icons/bi';

interface UploadImageButtonProps
  extends Omit<ButtonProps, 'title' | 'children' | 'i' | 's'> {}

const UploadImageButton = (props: UploadImageButtonProps) => {
  return (
    <Button {...props} s="auto" className="p-1" i={1} title="Upload image">
      <BiImageAdd size={20} />
    </Button>
  );
};

export { UploadImageButton };
