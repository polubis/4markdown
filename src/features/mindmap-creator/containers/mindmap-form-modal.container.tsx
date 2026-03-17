import { Button } from "design-system/button";
import { Field } from "design-system/field";
import { Hint } from "design-system/hint";
import { Input } from "design-system/input";
import { Textarea } from "design-system/textarea";
import { maxLength, minLength, optional } from "development-kit/form";
import { useForm } from "development-kit/use-form";
import React from "react";
import { BiPlusCircle } from "react-icons/bi";
import { Modal2 } from "design-system/modal2";
import {
  backToMindmapDetailsAction,
  closeMindmapFormAction,
} from "store/mindmap-creator/actions";
import { createMindmapAct } from "acts/create-mindmap.act";
import { createEmptyMindmapAct } from "acts/create-empty-mindmap.act";
import { validationLimits } from "../core/validation";
import { useMindmapCreatorState } from "store/mindmap-creator";
import { openedMindmapFormSelector } from "store/mindmap-creator/selectors";
import { updateMindmapAct } from "acts/update-mindmap.act";

const MindmapFormModalContainer = () => {
  const { operation } = useMindmapCreatorState();
  const mindmapForm = useMindmapCreatorState((state) =>
    openedMindmapFormSelector(state.mindmapForm),
  );

  const [creationMode, setCreationMode] = React.useState<`none` | `manual`>(
    `none`,
  );
  const [isFromScratchBusy, setIsFromScratchBusy] = React.useState(false);

  const [initialValues] = React.useState(() =>
    mindmapForm.is === `active`
      ? {
          name: ``,
          description: ``,
          tags: ``,
        }
      : {
          name: mindmapForm.name,
          description: mindmapForm.description ?? ``,
          tags: Array.isArray(mindmapForm.tags)
            ? mindmapForm.tags.join(`,`)
            : ``,
        },
  );

  const [{ values, untouched, invalid }, { inject }] = useForm(initialValues, {
    name: [
      minLength(validationLimits.name.min),
      maxLength(validationLimits.name.max),
    ],
    description: [
      optional(
        minLength(validationLimits.description.min),
        maxLength(validationLimits.description.max),
      ),
    ],
  });

  const confirmCreation = () => {
    const name = values.name.trim();
    const description = values.description.trim();
    const tags = values.tags.trim();
    const splittedTags = tags.length === 0 ? [] : tags.split(`,`);

    const payload = {
      name,
      description: description.length === 0 ? null : description,
      tags: splittedTags.length === 0 ? null : splittedTags,
    };

    if (mindmapForm.is === `active`) {
      createMindmapAct(payload);

      return;
    }

    updateMindmapAct(payload);
  };

  const splittedTags = React.useMemo(
    () =>
      values.tags
        .split(`,`)
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0).length,
    [values.tags],
  );

  return (
    <Modal2
      disabled={operation.is === `busy` || isFromScratchBusy}
      onClose={closeMindmapFormAction}
    >
      {mindmapForm.is === `edition` ? (
        <Modal2.Header
          title={
            <>
              Edit <strong>{mindmapForm.name}</strong> Mindmap
            </>
          }
          closeButtonTitle="Cancel mindmap edition"
        />
      ) : (
        <Modal2.Header
          title="Create Mindmap"
          closeButtonTitle="Cancel mindmap creation"
        />
      )}

      <Modal2.Body>
        {mindmapForm.is === `active` && creationMode === `none` && (
          <section className="flex flex-col gap-3">
            <button
              className="flex flex-col cursor-pointer hover:bg-zinc-300 dark:hover:bg-gray-900 p-3 rounded-md bg-zinc-200 border dark:bg-gray-950 border-zinc-300 dark:border-zinc-800"
              onClick={async () => {
                setIsFromScratchBusy(true);
                try {
                  await createEmptyMindmapAct();
                } finally {
                  setIsFromScratchBusy(false);
                }
              }}
              title="Create a completely empty mindmap on the server"
            >
              <h6 className="capitalize text-left">From Scratch</h6>
              <p className="mt-1 text-sm text-left">
                Create a new mindmap with empty content named
                {` `}
                <code>new-today-date</code>. You can edit its structure later in
                the mindmap editor.
              </p>
            </button>
            <button
              className="flex flex-col cursor-pointer hover:bg-zinc-300 dark:hover:bg-gray-900 p-3 rounded-md bg-zinc-200 border dark:bg-gray-950 border-zinc-300 dark:border-zinc-800"
              onClick={() => setCreationMode(`manual`)}
              title="Create mindmap using the current editor content"
            >
              <h6 className="capitalize text-left">Setup Things Manually</h6>
              <p className="mt-1 text-sm text-left">
                Create mindmap based on the current content in the editor and
                attach custom name, description and tags.
              </p>
            </button>
          </section>
        )}

        {mindmapForm.is === `active` && creationMode === `manual` && (
          <p className="text-sm mb-4">
            Mindmap will be created in <strong>private mode</strong>, based on
            your current editor content. Visible only to you, but data inside is
            {` `}
            <strong>not encrypted</strong>—avoid sensitive data.
          </p>
        )}

        {mindmapForm.is === `edition` && (
          <p className="text-sm mb-4">
            Update metadata of your existing mindmap. Structure and content stay
            unchanged.
          </p>
        )}

        {(mindmapForm.is === `edition` ||
          (mindmapForm.is === `active` && creationMode === `manual`)) && (
          <div className="flex flex-col gap-3">
            <Field
              label="Name*"
              hint={
                <Hint
                  trigger={
                    <>
                      {validationLimits.name.min} - {validationLimits.name.max}
                      {` `}
                      characters
                    </>
                  }
                />
              }
            >
              <Input
                placeholder={`My Mindmap, Basics of Computer Science, ...etc`}
                {...inject(`name`)}
              />
            </Field>
            <Field
              label="Description"
              hint={
                <Hint
                  trigger={
                    <>
                      {validationLimits.description.min} -{` `}
                      {validationLimits.description.max}
                      {` `}
                      characters
                    </>
                  }
                />
              }
            >
              <Textarea
                placeholder="My private or public roadmap for learning something important to me..."
                {...inject(`description`)}
              />
            </Field>
            <Field
              label={splittedTags === 0 ? `Tags` : `Tags (${splittedTags})`}
              hint={
                <Hint trigger={`Comma-separated, 1-10 tags, each unique`} />
              }
            >
              <Input
                placeholder="React, ruby-on-rails, c++, c# ...etc"
                {...inject(`tags`)}
              />
            </Field>
          </div>
        )}
      </Modal2.Body>
      {mindmapForm.is === `edition` && (
        <Modal2.Footer className="flex gap-3">
          <Button
            i={1}
            s={2}
            className="flex-1"
            auto
            title="Back to mindmap details"
            disabled={operation.is === `busy`}
            onClick={backToMindmapDetailsAction}
          >
            Cancel
          </Button>
          <Button
            i={2}
            s={2}
            className="flex-1"
            auto
            title="Confirm mindmap update"
            disabled={operation.is === `busy` || untouched || invalid}
            onClick={confirmCreation}
          >
            Submit
          </Button>
        </Modal2.Footer>
      )}
      {mindmapForm.is === `active` && creationMode === `manual` && (
        <Modal2.Footer className="flex gap-3">
          <Button
            i={1}
            s={2}
            className="flex-1"
            auto
            title="Back to creation options"
            disabled={operation.is === `busy`}
            onClick={() => setCreationMode(`none`)}
          >
            Back
          </Button>
          <Button
            i={2}
            s={2}
            auto
            className="flex-1"
            title="Confirm mindmap creation"
            disabled={operation.is === `busy` || untouched || invalid}
            onClick={confirmCreation}
          >
            Create
            <BiPlusCircle />
          </Button>
        </Modal2.Footer>
      )}
    </Modal2>
  );
};

export { MindmapFormModalContainer };
