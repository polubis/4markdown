import { Button } from 'design-system/button';

import Modal from 'design-system/modal';

import React from 'react';
import { BiX } from 'react-icons/bi';
import { meta } from '../../meta';
import { Link } from 'gatsby';

const CreationModalContainer = () => {
  return (
    <Modal>
      <header className="flex items-center">
        <h6 className="text-xl mr-8">Let&apos;s Create Something</h6>
        <Button
          i={2}
          s={1}
          className="ml-auto"
          type="button"
          title="Close creation"
          onClick={close}
        >
          <BiX />
        </Button>
      </header>
      <ul className="mt-8 space-y-4">
        <li className="flex flex-col cursor-pointer border-2 rounded-lg px-4 py-3 bg-zinc-200 dark:hover:bg-gray-900 dark:bg-gray-950 hover:bg-zinc-300 border-zinc-300 dark:border-zinc-800">
          <Link to={meta.routes.home}>
            <h6 className="text-lg">Document</h6>
            <p className="mt-0.5">
              Create documents using{` `}
              Markdown
              {` `}
              syntax with a real-time editor for seamless content building
            </p>
          </Link>
        </li>
        <li className="flex flex-col py-3 px-4 rounded-lg bg-zinc-200 dark:hover:bg-gray-900 dark:bg-gray-950 hover:bg-zinc-300 border-zinc-300 dark:border-zinc-800">
          <h6 className="text-lg">Mindmap</h6>
          <p className="mt-0.5">
            Organize your thoughts and resources visually to build your second
            brain with interconnected materials
          </p>
        </li>
      </ul>
    </Modal>
  );
};

export { CreationModalContainer };
