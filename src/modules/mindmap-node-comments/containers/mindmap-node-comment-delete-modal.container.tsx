import React from "react";
import { Err } from "design-system/err";
import { BiError } from "react-icons/bi";
import { Button } from "design-system/button";
import { Modal2 } from "design-system/modal2";
import { Loader } from "design-system/loader";
import { deleteMindmapNodeCommentAct } from "../acts/delete-mindmap-node-comment.act";
import { useMindmapNodeCommentsContext } from "../providers/mindmap-node-comments.provider";
import { Atoms } from "api-4markdown-contracts";
import { useMutation2 } from "core/use-mutation-2";

type MindmapNodeCommentDeleteModalContainerProps = {
  commentId: Atoms["MindmapNodeCommentId"];
  onClose: () => void;
};

const MindmapNodeCommentDeleteModalContainer = ({
  commentId,
  onClose,
}: MindmapNodeCommentDeleteModalContainerProps) => {
  const { mindmapNodeId, commentsQuery, onCountChange } =
    useMindmapNodeCommentsContext();

  const deleteMutation = useMutation2({
    handler: () =>
      deleteMindmapNodeCommentAct({
        commentId,
        resourceId: mindmapNodeId,
      }),
    onOk: () => {
      commentsQuery.setData((currData) => ({
        ...currData,
        comments: currData.comments.filter(
          (comment) => comment.id !== commentId,
        ),
      }));
      if (commentsQuery.data) {
        onCountChange(commentsQuery.data.comments.length - 1);
      }
      onClose();
    },
  });

  return (
    <Modal2 disabled={deleteMutation.busy} onClose={onClose}>
      <Modal2.Header title="Delete comment" closeButtonTitle="Cancel" />
      <Modal2.Body>
        {deleteMutation.idle && (
          <p>Are you sure you want to delete this comment?</p>
        )}
        {deleteMutation.busy && <Loader size="xl" className="m-auto" />}
        {deleteMutation.error && (
          <Err>
            <Err.Icon>
              <BiError size={80} />
            </Err.Icon>
            <Err.Title>Something went wrong!</Err.Title>
            <Err.Description>{deleteMutation.error.message}</Err.Description>
            <Err.Action
              title="Retry delete comment"
              auto
              s={2}
              i={2}
              onClick={() => deleteMutation.start()}
            >
              Try Again
            </Err.Action>
          </Err>
        )}
      </Modal2.Body>
      <Modal2.Footer className="flex gap-3">
        <Button
          auto
          className="flex-1"
          i={1}
          s={2}
          onClick={onClose}
          title="Cancel delete comment"
          disabled={deleteMutation.busy}
        >
          Cancel
        </Button>
        <Button
          auto
          className="flex-1"
          i={2}
          s={2}
          disabled={deleteMutation.busy}
          title="Confirm delete comment"
          onClick={() => deleteMutation.start()}
        >
          Confirm
        </Button>
      </Modal2.Footer>
    </Modal2>
  );
};

export { MindmapNodeCommentDeleteModalContainer };
