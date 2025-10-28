import React from "react";
import { useMutation } from "core/use-mutation";
import { useResourceCommentsContext } from "../providers/resource-comments.provider";
import { ResourceCommentFormContainer } from "./resource-comment-form.container";
import { API4MarkdownDto } from "api-4markdown-contracts";
import { editResourceCommentAct } from "../acts/edit-resource-comment.act";

const EditCommentWidgetContainer = () => {
  const { editCommentWidget, commentsQuery, ...rest } =
    useResourceCommentsContext();

  const editCommentMutation = useMutation<
    API4MarkdownDto<"editResourceComment">
  >({
    onOk: (data) => {
      editCommentWidget.off();
      commentsQuery.setState((prevState) => {
        if (prevState.is !== "ok" || editCommentWidget.is === "off") {
          return prevState;
        }

        return {
          is: "ok",
          data: prevState.data.map((comment) => ({
            ...comment,
            ...(comment.id === editCommentWidget.data.id ? { ...data } : {}),
          })),
        };
      });
    },
  });

  return (
    <ResourceCommentFormContainer
      data={editCommentWidget.is === "on" ? editCommentWidget.data : undefined}
      error={
        editCommentMutation.is === "fail"
          ? editCommentMutation.error.message
          : null
      }
      onClose={editCommentWidget.off}
      onConfirm={(values) =>
        editCommentMutation.start(() => {
          if (editCommentWidget.is === "off") {
            throw new Error("Edit comment widget is off. Try again later");
          }

          return editResourceCommentAct({
            ...rest,
            etag: editCommentWidget.data.etag,
            commentId: editCommentWidget.data.id,
            content: values.content,
          });
        })
      }
      disabled={editCommentMutation.is === `busy`}
    />
  );
};

export { EditCommentWidgetContainer };
