import React from "react";
import { navigate } from "gatsby";
import { Button } from "design-system/button";
import { Field } from "design-system/field";
import { Input } from "design-system/input";
import { useForm } from "development-kit/use-form";
import type { ValidatorFn, ValidatorsSetup } from "development-kit/form";
import { useDocManagementStore } from "store/doc-management/doc-management.store";
import {
  changeContentAction,
  changeTitleAction,
} from "store/markdown-post-creator/actions";
import { useMarkdownPostCreatorState } from "store/markdown-post-creator";
import { createMarkdownPostAct } from "acts/create-markdown-post.act";
import { meta } from "../../../../meta";

type FormValues = {
  title: string;
};

const titleMinLength = 3;
const titleMaxLength = 100;

const titleValidator: ValidatorFn<string, string> = (value) => {
  const trimmed = value.trim();

  if (trimmed.length < titleMinLength) {
    return `Title must be at least ${titleMinLength} characters`;
  }

  if (trimmed.length > titleMaxLength) {
    return `Title must be fewer than ${titleMaxLength} characters`;
  }

  return null;
};

const validators: ValidatorsSetup<FormValues> = {
  title: [titleValidator],
};

const CreatePostFormContainer = () => {
  const docManagementStore = useDocManagementStore();
  const { title, content } = useMarkdownPostCreatorState();
  const [{ invalid, untouched, result }, { inject }] = useForm<FormValues>(
    { title },
    validators,
  );

  const disabled = docManagementStore.is === `busy`;

  const handleTitleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    inject(`title`).onChange(e);
    changeTitleAction(e.target.value);
  };

  const handleContentChange: React.ChangeEventHandler<HTMLTextAreaElement> = (
    e,
  ) => {
    changeContentAction(e.target.value);
  };

  const handleSubmit = async (): Promise<void> => {
    const result = await createMarkdownPostAct();

    if (result.is === `ok`) {
      void navigate(`${meta.routes.home}?id=${result.data.id}`);
    }
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      <Field
        label={<Field.Label label="Title" value={title} required />}
        hint={
          result.title ? (
            <Field.Error>{result.title}</Field.Error>
          ) : (
            <Field.Hint>
              {titleMinLength}–{titleMaxLength} characters
            </Field.Hint>
          )
        }
      >
        <Input
          autoFocus
          placeholder="Your post title..."
          value={title}
          onChange={handleTitleChange}
          name="title"
          disabled={disabled}
        />
      </Field>
      <Field className="flex-1 flex flex-col" label="Content (Markdown)">
        <textarea
          className="flex-1 resize-none w-full px-3 py-2 text-black dark:text-white placeholder:text-gray-600 dark:placeholder:text-gray-300 text-sm rounded-md bg-gray-300 dark:bg-slate-800 border-[2.5px] border-transparent focus:border-black focus:dark:border-white outline-none"
          placeholder="Write your post in markdown..."
          value={content}
          onChange={handleContentChange}
          disabled={disabled}
          spellCheck={false}
        />
      </Field>
      {docManagementStore.is === `fail` && (
        <p className="text-sm text-red-700 dark:text-red-300" role="alert">
          {docManagementStore.error.message}
        </p>
      )}
      <Button
        i={2}
        s={2}
        auto
        className="self-end"
        disabled={
          invalid || untouched || content.trim().length === 0 || disabled
        }
        onClick={handleSubmit}
        title="Create markdown post"
      >
        {disabled ? `Creating...` : `Create Post`}
      </Button>
    </div>
  );
};

export { CreatePostFormContainer };
