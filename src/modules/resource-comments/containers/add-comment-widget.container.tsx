import React from "react";
import { addResourceCommentAct } from "../acts/add-resource-comment.act";
import { useMutation } from "core/use-mutation";
import { useResourceCommentsContext } from "../providers/resource-comments.provider";
import { ResourceCommentFormContainer } from "./resource-comment-form.container";
import { API4MarkdownDto } from "api-4markdown-contracts";

const AddCommentWidgetContainer = () => {
  const { addCommentWidget, commentsQuery, ...rest } =
    useResourceCommentsContext();
  const commentAddMutation = useMutation<API4MarkdownDto<"addResourceComment">>(
    {
      onOk: (data) => {
        addCommentWidget.off();
        commentsQuery.setState((prevState) => ({
          is: "ok",
          data: [data, ...(prevState.is === "ok" ? prevState.data : [])],
        }));
      },
    },
  );

  return (
    <ResourceCommentFormContainer
      error={
        commentAddMutation.is === "fail"
          ? commentAddMutation.error.message
          : null
      }
      onClose={addCommentWidget.off}
      onConfirm={(values) =>
        commentAddMutation.start(() =>
          addResourceCommentAct({
            ...rest,
            comment: values.content,
          }),
        )
      }
      disabled={commentAddMutation.is === `busy`}
    />
  );
};

export { AddCommentWidgetContainer };
