import React from 'react';
import { AppNavContainer } from 'containers/app-nav.container';
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

interface DocsBrowseViewProps {
  context: DocsBrowsePageContext;
}

const DocsBrowseView = () => {
  const docsBrowse = useDocsBrowseCtx();

  return (
    <>
      <AppNavContainer>
        <BackToCreatorLinkContainer />
        <DocsBrowseLinkContainer />
      </AppNavContainer>
      <main className="max-w-4xl mx-auto my-6 p-4">
        <ul className="flex flex-col space-y-10">
          {docsBrowse.docs.map((doc) => (
            <li className="flex flex-col" key={doc.name}>
              <Badges className="mb-4">
                {doc.tags.map((tag) => (
                  <Badge key={tag}>{tag}</Badge>
                ))}
              </Badges>
              <h6 className="mb-2 text-2xl">{doc.name}</h6>
              <p>{doc.description}</p>
              <Link
                className="mt-4"
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
    </>
  );
};

const ConnectedDocsBrowseView = ({ context }: DocsBrowseViewProps) => (
  <DocsBrowseProvider context={context}>
    <DocsBrowseView />
  </DocsBrowseProvider>
);

export { ConnectedDocsBrowseView as DocsBrowseView };
