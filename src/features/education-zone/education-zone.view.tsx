import React from 'react';
import { DocsBrowseLinkContainer } from 'containers/docs-browse-link.container';
import { AppNavigation } from 'components/app-navigation';
import { formatDistance } from 'date-fns';
import { AppFooterContainer } from 'containers/app-footer.container';
import { Avatar } from 'design-system/avatar';
import { CreationLinkContainer } from 'containers/creation-link.container';
import { Link } from 'gatsby';
import { DOCUMENT_RATING_ICONS } from 'core/document-rating-config';
import { meta } from '../../../meta';
import { BiArrowToLeft, BiArrowToRight } from 'react-icons/bi';
import { useEducationZoneContext } from './context/education-zone.context';
import { paginate } from 'development-kit/paginate';
import { EducationLayout } from 'components/education-layout';

const now = new Date();

const Pagination = () => {
  const [{ page, pagesCount }] = useEducationZoneContext();

  const firstPage = 1;
  const lastPage = pagesCount;
  const filteredPages = React.useMemo(
    () =>
      paginate({
        pagesCount,
        limit: 5,
        currentPage: page,
      }),
    [page, pagesCount],
  );

  if (filteredPages.length <= 1) return null;

  return (
    <div className="flex space-x-2 mt-6 justify-end">
      {page !== firstPage && (
        <Link
          key="first"
          className="flex font-bold items-center justify-center w-8 h-8 rounded-md text-[18px] focus:outline dark:outline-2 outline-2.5 outline-black dark:outline-white"
          title="Go to first page"
          to={meta.routes.docs.educationZone}
        >
          <BiArrowToLeft size={20} />
        </Link>
      )}
      {filteredPages.map((page) => (
        <Link
          activeClassName="bg-gray-400/20 dark:bg-slate-800/50"
          className="flex font-bold items-center justify-center w-8 h-8 rounded-md text-[18px] focus:outline dark:outline-2 outline-2.5 outline-black dark:outline-white"
          title={`Go to ${page} page`}
          to={`${meta.routes.docs.educationZone}${page === firstPage ? `` : page}`}
          key={page}
        >
          {page}
        </Link>
      ))}
      {page !== lastPage && (
        <Link
          className="flex font-bold items-center justify-center w-8 h-8 rounded-md text-[18px] focus:outline dark:outline-2 outline-2.5 outline-black dark:outline-white"
          title="Go to last page"
          to={`${meta.routes.docs.educationZone}${lastPage}`}
          key="last"
        >
          <BiArrowToRight size={20} />
        </Link>
      )}
    </div>
  );
};

const DocumentsWall = () => {
  const [{ documents }] = useEducationZoneContext();

  return (
    <ol className="flex flex-col space-y-8">
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

const ContentRank = () => {
  const [{ documents }] = useEducationZoneContext();

  return (
    <>
      <h2 className="text-xl">Content Rank</h2>
      <ol className="flex flex-col mb-4 mt-3 space-y-4 w-[280px]">
        {documents.partialTop.map((document) => (
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
            <h3 className="text-lg hover:underline underline-offset-2 mb-2 w-fit">
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
      <Link
        to={meta.routes.education.rank}
        className="hover:underline underline-offset-2"
      >
        See Full Rank
      </Link>
    </>
  );
};

const EducationZoneView = () => {
  const [{ page, pagesCount }] = useEducationZoneContext();

  return (
    <>
      <AppNavigation>
        <CreationLinkContainer />
        <DocsBrowseLinkContainer />
      </AppNavigation>
      <EducationLayout
        title="The Wall"
        subTitle={`Page ${page} from ${pagesCount}`}
      >
        <>
          <DocumentsWall />
          <Pagination />
        </>
        <>
          <ContentRank />
        </>
      </EducationLayout>
      <AppFooterContainer />
    </>
  );
};

export { EducationZoneView };
