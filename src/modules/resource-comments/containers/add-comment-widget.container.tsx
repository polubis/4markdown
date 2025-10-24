import { Button } from "design-system/button";
import { Field } from "design-system/field";
import { Modal2 } from "design-system/modal2";
import { Textarea } from "design-system/textarea";
import { maxLength, minLength } from "development-kit/form";
import { useForm } from "development-kit/use-form";
import React from "react";
import { BiErrorAlt, BiInfoCircle } from "react-icons/bi";
import { addResourceCommentAct } from "../acts/add-resource-comment.act";
import { useYourUserProfileState } from "store/your-user-profile";
import { emit } from "core/app-events";
import { Loader } from "design-system/loader";
import { useMutation } from "core/use-mutation";
import { useResourceCommentsContext } from "../providers/resource-comments.provider";

const limits = {
  content: {
    min: 10,
    max: 250,
  },
} as const;

const AddCommentWidgetContainer = () => {
  const { addCommentWidget, resourceId, resourceType } =
    useResourceCommentsContext();
  const commentAddMutation = useMutation({
    handler: () => {
      return addResourceCommentAct({
        resourceId,
        resourceType,
        comment: values.content,
      });
    },
    onOk: () => {
      addCommentWidget.off();
    },
  });
  const yourUserProfile = useYourUserProfileState();

  const [{ invalid, values, result, untouched }, { inject }] = useForm<{
    content: string;
  }>(
    {
      content: "",
    },
    {
      content: [minLength(limits.content.min), maxLength(limits.content.max)],
    },
  );

  const goToUserProfileForm = () => {
    addCommentWidget.off();
    emit({ type: "SHOW_USER_PROFILE_FORM" });
  };

  return (
    <Modal2
      onClose={addCommentWidget.off}
      disabled={commentAddMutation.is === `busy`}
    >
      <Modal2.Header
        title="Add Comment"
        closeButtonTitle="Close comment adding"
      />
      <Modal2.Body>
        {(yourUserProfile.is === "idle" || yourUserProfile.is === "busy") && (
          <Loader size="xl" className="m-auto" />
        )}
        {yourUserProfile.is === `ok` &&
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
                    <Field.Error>
                      Comment should be between {limits.content.min} and{" "}
                      {limits.content.max} characters
                    </Field.Error>
                  ) : (
                    <Field.Hint>
                      {limits.content.min}-{limits.content.max} characters
                    </Field.Hint>
                  )
                }
              >
                <Textarea
                  placeholder="Write your comment here... Be polite and respectful"
                  {...inject(`content`)}
                />
              </Field>
              {commentAddMutation.is === "fail" && (
                <p className="mt-4 flex gap-2 text-sm justify-center items-center bg-red-300 dark:bg-red-700 p-2 rounded-md">
                  <BiErrorAlt className="shrink-0" size={20} />
                  {commentAddMutation.error.message}
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
        {yourUserProfile.is === `fail` && (
          <p className="flex gap-2 text-sm justify-center items-center bg-red-300 dark:bg-red-700 p-2 rounded-md">
            <BiErrorAlt className="shrink-0" size={20} />
            {yourUserProfile.error.message}
          </p>
        )}
      </Modal2.Body>
      {yourUserProfile.is === `ok` && (
        <Modal2.Footer>
          {yourUserProfile.user ? (
            <Button
              className="ml-auto"
              i={2}
              s={2}
              auto
              disabled={
                invalid || untouched || commentAddMutation.is === `busy`
              }
              title="Confirm comment add"
              onClick={() => commentAddMutation.start()}
            >
              Confirm
            </Button>
          ) : (
            <Button
              className="ml-auto"
              i={2}
              s={2}
              auto
              title="Create user profile"
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

export { AddCommentWidgetContainer };
