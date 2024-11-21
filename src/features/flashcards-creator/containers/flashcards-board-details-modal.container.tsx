import { Button } from 'design-system/button';
import Modal from 'design-system/modal';
import { Tabs } from 'design-system/tabs';
import React from 'react';
import { BiPencil, BiTrash, BiX } from 'react-icons/bi';
import { meta } from '../../../../meta';
import { useFlashcardsCreatorStore } from 'store/flashcards-creator/flashcards-creator.store';
import { selectActiveFlashcardsBoard } from 'store/flashcards-creator/flashcards-creator.selectors';
import { formatDistance } from 'date-fns';
import { navigate } from 'core/navigate';
import c from 'classnames';

const FlashcardsBoardDetailsModalContainer = () => {
  const activeFlashcardsBoard = useFlashcardsCreatorStore(
    selectActiveFlashcardsBoard,
  );

  return (
    <Modal>
      <>
        <div className="flex items-center">
          <h6 className="text-xl mr-4">Details</h6>
          <Button
            i={2}
            s={1}
            className="ml-auto"
            title="Delete current flashcards board document"
            // onClick={onOpen}
          >
            <BiTrash />
          </Button>
          {activeFlashcardsBoard.visibility === `permanent` && (
            <Button
              i={2}
              s={1}
              className="ml-2"
              title="Edit current flashcards board"
              //   onClick={permamentDocumentEdition.open}
            >
              <BiPencil />
            </Button>
          )}
          <Button
            i={2}
            s={1}
            className="ml-2"
            title="Close flashcards board details"
            // onClick={onClose}
          >
            <BiX />
          </Button>
        </div>
        <p className="mt-4">
          Name: <strong>{activeFlashcardsBoard.name}</strong>
        </p>
        {activeFlashcardsBoard.visibility === `permanent` && (
          <>
            <p className="mt-1">
              Description:{` `}
              <strong className="break-words">
                {activeFlashcardsBoard.description}
              </strong>
            </p>
            <p className="mt-1">
              Tags:{` `}
              <strong className="break-words">
                {activeFlashcardsBoard.tags.join(`, `)}
              </strong>
            </p>
          </>
        )}
        <p className="mt-1">
          Visibility:{` `}
          <strong
            className={c(
              `capitalize`,
              {
                'text-green-700 dark:text-green-600':
                  activeFlashcardsBoard.visibility === `public` ||
                  activeFlashcardsBoard.visibility === `permanent`,
              },
              {
                'text-gray-600 dark:text-gray-400':
                  activeFlashcardsBoard.visibility === `private`,
              },
            )}
          >
            {activeFlashcardsBoard.visibility}
          </strong>
        </p>
        <p className="mt-1">
          Created:{` `}
          <strong>
            {formatDistance(
              new Date().toISOString(),
              activeFlashcardsBoard.cdate,
            )}
            {` `}
            ago
          </strong>
        </p>
        <p className="mt-1">
          Edited:{` `}
          <strong>
            {formatDistance(
              new Date().toISOString(),
              activeFlashcardsBoard.mdate,
            )}
            {` `}
            ago
          </strong>
        </p>
        {(activeFlashcardsBoard.visibility === `public` ||
          activeFlashcardsBoard.visibility === `permanent`) && (
          <button
            className="underline underline-offset-2 text-blue-800 dark:text-blue-500 mt-1"
            title="Document preview"
            onClick={() =>
              navigate(
                `${meta.routes.docs.preview}?id=${activeFlashcardsBoard.id}`,
              )
            }
          >
            <strong>Preview</strong>
          </button>
        )}
        {activeFlashcardsBoard.visibility === `permanent` && (
          <button
            className="underline underline-offset-2 text-blue-800 dark:text-blue-500 ml-3"
            title="Document URL"
            onClick={() => navigate(activeFlashcardsBoard.path)}
          >
            <strong>URL</strong>
          </button>
        )}
        <Tabs className="mt-8">
          <Tabs.Item
            title="Make this document private"
            active={activeFlashcardsBoard.visibility === `private`}
            onClick={
              activeFlashcardsBoard.visibility === `private`
                ? undefined
                : () => {}
            }
            // privateConfirmation.open
            // disabled={activeFlashcardsBoard.is === `busy`}
          >
            Private
          </Tabs.Item>
          <Tabs.Item
            title="Make this document public"
            active={activeFlashcardsBoard.visibility === `public`}
            onClick={
              activeFlashcardsBoard.visibility === `public`
                ? undefined
                : () => {}
            }
            // publicConfirmation.open
            // disabled={docManagementStore.is === `busy`}
          >
            Public
          </Tabs.Item>
          <Tabs.Item
            title="Make this document permanent"
            active={activeFlashcardsBoard.visibility === `permanent`}
            onClick={
              activeFlashcardsBoard.visibility === `permanent`
                ? undefined
                : () => {}
            }
            // permanentConfirmation.open
            // disabled={docManagementStore.is === `busy`}
          >
            Permanent
          </Tabs.Item>
        </Tabs>
      </>
    </Modal>
  );
};

export { FlashcardsBoardDetailsModalContainer };
