import { Button } from 'design-system/button';
import Modal from 'design-system/modal';
import React from 'react';
import { BiX } from 'react-icons/bi';
import {
  mindmapsCreatorStoreActions,
  mindmapsCreatorStoreSelectors,
} from 'store/mindmaps-creator/mindmaps-creator.store';

const NodesRemovalConfirmationContainer = () => {
  const selectedNodes = mindmapsCreatorStoreSelectors.useSelectedNodes();

  return (
    <Modal onEscape={mindmapsCreatorStoreActions.cancelNodesRemoval}>
      <div className="flex items-center justify-between gap-4 mb-6">
        <h6 className="text-xl">Confirm Removal</h6>
        <Button
          i={2}
          s={1}
          title="Close nodes removal"
          onClick={mindmapsCreatorStoreActions.cancelNodesRemoval}
        >
          <BiX />
        </Button>
      </div>
      <section>
        <p>
          You are about to remove the following nodes. Please note that this
          action is{` `}
          <strong className="text-red-600 dark:text-red-400">
            permanent and cannot be undone
          </strong>
          .
        </p>
        <ul className="flex flex-col space-y-0.5 mt-4">
          {selectedNodes.map((node) => (
            <li className="text-lg" key={node.id}>
              {node.data.name}
            </li>
          ))}
        </ul>
      </section>
      <footer className="mt-8 flex space-x-2 justify-end">
        <Button
          i={1}
          s={2}
          auto
          title="Cancel nodes removal"
          onClick={mindmapsCreatorStoreActions.cancelNodesRemoval}
        >
          Cancel
        </Button>
        <Button
          i={2}
          s={2}
          auto
          title="Confirm nodes removal"
          onClick={mindmapsCreatorStoreActions.removeSelectedNodes}
        >
          Remove
        </Button>
      </footer>
    </Modal>
  );
};

export { NodesRemovalConfirmationContainer };
