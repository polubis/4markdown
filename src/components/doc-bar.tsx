import { Button } from 'design-system/button';
import React from 'react';
import { BiEdit, BiSave } from 'react-icons/bi';

const DocBar = () => {
  return (
    <div className="flex px-4 py-2 bg-zinc-200 dark:bg-gray-950 border-t-2 md:border-b-2 md:border-t-0 border-zinc-300 dark:border-zinc-800">
      <h6 className="text-xl font-bold">Unknown</h6>
      <div className="bg-zinc-300 dark:bg-zinc-800 h-8 w-0.5 mx-4 shrink-0" />
      <Button i={2} rfull title="Change name">
        <BiEdit />
      </Button>
      <Button i={2} className="ml-2" rfull title="Change name">
        <BiSave />
      </Button>
    </div>
  );
};

export default DocBar;
