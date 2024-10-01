import React from 'react';
import { BiPlus } from 'react-icons/bi';
import { meta } from '../../meta';
import { useToggle } from 'development-kit/use-toggle';
import { Button } from 'design-system/button';

const CreationLinkContainer = () => {
  const modal = useToggle();

  return (
    <>
      <Button auto i={2} s={2} title="Create any content" onClick={modal.open}>
        <BiPlus />
        <span className="ml-0.5">Create</span>
      </Button>
    </>
  );
};

export { CreationLinkContainer };
