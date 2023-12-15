import { Button } from 'design-system/button';
import React from 'react';
import { BiEdit } from 'react-icons/bi';

const EditionBar = () => {
  return (
    <div className="flex px-4 py-2 bg-zinc-200 dark:bg-gray-950 border-b-2 border-zinc-300 dark:border-zinc-800">
      <h6 className="text-xl font-bold">Unknown</h6>
      <Button i={2} className="ml-2" rfull title="Change name">
        <BiEdit />
      </Button>
    </div>
  );
};

export default EditionBar;
