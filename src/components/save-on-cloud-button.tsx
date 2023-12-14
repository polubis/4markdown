import React from 'react';
import { Button, type ButtonProps } from 'design-system/button';
import { BiSave } from 'react-icons/bi';

const SaveOnCloudButton = (
  props: Pick<ButtonProps, 'disabled' | 'onClick'>,
) => {
  return (
    <Button
      className="ml-2"
      i={2}
      rfull
      title="Save file on the cloud"
      {...props}
    >
      <BiSave className="text-2xl" />
    </Button>
  );
};

export default SaveOnCloudButton;
