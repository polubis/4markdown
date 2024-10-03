import React from 'react';
import { BackToCreatorLinkContainer } from 'containers/back-to-creator-link.container';
import { DocsBrowseLinkContainer } from 'containers/docs-browse-link.container';
import { Link } from 'gatsby';
import { Badges } from 'design-system/badges';
import { Badge } from 'design-system/badge';
import { AppNavigation } from 'components/app-navigation';
import { formatDistance } from 'date-fns';
import { AppFooterContainer } from 'containers/app-footer.container';
import { Avatar } from 'design-system/avatar';
import type { EducationZoneViewModel } from 'models/view-models';
import { DOCUMENT_RATING_ICONS } from 'core/document-rating-config';

interface EducationZoneViewProps {
  context: EducationZoneViewModel;
}

const EducationZoneView = ({ context }: EducationZoneViewProps) => {
  return (
    <>
      <AppNavigation>
        <BackToCreatorLinkContainer />
        <DocsBrowseLinkContainer />
      </AppNavigation>
      <main className="max-w-lg mx-auto my-6 p-4">
        <ul className="flex flex-col space-y-10">
          {context.docs.map((doc) => (
            <li className="flex flex-col" key={doc.name}>
              <Badges className="mb-3">
                {doc.tags.map((tag) => (
                  <Badge key={tag}>{tag}</Badge>
                ))}
              </Badges>
              <h6 className="mb-2 text-2xl">
                <Link
                  className="underline underline-offset-2 hover:text-blue-800 hover:dark:text-blue-500"
                  title={`Explore ${doc.name}`}
                  to={doc.path}
                >
                  {doc.name}
                </Link>
              </h6>
              <p className="break-words">{doc.description}</p>
              <p className="flex space-x-1 mt-2 text-sm capitalize italic">
                Created{` `}
                {formatDistance(new Date(), doc.cdate, {
                  addSuffix: true,
                })}
                {` `}
                ago / Edited{` `}
                {formatDistance(new Date(), doc.mdate, {
                  addSuffix: true,
                })}
                {` `}
                ago
              </p>
              <div className="flex items-center space-x-2 mt-5 mb-2">
                {doc.author && (
                  <Avatar
                    size="tn"
                    title={doc.author.displayName}
                    alt={`${doc.author.displayName} avatar`}
                    className="bg-gray-300 dark:bg-slate-800 mr-1.5"
                    char={doc.author.displayName.charAt(0)}
                    src={doc.author?.avatar?.src}
                  />
                )}
                {DOCUMENT_RATING_ICONS.map(([Icon, category]) => (
                  <div
                    className="flex text-black dark:text-white items-center"
                    key={category}
                  >
                    <Icon className="mr-1" size={20} />
                    <strong>{doc.rating[category]}</strong>
                  </div>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </main>
      <AppFooterContainer />
    </>
  );
};

export { EducationZoneView };
