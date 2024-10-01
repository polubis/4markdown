import React from 'react';
import { BiPlus } from 'react-icons/bi';
import { Button } from 'design-system/button';
import { CreationModalContainer } from './creation-modal.container';

const CreationLinkContainer = () => {
  return (
    <>
      <div className="relative">
        <Button auto i={2} s={2} title="Create any content">
          <BiPlus />
          <span className="ml-0.5">Create</span>
        </Button>
        <CreationModalContainer />
      </div>
    </>
  );
};

export { CreationLinkContainer };
