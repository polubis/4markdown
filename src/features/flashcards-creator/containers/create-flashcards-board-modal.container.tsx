import React, { type FormEventHandler } from 'react';
import { Button } from 'design-system/button';
import { BiPlusCircle, BiX } from 'react-icons/bi';
import { Input } from 'design-system/input';
import { Field } from 'design-system/field';
import { Hint } from 'design-system/hint';
import Modal from 'design-system/modal';
import { useForm } from 'development-kit/use-form';
import { Textarea } from 'design-system/textarea';
import ErrorModal from 'components/error-modal';
import { useFlashcardsCreatorStore } from 'store/flashcards-creator/flashcards-creator.store';

const CreateFlashcardsBoardModalContainer = () => {
  const { flashcardsBoardCreation, resetCreation, startCreation, createBoard } =
    useFlashcardsCreatorStore();
  const [{ invalid, values, untouched }, { inject }] = useForm<
    Parameters<typeof createBoard>[0]
  >({
    name: ``,
    description: ``,
  });

  const submitBoardCreation: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    createBoard(values);
  };

  if (flashcardsBoardCreation.is === `fail`) {
    return (
      <ErrorModal
        heading="Error During Creating Flashcards Board"
        message={flashcardsBoardCreation.error.message}
        footer={
          <>
            {flashcardsBoardCreation.error.symbol === `out-of-date` && (
              <Button
                type="button"
                i={2}
                s={2}
                auto
                title="Sync out of flashcards board"
                onClick={() => {}}
              >
                Sync
              </Button>
            )}
          </>
        }
        onClose={startCreation}
      />
    );
  }

  return (
    <Modal onEscape={resetCreation}>
      <form className="flex flex-col" onSubmit={submitBoardCreation}>
        <div className="flex items-center mb-4">
          <h6 className="text-xl mr-8">Create Flashcards Board</h6>
          <Button
            type="button"
            i={2}
            s={1}
            title="Close flashards board creation"
            className="ml-auto"
            disabled={flashcardsBoardCreation.is === `busy`}
            onClick={resetCreation}
          >
            <BiX />
          </Button>
        </div>
        <Field
          label="Name*"
          hint={
            <Hint
              trigger={
                <>
                  Flashcards board will be created in <strong>private</strong>
                  {` `}
                  mode. Visible only to you, but{` `}
                  <strong>not encrypted</strong> - avoid sensitive data
                </>
              }
            />
          }
        >
          <Input
            placeholder={`My Notes, Basics of Computer Science, ...etc`}
            {...inject(`name`)}
          />
        </Field>
        <Field label="Description" className="mt-3">
          <Textarea
            placeholder="Something that describes your board..."
            {...inject(`description`)}
          />
        </Field>
        <Button
          type="submit"
          i={2}
          s={2}
          className="mt-6"
          auto
          title="Confirm flashcards board creation"
          disabled={
            untouched || invalid || flashcardsBoardCreation.is === `busy`
          }
        >
          Create
          <BiPlusCircle />
        </Button>
      </form>
    </Modal>
  );
};

export { CreateFlashcardsBoardModalContainer };
