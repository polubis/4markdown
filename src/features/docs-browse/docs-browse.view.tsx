import React from 'react';
import { BackToCreatorLinkContainer } from 'containers/back-to-creator-link.container';
import {
  DocsBrowseProvider,
  useDocsBrowseCtx,
} from './providers/docs-browse.provider';
import { DocsBrowsePageContext } from 'models/pages-contexts';
import { DocsBrowseLinkContainer } from 'containers/docs-browse-link.container';
import { Link } from 'gatsby';
import { Badges } from 'design-system/badges';
import { Badge } from 'design-system/badge';
import { Button } from 'design-system/button';
import { AppNavigation } from 'components/app-navigation';
import { formatDistance } from 'date-fns';
import { AppFooterContainer } from 'containers/app-footer.container';
import { Avatar } from 'design-system/avatar';

interface DocsBrowseViewProps {
  context: DocsBrowsePageContext;
}

const DocsBrowseView = () => {
  const docsBrowse = useDocsBrowseCtx();

  return (
    <>
      <AppNavigation>
        <BackToCreatorLinkContainer />
        <DocsBrowseLinkContainer />
      </AppNavigation>
      <main className="max-w-2xl mx-auto my-6 p-4">
        <ul className="flex flex-col space-y-10">
          {docsBrowse.docs.map((doc) => (
            <li className="flex flex-col" key={doc.name}>
              <Badges className="mb-3">
                {doc.tags.map((tag) => (
                  <Badge key={tag}>{tag}</Badge>
                ))}
              </Badges>
              <h6 className="mb-2 text-2xl">{doc.name}</h6>
              <p className="break-words">{doc.description}</p>
              <div className="flex items-center mt-3 p-3">
                {doc.author?.displayName && doc.author?.bio && (
                  <Avatar
                    size="sm"
                    title={doc.author.displayName}
                    alt={`${doc.author.displayName} avatar`}
                    className="bg-gray-300 dark:bg-slate-800 shrink-0 mr-4"
                    char={
                      doc.author.displayName
                        ? doc.author.displayName.charAt(0)
                        : undefined
                    }
                    src={doc.author?.avatar?.sm.src}
                  />
                )}
                <div className="flex flex-col space-y-1">
                  <span className="text-sm capitalize">
                    Created{` `}
                    {formatDistance(new Date(), doc.cdate, {
                      addSuffix: true,
                    })}
                    {` `}
                    ago
                  </span>
                  <span className="text-sm capitalize">
                    Edited{` `}
                    {formatDistance(new Date(), doc.mdate, {
                      addSuffix: true,
                    })}
                    {` `}
                    ago
                  </span>
                </div>
              </div>
              <Link
                className="mt-5"
                to={doc.path}
                title={`Explore ${doc.name}`}
              >
                <Button i={2} s={2} auto>
                  Explore
                </Button>
              </Link>
            </li>
          ))}
        </ul>
      </main>
      <AppFooterContainer />
    </>
  );
};

const ConnectedDocsBrowseView = ({ context }: DocsBrowseViewProps) => (
  <DocsBrowseProvider context={context}>
    <DocsBrowseView />
  </DocsBrowseProvider>
);

export { ConnectedDocsBrowseView as DocsBrowseView };
