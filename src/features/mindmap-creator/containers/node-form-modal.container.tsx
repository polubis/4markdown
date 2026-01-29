import { Modal2 } from "design-system/modal2";
import type { ComponentType } from "react";
import React from "react";
import { useForm } from "development-kit/use-form";
import { maxLength, minLength, optional, url } from "development-kit/form";
import { Field } from "design-system/field";
import { Hint } from "design-system/hint";
import { Input } from "design-system/input";
import { Textarea } from "design-system/textarea";
import { Button } from "design-system/button";
import {
  BiDotsHorizontal,
  BiHistory,
  BiPlusCircle,
  BiSave,
} from "react-icons/bi";
import { type MindmapCreatorNode } from "store/mindmap-creator/models";
import {
  addNewEmbeddedNodeAction,
  addNewExternalNodeAction,
  closeNodeFormAction,
  updateEmbeddedNodeAction,
  updateExternalNodeAction,
} from "store/mindmap-creator/actions";
import { validationLimits } from "../core/validation";
import { useMindmapCreatorState } from "store/mindmap-creator";
import { openedNodeFormSelector } from "store/mindmap-creator/selectors";
import { openNodeContentInCreatorAct } from "acts/open-node-content-in-creator.act";
import { context, useSimpleFeature } from "@greenonsoftware/react-kit";
import { Atoms } from "api-4markdown-contracts";
import Popover from "design-system/popover";
import { ResourceActivityContainer } from "modules/resource-activity";

type StepType = MindmapCreatorNode["type"] | `none`;

const prepareBaseValues = (values: {
  name: string;
  description: string;
}): Pick<MindmapCreatorNode["data"], "name" | "description"> => {
  const name = values.name.trim();
  const description = values.description.trim();

  return {
    name,
    description: description.length === 0 ? null : description,
  };
};

const NodeHistoryControls = ({
  nodeId,
}: {
  nodeId: Atoms["MindmapNodeId"];
}) => {
  const historyModal = useSimpleFeature();
  const moreMenuModal = useSimpleFeature();

  return (
    <>
      <div className="relative">
        <Button title="More options" i={2} s={1} onClick={moreMenuModal.on}>
          <BiDotsHorizontal />
        </Button>
        {moreMenuModal.isOn && (
          <Popover
            className="!absolute flex gap-2 translate-y-2.5 right-0 w-fit"
            onBackdropClick={moreMenuModal.off}
          >
            <Button
              title="View change history"
              s={1}
              i={2}
              onClick={() => {
                moreMenuModal.off();
                historyModal.on();
              }}
            >
              <BiHistory />
            </Button>
          </Popover>
        )}
      </div>
      {historyModal.isOn && (
        <React.Suspense>
          <ResourceActivityContainer
            resourceId={nodeId}
            resourceType="mindmap-node"
            onClose={historyModal.off}
          />
        </React.Suspense>
      )}
    </>
  );
};

const [LocalProvider, useLocalContext] = context(() => {
  const { nodeForm } = useMindmapCreatorState();

  const [activeType, setActiveType] = React.useState<StepType>(() =>
    nodeForm.is === `edition` ? nodeForm.type : `none`,
  );

  return {
    activeType,
    setActiveType,
  };
});

const ExternalForm = () => {
  const { setActiveType } = useLocalContext();
  const nodeForm = useMindmapCreatorState((state) =>
    openedNodeFormSelector(state.nodeForm),
  );
  const activeMindmapId = useMindmapCreatorState(
    (state) => state.activeMindmapId,
  );

  const [initialValues] = React.useState(() =>
    nodeForm.is === `active`
      ? {
          name: ``,
          description: ``,
          url: ``,
        }
      : nodeForm.type === `external`
        ? {
            name: nodeForm.data.name,
            description: nodeForm.data.description ?? ``,
            url: nodeForm.data.url,
          }
        : {
            name: nodeForm.data.name,
            description: nodeForm.data.description ?? ``,
            url: ``,
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
    url: [url],
  });

  const confirmCreation = async () => {
    const { name, description } = prepareBaseValues(values);
    const url = values.url.trim() as Atoms["Url"];

    if (nodeForm.is === `edition`) {
      updateExternalNodeAction({
        type: `external`,
        id: nodeForm.id,
        data: {
          name,
          description,
          url,
          path: nodeForm.data.path,
        },
        position: nodeForm.position,
      });
      return;
    }

    addNewExternalNodeAction({
      name,
      description,
      url,
      path: `/unset/`,
    });
  };

  return (
    <>
      {nodeForm.is === `edition` ? (
        <Modal2.Header
          title={
            <>
              Editing <strong>{nodeForm.data.name}</strong> node
            </>
          }
          closeButtonTitle="Cancel node edition"
        >
          {activeMindmapId && (
            <NodeHistoryControls
              nodeId={nodeForm.id as Atoms["MindmapNodeId"]}
            />
          )}
        </Modal2.Header>
      ) : (
        <Modal2.Header
          title="External node data (2/2)"
          closeButtonTitle="Cancel node creation"
        />
      )}

      <Modal2.Body>
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
              placeholder={`My Notes, Basics of Computer Science, ...etc`}
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
              placeholder="My handy description for learning something valuable..."
              {...inject(`description`)}
            />
          </Field>
          <Field label="Link To Resource*">
            <Input
              placeholder={`https://cool-articles.com/article/`}
              {...inject(`url`)}
            />
          </Field>
        </div>
      </Modal2.Body>
      <Modal2.Footer className="flex gap-3">
        <Button
          i={1}
          className="flex-1"
          s={2}
          auto
          title="Back to node type selection"
          onClick={() => setActiveType(`none`)}
        >
          Back
        </Button>
        {nodeForm.is === `edition` ? (
          <Button
            className="flex-1"
            i={2}
            s={2}
            auto
            title="Confirm node update"
            disabled={untouched || invalid}
            onClick={confirmCreation}
          >
            Save
            <BiSave />
          </Button>
        ) : (
          <Button
            className="flex-1"
            i={2}
            s={2}
            auto
            title="Confirm node creation"
            disabled={untouched || invalid}
            onClick={confirmCreation}
          >
            Create
            <BiPlusCircle />
          </Button>
        )}
      </Modal2.Footer>
    </>
  );
};

const EmbeddedForm = () => {
  const { setActiveType } = useLocalContext();

  const nodeForm = useMindmapCreatorState((state) =>
    openedNodeFormSelector(state.nodeForm),
  );
  const activeMindmapId = useMindmapCreatorState(
    (state) => state.activeMindmapId,
  );

  const [initialValues] = React.useState(() =>
    nodeForm.is === `active`
      ? {
          name: ``,
          description: ``,
          content: ``,
        }
      : nodeForm.type === `embedded`
        ? {
            name: nodeForm.data.name,
            description: nodeForm.data.description ?? ``,
            content: nodeForm.data.content ?? ``,
          }
        : {
            name: nodeForm.data.name,
            description: nodeForm.data.description ?? ``,
            content: ``,
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

  const confirmCreation = async () => {
    const { name, description } = prepareBaseValues(values);
    const trimmedContent = values.content.trim();
    const content = trimmedContent.length === 0 ? null : trimmedContent;

    if (nodeForm.is === `edition`) {
      updateEmbeddedNodeAction({
        id: nodeForm.id,
        type: `embedded`,
        data: {
          name,
          description,
          content,
          path: nodeForm.data.path,
        },
        position: nodeForm.position,
      });

      return;
    }

    addNewEmbeddedNodeAction({
      name,
      description,
      content,
      path: `/unset/`,
    });
  };

  const openInDocumentCreator = (): void => {
    openNodeContentInCreatorAct(values.content);
  };

  return (
    <>
      {nodeForm.is === `edition` ? (
        <Modal2.Header
          title={
            <>
              Editing <strong>{nodeForm.data.name}</strong> node
            </>
          }
          closeButtonTitle="Cancel node edition"
        >
          {activeMindmapId && (
            <NodeHistoryControls
              nodeId={nodeForm.id as Atoms["MindmapNodeId"]}
            />
          )}
        </Modal2.Header>
      ) : (
        <Modal2.Header
          title="Embedded node data (2/2)"
          closeButtonTitle="Cancel node creation"
        />
      )}

      <Modal2.Body>
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
              placeholder={`My Notes, Basics of Computer Science, ...etc`}
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
              placeholder="My handy description for learning something valuable..."
              {...inject(`description`)}
            />
          </Field>
          <Field
            label="Content"
            hint={
              <Hint
                trigger={
                  <>
                    Paste <strong>Markdown syntax</strong> or edit in{` `}
                    <button
                      className="text-sm font-bold underline underline-offset-2 text-blue-800 dark:text-blue-500"
                      title="Open in markdown editor"
                      onClick={openInDocumentCreator}
                    >
                      Document Creator
                    </button>
                  </>
                }
              />
            }
          >
            <Textarea
              placeholder="The article, note or something you want to learn from..."
              {...inject(`content`)}
            />
          </Field>
        </div>
      </Modal2.Body>
      <Modal2.Footer className="flex gap-3">
        <Button
          i={1}
          className="flex-1"
          s={2}
          auto
          title="Back to node type selection"
          onClick={() => setActiveType(`none`)}
        >
          Back
        </Button>
        {nodeForm.is === `edition` ? (
          <Button
            className="flex-1"
            i={2}
            s={2}
            auto
            title="Confirm node update"
            disabled={untouched || invalid}
            onClick={confirmCreation}
          >
            Save
            <BiSave />
          </Button>
        ) : (
          <Button
            className="flex-1"
            i={2}
            s={2}
            auto
            title="Confirm node creation"
            disabled={untouched || invalid}
            onClick={confirmCreation}
          >
            Create
            <BiPlusCircle />
          </Button>
        )}
      </Modal2.Footer>
    </>
  );
};

const NoneStep = () => {
  const { setActiveType } = useLocalContext();

  return (
    <>
      <Modal2.Header
        title="Select Node Type (1/2)"
        closeButtonTitle="Cancel node creation"
      />
      <Modal2.Body>
        <section className="flex flex-col gap-3">
          <button
            className="flex flex-col cursor-pointer hover:bg-zinc-300 dark:hover:bg-gray-900 p-3 rounded-md bg-zinc-200 border dark:bg-gray-950 border-zinc-300 dark:border-zinc-800"
            onClick={() => setActiveType(`embedded`)}
          >
            <h6 className="capitalize text-left">Embedded Node</h6>
            <p className="mt-1 text-sm text-left">
              Add node and its content from scratch
            </p>
          </button>
          <button
            className="flex flex-col cursor-pointer hover:bg-zinc-300 dark:hover:bg-gray-900 p-3 rounded-md bg-zinc-200 border dark:bg-gray-950 border-zinc-300 dark:border-zinc-800"
            onClick={() => setActiveType(`external`)}
          >
            <h6 className="capitalize text-left">External Node</h6>
            <p className="mt-1 text-sm text-left">
              Link external resource as mindmap node
            </p>
          </button>
        </section>
      </Modal2.Body>
    </>
  );
};

const forms: Record<StepType, ComponentType> = {
  embedded: EmbeddedForm,
  external: ExternalForm,
  none: NoneStep,
};

const NodeFormModalContainer = () => {
  const { activeType } = useLocalContext();

  const Component = forms[activeType];

  return (
    <Modal2 onClose={closeNodeFormAction}>
      <Component />
    </Modal2>
  );
};

const ConnectedNewNodeModalContainer = () => (
  <LocalProvider>
    <NodeFormModalContainer />
  </LocalProvider>
);

export { ConnectedNewNodeModalContainer as NodeFormModalContainer };
