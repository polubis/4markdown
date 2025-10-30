import React from "react";
import { Err } from "design-system/err";
import { BiError } from "react-icons/bi";
import { Button } from "design-system/button";
import { Modal2 } from "design-system/modal2";
import { Loader } from "design-system/loader";
import { useResourceCommentsStore } from "../store";
import { setAction } from "../store/actions";
import { deleteResourceCommentAct } from "../acts/delete-resource-comment.act";

const Content = () => {
  const busy = useResourceCommentsStore.use.busy();
  const operationError = useResourceCommentsStore.use.operationError();

  if (busy) {
    return <Loader size="xl" className="m-auto" />;
  }

  if (operationError) {
    return (
      <Err>
        <Err.Icon>
          <BiError size={80} />
        </Err.Icon>
        <Err.Title>Something went wrong!</Err.Title>
        <Err.Description>{operationError.message}</Err.Description>
        <Err.Action
          title="Retry delete comment"
          auto
          s={2}
          i={2}
          onClick={deleteResourceCommentAct}
        >
          Try Again
        </Err.Action>
      </Err>
    );
  }

  return <p>Are you sure you want to delete this comment?</p>;
};

const DeleteResourceCommentModalContainer = () => {
  const busy = useResourceCommentsStore.use.busy();

  return (
    <Modal2
      disabled={busy}
      onClose={() => setAction("deleteCommentData", null)}
    >
      <Modal2.Header title="Delete comment" closeButtonTitle="Cancel" />
      <Modal2.Body>
        <Content />
      </Modal2.Body>
      <Modal2.Footer className="flex gap-3">
        <Button
          auto
          className="flex-1"
          i={1}
          s={2}
          onClick={() => setAction("deleteCommentData", null)}
          title="Cancel delete comment"
          disabled={busy}
        >
          Cancel
        </Button>
        <Button
          auto
          className="flex-1"
          i={2}
          s={2}
          disabled={busy}
          title="Confirm delete comment"
          onClick={deleteResourceCommentAct}
        >
          Confirm
        </Button>
      </Modal2.Footer>
    </Modal2>
  );
};

const Wrapped = () => {
  const deleteCommentData = useResourceCommentsStore.use.deleteCommentData();
  return deleteCommentData ? <DeleteResourceCommentModalContainer /> : null;
};

export { Wrapped as DeleteResourceCommentModalContainer };
