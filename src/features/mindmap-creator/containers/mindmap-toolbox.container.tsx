import { Button } from 'design-system/button';
import { usePortal } from 'development-kit/use-portal';
import React from 'react';
import { BiPlus } from 'react-icons/bi';

const MindmapToolboxContainer = () => {
  const { render } = usePortal();

  return render(
    <nav className="fixed flex justify-center bottom-0 rounded-tr-md rounded-tl-md p-2 max-w-sm mx-auto left-0 right-0 bg-zinc-200 dark:bg-gray-950 border-zinc-300 dark:border-zinc-800 border">
      <Button i={1} s={2}>
        <BiPlus />
      </Button>
    </nav>,
  );
};

export { MindmapToolboxContainer };
