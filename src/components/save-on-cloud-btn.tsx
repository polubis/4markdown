import React from 'react';
import { Button } from 'design-system/button';
import { BiSave } from 'react-icons/bi';

const SaveOnCloudButton = () => {
  return (
    <Button className="ml-2" i={2} rfull title="Save file on the cloud">
      <BiSave className="text-2xl" />
    </Button>
  );
};

export default SaveOnCloudButton;
