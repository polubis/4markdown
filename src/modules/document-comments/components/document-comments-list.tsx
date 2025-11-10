import React from "react";
import { BiPencil, BiTrash } from "react-icons/bi";
import { Avatar } from "design-system/avatar";
import { formatDistance } from "date-fns";
import { Button } from "design-system/button";
import throttle from "lodash.throttle";
import { Atoms, DocumentCommentDto } from "api-4markdown-contracts";
import { c } from "design-system/c";
import { useFeature } from "@greenonsoftware/react-kit";
import { DocumentCommentDeleteModalContainer } from "../containers/document-comment-delete-modal.container";
import { rateDocumentCommentAct } from "../acts/rate-document-comment.act";
import { useDocumentCommentsContext } from "../providers/document-comments.provider";
import { RatePicker } from "components/rate-picker";

const rateCommentThrottled = throttle(rateDocumentCommentAct, 5000);

type DocumentCommentsListProps = {
  className?: string;
  comments: DocumentCommentDto[];
  userProfileId: Atoms["UserProfileId"] | null;
  onEditStart(comment: DocumentCommentDto): void;
};

const DocumentCommentsList = ({
  className,
  comments,
  userProfileId,
  onEditStart,
}: DocumentCommentsListProps) => {
  const [ratedComments, setRatedComments] = React.useState<
    Record<Atoms["DocumentCommentId"], Atoms["RatingCategory"]>
  >({});

  const { documentId } = useDocumentCommentsContext();
  const deleteModal = useFeature<Atoms["DocumentCommentId"]>();

  const rateComment = (
    category: Atoms["RatingCategory"],
    commentId: Atoms["DocumentCommentId"],
  ) => {
    setRatedComments((prev) => ({ ...prev, [commentId]: category }));
    rateCommentThrottled({
      commentId,
      resourceId: documentId,
      category,
    });
  };

  return (
    <>
      <ul className={c("flex flex-wrap gap-4", className)}>
        {comments.map((comment) => (
          <li
            key={comment.id}
            className="relative flex-1 p-3 flex flex-col rounded-lg border border-zinc-300 dark:border-zinc-800"
          >
            <div className="flex items-center gap-4">
              <Avatar
                size="sm"
                src={comment.ownerProfile.avatar?.sm?.src}
                alt={comment.ownerProfile.displayName ?? `Comment author`}
                char={comment.ownerProfile.displayName?.charAt(0)}
                className="shrink-0 bg-gray-300 dark:bg-slate-800"
              />
              <div className="flex flex-col pr-10">
                <h3 className="text-base font-bold leading-6 mb-1">
                  {comment.ownerProfile.displayName ?? `Anonymous`}
                </h3>
                <p className="text-sm">
                  {formatDistance(new Date(), comment.mdate, {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
            <p className="italic mt-4">{comment.content}</p>
            <RatePicker
              className="[&_svg]:size-4 ml-auto mt-4"
              rating={{
                ...comment,
                [ratedComments[comment.id]]:
                  comment[ratedComments[comment.id]] + 1,
              }}
              rate={ratedComments[comment.id]}
              onRate={(category) => rateComment(category, comment.id)}
            />
            {comment.ownerProfile.id === userProfileId && (
              <div className="flex flex-col gap-1 absolute top-2.5 right-2">
                <Button
                  i={1}
                  s={1}
                  title="Delete comment"
                  onClick={() => deleteModal.on(comment.id)}
                >
                  <BiTrash />
                </Button>
                <Button
                  i={1}
                  s={1}
                  title="Edit comment"
                  onClick={() => onEditStart(comment)}
                >
                  <BiPencil />
                </Button>
              </div>
            )}
          </li>
        ))}
      </ul>
      {deleteModal.is === "on" && (
        <DocumentCommentDeleteModalContainer
          commentId={deleteModal.data}
          onClose={() => deleteModal.off()}
        />
      )}
    </>
  );
};

export { DocumentCommentsList };
