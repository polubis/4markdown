import { Empty } from "design-system/empty";
import { BiCommentAdd } from "react-icons/bi";
import React from "react";

type EmptyDocumentCommentsProps = {
  disabled: boolean;
  onAddClick: () => void;
};

const EmptyDocumentComments = ({
  disabled,
  onAddClick,
}: EmptyDocumentCommentsProps) => {
  return (
    <Empty className="border border-zinc-300 dark:border-zinc-800 rounded-lg p-6">
      <Empty.Icon>
        <BiCommentAdd size={80} />
      </Empty.Icon>
      <Empty.Title>No comments yet</Empty.Title>
      <Empty.Description>
        Be the first to comment on this document.
      </Empty.Description>
      <Empty.Action
        title="Add comment"
        auto
        s={2}
        i={2}
        disabled={disabled}
        onClick={onAddClick}
      >
        Add Comment
      </Empty.Action>
    </Empty>
  );
};

export { EmptyDocumentComments };
