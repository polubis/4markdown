import { Button } from "design-system/button";
import { Field } from "design-system/field";
import { Modal2 } from "design-system/modal2";
import { Textarea } from "design-system/textarea";
import { ValidatorFn, ValidatorsSetup } from "development-kit/form";
import { useForm } from "development-kit/use-form";
import React from "react";
import { BiErrorAlt, BiInfoCircle } from "react-icons/bi";
import { useYourUserProfileState } from "store/your-user-profile";
import { emit } from "core/app-events";
import { Loader } from "design-system/loader";
import { Atoms } from "api-4markdown-contracts";
import { useMutation } from "core/use-mutation";
import { editMindmapNodeCommentAct } from "../acts/edit-mindmap-node-comment.act";
import { addMindmapNodeCommentAct } from "../acts/add-mindmap-node-comment.act";
import { useMindmapNodeCommentsContext } from "../providers/mindmap-node-comments.provider";

const limits = {
  content: {
    min: 10,
    max: 250,
  },
} as const;

const commentContentValidator: ValidatorFn<string, string> = (value) => {
  const trimmed = value.trim();
  if (trimmed.length < limits.content.min) {
    return `Comment must be at least ${limits.content.min} characters long`;
  }

  if (trimmed.length > limits.content.max) {
    return `Comment must be at most ${limits.content.max} characters long`;
  }

  return null;
};

type FormValues = {
  content: string;
};

const validators: ValidatorsSetup<FormValues> = {
  content: [commentContentValidator],
};

type MindmapNodeCommentFormContainerProps = {
  mode: "edit" | "add";
  content?: string;
  commentId?: Atoms["MindmapNodeCommentId"];
};

const MindmapNodeCommentFormContainer = ({
  mode,
  content,
  commentId,
}: MindmapNodeCommentFormContainerProps) => {
  const { commentForm } = useMindmapNodeCommentsContext();

  const yourUserProfile = useYourUserProfileState();

  const { mindmapId, mindmapNodeId, commentsQuery } =
    useMindmapNodeCommentsContext();

  const isEditMode = mode === "edit";

  const [{ invalid, values, result, untouched }, { inject }] =
    useForm<FormValues>(
      {
        content: content ?? "",
      },
      validators,
    );

  const confirmMutation = useMutation({
    handler: () => {
      if (mode === "edit") {
        if (!commentId) {
          throw new Error("Comment ID is required");
        }

        return editMindmapNodeCommentAct({
          mindmapId,
          nodeId: mindmapNodeId,
          commentId,
          content: values.content,
        });
      }

      return addMindmapNodeCommentAct({
        mindmapId,
        nodeId: mindmapNodeId,
        comment: values.content,
      });
    },
    onOk: (newData) => {
      if (mode === "edit") {
        commentsQuery.setData((currData) => ({
          hasMore: currData.hasMore,
          nextCursor: currData.nextCursor,
          comments: currData.comments.map((comment) =>
            comment.id === commentId ? newData : comment,
          ),
        }));
      } else {
        commentsQuery.setData((currData) => ({
          hasMore: currData.hasMore,
          nextCursor: currData.nextCursor,
          comments: [newData, ...currData.comments],
        }));
      }

      commentForm.off();
    },
  });

  const close = () => {
    commentForm.off();
  };

  const goToUserProfileForm = () => {
    close();
    emit({ type: "SHOW_USER_PROFILE_FORM" });
  };

  const busy = confirmMutation.is === "busy";

  return (
    <Modal2 onClose={close} disabled={busy}>
      <Modal2.Header
        title={isEditMode ? "Edit Comment" : "Add Comment"}
        closeButtonTitle={
          isEditMode ? "Close comment editing" : "Close comment adding"
        }
      />
      <Modal2.Body>
        {(yourUserProfile.is === "idle" || yourUserProfile.is === "busy") && (
          <Loader size="xl" className="m-auto" />
        )}
        {yourUserProfile.is === "ok" &&
          (yourUserProfile.user ? (
            <>
              <p className="mb-4">
                Please be aware that comments are <strong>public</strong> and{" "}
                <strong>can be seen by anyone</strong>. You can always delete
                your comment later.
              </p>
              <Field
                label={
                  values.content.length === 0
                    ? `Comment*`
                    : `Comment (${values.content.length}/${limits.content.max})*`
                }
                hint={
                  result.content ? (
                    <Field.Error>{result.content}</Field.Error>
                  ) : (
                    <Field.Hint>
                      {limits.content.min}-{limits.content.max} characters
                    </Field.Hint>
                  )
                }
              >
                <Textarea
                  placeholder="Write your comment here... Be polite and respectful"
                  onKeyDown={(event) => {
                    event.stopPropagation();
                  }}
                  {...inject(`content`)}
                />
              </Field>
              {confirmMutation.is === "fail" && (
                <p className="mt-4 flex gap-2 text-sm justify-center items-center bg-red-300 dark:bg-red-700 p-2 rounded-md">
                  <BiErrorAlt className="shrink-0" size={20} />
                  {confirmMutation.error.message}
                </p>
              )}
            </>
          ) : (
            <p className="flex gap-2 text-sm justify-center items-center border bg-zinc-200 dark:bg-gray-950 border-zinc-300 dark:border-zinc-800 p-2 rounded-md">
              <BiInfoCircle className="shrink-0" size={20} />
              Looks like you have not created your user profile yet. Please do
              so first to be able to add comments.
            </p>
          ))}
        {yourUserProfile.is === "fail" && (
          <p className="flex gap-2 text-sm justify-center items-center bg-red-300 dark:bg-red-700 p-2 rounded-md">
            <BiErrorAlt className="shrink-0" size={20} />
            {yourUserProfile.error.message}
          </p>
        )}
      </Modal2.Body>
      {yourUserProfile.is === "ok" && (
        <Modal2.Footer className="flex gap-3">
          <Button
            i={1}
            s={2}
            auto
            className="flex-1"
            title="Close comment form"
            disabled={busy}
            onClick={close}
          >
            Close
          </Button>
          {yourUserProfile.user ? (
            <Button
              className="flex-1"
              i={2}
              s={2}
              auto
              disabled={invalid || untouched || busy}
              title={
                isEditMode ? "Confirm comment edit" : "Confirm comment add"
              }
              onClick={() => confirmMutation.start()}
            >
              Confirm
            </Button>
          ) : (
            <Button
              className="flex-1"
              i={2}
              s={2}
              auto
              title="Create user profile first"
              onClick={goToUserProfileForm}
            >
              Create Profile
            </Button>
          )}
        </Modal2.Footer>
      )}
    </Modal2>
  );
};

export { MindmapNodeCommentFormContainer };
