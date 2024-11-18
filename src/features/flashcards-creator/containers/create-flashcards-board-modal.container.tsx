import React, { type FormEventHandler } from 'react';
import { Button } from 'design-system/button';
import { BiPlusCircle, BiX } from 'react-icons/bi';
import { Input } from 'design-system/input';
import { Field } from 'design-system/field';
import { Hint } from 'design-system/hint';
import Modal from 'design-system/modal';
import type {
  API4MarkdownDto,
  API4MarkdownPayload,
  PrivateFlashcardsBoardDto,
} from 'api-4markdown-contracts';
import { useForm } from 'development-kit/use-form';
import { Textarea } from 'design-system/textarea';
import type { Transaction } from 'development-kit/utility-types';
import { useFlashcardsCreatorStore } from 'store/flashcards-creator/flashcards-creator.store';
import { parseError } from 'development-kit/parse-error';
import { mock } from 'development-kit/mock';
import { PRIVATE_FLASHCARDS_BOARD } from '__mocks__/flashcard-boards.mocks';

type CreateFlashcardsBoardModalContainerProps = {
  onClose(): void;
  onSuccess(flashcardsBoard: PrivateFlashcardsBoardDto): void;
};

type CreateFlashcardsBoardFormValues = {
  name: API4MarkdownPayload<'createFlashcardsBoard'>['name'];
  description: NonNullable<
    API4MarkdownPayload<'createFlashcardsBoard'>['description']
  >;
};

const CreateFlashcardsBoardModalContainer = ({
  onClose,
  onSuccess,
}: CreateFlashcardsBoardModalContainerProps) => {
  const { flashcards } = useFlashcardsCreatorStore();

  const [operation, setOperation] = React.useState<Transaction>({
    is: `idle`,
  });

  const [{ invalid, values, untouched }, { inject }] =
    useForm<CreateFlashcardsBoardFormValues>({
      name: ``,
      description: ``,
    });

  const close = (): void => {
    if (operation.is === `busy`) return;

    onClose();
  };

  const submitBoardCreation: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    try {
      setOperation({ is: `busy` });
      const board = await mock()<API4MarkdownDto<'createFlashcardsBoard'>>(
        PRIVATE_FLASHCARDS_BOARD,
      )<API4MarkdownPayload<'createFlashcardsBoard'>>({
        ...values,
        flashcards,
      });

      setOperation({ is: `ok` });
      onSuccess(board);
    } catch (error: unknown) {
      setOperation({ is: `fail`, error: parseError(error) });
    }
  };

  return (
    <Modal onEscape={close}>
      <form className="flex flex-col" onSubmit={submitBoardCreation}>
        <div className="flex items-center mb-4">
          <h6 className="text-xl mr-8">Create Flashcards Board</h6>
          <Button
            type="button"
            i={2}
            s={1}
            title="Close flashards board creation"
            className="ml-auto"
            disabled={operation.is === `busy`}
            onClick={close}
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
          disabled={untouched || invalid || operation.is === `busy`}
        >
          Create
          <BiPlusCircle />
        </Button>
      </form>
    </Modal>
  );
};

export { CreateFlashcardsBoardModalContainer };
