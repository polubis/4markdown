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

// const EducationZoneView = ({ context }: EducationZoneViewProps) => {
//   return (
//     <>
// <AppNavigation>
//   <CreationLinkContainer />
//   <DocsBrowseLinkContainer />
// </AppNavigation>
//       <main className="max-w-lg mx-auto my-6 p-4">
//         <ul className="flex flex-col space-y-10">
//           {context.docs.map((doc) => (
//             <li className="flex flex-col" key={doc.name}>
//               <Badges className="mb-3">
//                 {doc.tags.map((tag) => (
//                   <Badge key={tag}>{tag}</Badge>
//                 ))}
//               </Badges>
//               <h6 className="mb-2 text-2xl">
//                 <Link
//                   className="underline underline-offset-2 hover:text-blue-800 hover:dark:text-blue-500"
//                   title={`Explore ${doc.name}`}
//                   to={doc.path}
//                 >
//                   {doc.name}
//                 </Link>
//               </h6>
//               <p className="break-words">{doc.description}</p>
//               <p className="flex space-x-1 mt-2 text-sm capitalize italic">
//                 Created{` `}
// {formatDistance(new Date(), doc.cdate, {
//   addSuffix: true,
// })}
//                 {` `}
//                 ago / Edited{` `}
//                 {formatDistance(new Date(), doc.mdate, {
//                   addSuffix: true,
//                 })}
//                 {` `}
//                 ago
//               </p>
//               <div className="flex items-center space-x-2 mt-5 mb-2">
// {doc.author && (
//   <Avatar
//     size="tn"
//     title={doc.author.displayName}
//     alt={`${doc.author.displayName} avatar`}
//     className="bg-gray-300 dark:bg-slate-800 mr-1.5"
//     char={doc.author.displayName.charAt(0)}
//     src={doc.author?.avatar?.src}
//   />
// )}
// {DOCUMENT_RATING_ICONS.map(([Icon, category]) => (
//   <div
//     className="flex text-black dark:text-white items-center"
//     key={category}
//   >
//     <Icon className="mr-1" size={20} />
//     <strong>{doc.rating[category]}</strong>
//   </div>
// ))}
//               </div>
//             </li>
//           ))}
//         </ul>
//       </main>
//       <AppFooterContainer />
//     </>
//   );
// };

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
        <section className="w-full border-r-2 border-zinc-300 dark:border-zinc-800 py-8 px-12">
          <h1></h1>
        </section>
        <section className="p-8 shrink-0">
          <h2 className="text-xl">Content Rank</h2>
          <ol className="flex flex-col mb-4 mt-3 space-y-4 w-[280px]">
            {documents.top.map((document) => (
              <li className="flex flex-col space-y-1" key={document.id}>
                <div className="flex items-center space-x-1">
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
                <h3 className="text-lg hover:underline underline-offset-2">
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
