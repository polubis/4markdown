import { DOCUMENT_RATING_ICONS } from 'core/document-rating-config';
import { formatDistance } from 'date-fns';
import { Avatar } from 'design-system/avatar';
import { Link } from 'gatsby';
import type { RichEducationDocumentModel } from 'models/page-models';
import React from 'react';

type EducationDocumentsListProps = {
  documents: RichEducationDocumentModel[];
};

const now = new Date();

const EducationDocumentsList = ({ documents }: EducationDocumentsListProps) => {
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
                <i>
                  {document.author.displayName}
                  {` `}
                  {formatDistance(document.cdate, now, {
                    addSuffix: true,
                  })}
                </i>
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
          <p className="lg:max-w-[70%] mt-1 mb-3">{document.description}</p>
          <p className="mb-5 text-sm uppercase w-fit rounded-md bg-slate-200 dark:bg-slate-800 py-1 px-3 line-clamp-1">
            {document.tags.join(`, `)}
          </p>
          <div className="flex items-center space-x-2">
            {DOCUMENT_RATING_ICONS.map(([Icon, category]) => (
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
