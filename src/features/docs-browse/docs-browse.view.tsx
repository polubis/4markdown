import React from 'react';
import { AppNavContainer } from 'containers/app-nav.container';
import { BackToCreatorLinkContainer } from 'containers/back-to-creator-link.container';
import {
  DocsBrowseProvider,
  useDocsBrowseCtx,
} from './providers/docs-browse.provider';
import { DocsBrowsePageContext } from 'models/pages-contexts';
import { DocsBrowseLinkContainer } from 'containers/docs-browse-link.container';

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
      <main className="max-w-4xl mx-auto">
        <ul>
          {docsBrowse.docs.map((doc) => (
            <li
              className="flex flex-col bg-zinc-200 dark:bg-gray-950 border-2 rounded-lg p-5 border-zinc-300 dark:border-zinc-800"
              key={doc.name}
            >
              <h6 className="mb-2 text-2xl">{doc.name}</h6>
              <p>{doc.description}</p>
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
