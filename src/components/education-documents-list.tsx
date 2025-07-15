import { RATING_ICONS } from "core/rating-config";
import { formatDistance } from "date-fns";
import { Avatar } from "design-system/avatar";
import { Link } from "gatsby";
import type { RichEducationDocumentModel } from "models/page-models";
import React from "react";
import { meta } from "../../meta";
import { BiCheck } from "react-icons/bi";
import { ResourceId, ResourcesCompletionDto } from "api-4markdown-contracts";

type EducationDocumentsListProps = {
  documents: RichEducationDocumentModel[];
  completion: ResourcesCompletionDto["completion"];
};

const now = new Date();

const EducationDocumentsList = ({
  documents,
  completion,
}: EducationDocumentsListProps) => {
  return (
    <ol className="flex flex-col space-y-8">
      {documents.map((document) => (
        <li className="flex flex-col" key={document.id}>
          <div className="flex items-center space-x-1 mb-1">
            {document.author ? (
              <>
                <Avatar
                  size="tn"
                  alt="Author avatar"
                  className="bg-gray-300 dark:bg-slate-800 mr-1.5"
                  char={document.author.displayName.charAt(0)}
                  src={document.author?.avatar?.src}
                />
                <Link
                  className="text-black dark:text-white italic hover:underline underline-offset-4 w-fit"
                  to={
                    meta.routes.userProfile.preview +
                    `?profileId=${document.author.id}`
                  }
                >
                  {document.author.displayName}
                  {` `}
                  {formatDistance(document.cdate, now, {
                    addSuffix: true,
                  })}
                </Link>
              </>
            ) : (
              <i>
                Anonymous
                {` `}
                {formatDistance(document.cdate, now, {
                  addSuffix: true,
                })}
              </i>
            )}
          </div>
          <h2 className="text-2xl hover:underline underline-offset-2 w-fit">
            <Link to={document.path} className="line-clamp-2">
              {document.name}
            </Link>
          </h2>
          <p className="lg:max-w-[70%] mt-2 mb-3">{document.description}</p>
          <div className="mb-5 flex flex-wrap gap-2">
            {completion[document.id as ResourceId] && (
              <span className="flex items-center gap-1 text-sm font-medium uppercase w-fit rounded-md bg-slate-200 dark:bg-slate-800 py-1 px-2 line-clamp-1">
                <BiCheck className="shrink-0" size={20} />{" "}
                <span>Completed</span>
              </span>
            )}
            <span className="text-sm font-medium uppercase w-fit rounded-md bg-slate-200 dark:bg-slate-800 py-1 px-3 line-clamp-1">
              {document.tags.join(`, `)}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {RATING_ICONS.map(([Icon, category]) => (
              <div className="flex items-center" key={category}>
                <Icon className="mr-1" size={20} />
                <strong>{document.rating[category]}</strong>
              </div>
            ))}
          </div>
        </li>
      ))}
    </ol>
  );
};

export { EducationDocumentsList };
