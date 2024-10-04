import React from 'react';
import { DocsBrowseLinkContainer } from 'containers/docs-browse-link.container';
import { AppNavigation } from 'components/app-navigation';
import { formatDistance } from 'date-fns';
import { AppFooterContainer } from 'containers/app-footer.container';
import { Avatar } from 'design-system/avatar';
import { CreationLinkContainer } from 'containers/creation-link.container';
import { useEducationZoneStore } from './store/education-zone.store';
import { selectReady } from './store/education-zone.selectors';
import { Link } from 'gatsby';
import { DOCUMENT_RATING_ICONS } from 'core/document-rating-config';

const EducationZoneView = () => {
  const { documents } = useEducationZoneStore(selectReady);
  const now = new Date();

  return (
    <>
      <AppNavigation>
        <CreationLinkContainer />
        <DocsBrowseLinkContainer />
      </AppNavigation>
      <main className="flex max-w-[1280px] mx-auto">
        <section className="w-full border-r-2 border-zinc-300 dark:border-zinc-800 py-6">
          <h1 className="text-3xl border-b-2 border-zinc-300 dark:border-zinc-800 pb-4">
            The Wall
          </h1>
          <ol className="flex flex-col mb-4 mt-4 space-y-6 mr-6">
            {documents.wall.map((document) => (
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
                        {formatDistance(document.mdate, now, {
                          addSuffix: true,
                        })}
                      </i>
                    </>
                  ) : (
                    <i>
                      Anonymous
                      {` `}
                      {formatDistance(document.mdate, now, {
                        addSuffix: true,
                      })}
                    </i>
                  )}
                </div>
                <h2 className="text-2xl hover:underline underline-offset-2">
                  <Link to={document.path} className="line-clamp-2">
                    {document.name}
                  </Link>
                </h2>
                <p className="w-[70%] mt-1 mb-3">{document.description}</p>
                <p className="mb-5 text-sm uppercase w-fit rounded-md bg-slate-200 dark:bg-slate-800 dark:text-white text-black py-1 px-3">
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
        </section>
        <section className="p-6 shrink-0">
          <h2 className="text-xl">Content Rank</h2>
          <ol className="flex flex-col mb-4 mt-3 space-y-4 w-[280px]">
            {documents.top.map((document) => (
              <li className="flex flex-col" key={document.id}>
                <div className="flex items-center space-x-1 mb-0.5">
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
                        {formatDistance(document.mdate, now, {
                          addSuffix: true,
                        })}
                      </i>
                    </>
                  ) : (
                    <i>
                      Anonymous
                      {` `}
                      {formatDistance(document.mdate, now, {
                        addSuffix: true,
                      })}
                    </i>
                  )}
                </div>
                <h3 className="text-lg hover:underline underline-offset-2 mb-2">
                  <Link to={document.path} className="line-clamp-2">
                    {document.name}
                  </Link>
                </h3>
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
          <Link to="/" className="hover:underline underline-offset-2">
            See Full Rank
          </Link>
        </section>
      </main>
      <AppFooterContainer />
    </>
  );
};

export { EducationZoneView };
