import React from "react";
import { Atoms, DocumentCommentDto } from "api-4markdown-contracts";
import { Avatar } from "design-system/avatar";
import { c } from "design-system/c";
import { formatDistance } from "date-fns";

const comments: DocumentCommentDto[] = [
  {
    ugly: 1,
    bad: 2,
    decent: 5,
    good: 12,
    perfect: 8,

    id: "comment_01234567890abcdef" as Atoms["DocumentCommentId"],
    etag: "etag_abc123def456" as Atoms["Etag"],
    resourceId: "doc_987654321fedcba" as Atoms["DocumentId"],
    content:
      "This is such a helpful document! The examples really clarified the concepts for me. Thanks for sharing these insights.",
    cdate: "2024-11-04T08:30:00.000Z" as Atoms["UTCDate"],
    mdate: "2024-11-04T08:30:00.000Z" as Atoms["UTCDate"],

    ownerProfile: {
      id: "user_sarah_chen_001" as Atoms["UserProfileId"],
      cdate: "2024-01-15T10:00:00.000Z" as Atoms["UTCDate"],
      mdate: "2024-10-28T14:22:00.000Z" as Atoms["UTCDate"],
      displayName: "Sarah Chen",
      displayNameSlug: "sarah-chen" as Atoms["Slug"],
      bio: "Frontend developer passionate about clean code and user experience",
      avatar: null,
      githubUrl: "https://github.com/sarahchen" as Atoms["Url"],
      linkedInUrl: "https://linkedin.com/in/sarahchen" as Atoms["Url"],
      twitterUrl: null,
      fbUrl: null,
      blogUrl: "https://sarahchen.dev" as Atoms["Url"],
    },
  },

  {
    ugly: 0,
    bad: 1,
    decent: 3,
    good: 7,
    perfect: 4,

    id: "comment_fedcba0987654321" as Atoms["DocumentCommentId"],
    etag: "etag_xyz789ghi012" as Atoms["Etag"],
    resourceId: "doc_987654321fedcba" as Atoms["DocumentId"],
    content:
      "Could you elaborate on the third section? I'd love to understand this concept better. Maybe add a few more examples?",
    cdate: "2024-11-03T15:45:00.000Z" as Atoms["UTCDate"],
    mdate: "2024-11-03T16:12:00.000Z" as Atoms["UTCDate"],

    ownerProfile: {
      id: "user_alex_rodriguez_002" as Atoms["UserProfileId"],
      cdate: "2024-03-20T09:15:00.000Z" as Atoms["UTCDate"],
      mdate: "2024-11-01T11:30:00.000Z" as Atoms["UTCDate"],
      displayName: "Alex Rodriguez",
      displayNameSlug: "alex-rodriguez" as Atoms["Slug"],
      bio: "Full-stack engineer | React & Node.js enthusiast",
      avatar: null,
      githubUrl: "https://github.com/alexrod" as Atoms["Url"],
      linkedInUrl: null,
      twitterUrl: "https://twitter.com/alexrod_dev" as Atoms["Url"],
      fbUrl: null,
      blogUrl: null,
    },
  },

  {
    ugly: 0,
    bad: 0,
    decent: 2,
    good: 15,
    perfect: 18,

    id: "comment_1122334455667788" as Atoms["DocumentCommentId"],
    etag: "etag_mno345pqr678" as Atoms["Etag"],
    resourceId: "doc_987654321fedcba" as Atoms["DocumentId"],
    content:
      "Excellent work! This really helped me with my project. The step-by-step approach and clear explanations are perfect. Bookmarked for future reference!",
    cdate: "2024-11-02T20:18:00.000Z" as Atoms["UTCDate"],
    mdate: "2024-11-02T20:18:00.000Z" as Atoms["UTCDate"],

    ownerProfile: {
      id: "user_jamie_park_003" as Atoms["UserProfileId"],
      cdate: "2024-02-10T13:45:00.000Z" as Atoms["UTCDate"],
      mdate: "2024-10-30T09:22:00.000Z" as Atoms["UTCDate"],
      displayName: "Jamie Park",
      displayNameSlug: "jamie-park" as Atoms["Slug"],
      bio: "Software architect | Mentoring junior developers | Coffee addict ☕",
      avatar: null,
      githubUrl: "https://github.com/jamiepark" as Atoms["Url"],
      linkedInUrl: "https://linkedin.com/in/jamiepark" as Atoms["Url"],
      twitterUrl: null,
      fbUrl: null,
      blogUrl: "https://jamiepark.tech" as Atoms["Url"],
    },
  },
];

type DocumentCommentsListLoaderProps = {
  className?: string;
};

const DocumentCommentsListLoader = ({
  className,
}: DocumentCommentsListLoaderProps) => {
  return (
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
        </li>
      ))}
    </ul>
  );
};

export { DocumentCommentsListLoader };
