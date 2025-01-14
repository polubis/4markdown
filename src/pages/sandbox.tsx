import React from 'react';
import type { HeadFC } from 'gatsby';
import LogoThumbnail from 'images/logo-thumbnail.png';
import Meta from 'components/meta';
import { meta } from '../../meta';
import { usePortal } from 'development-kit/use-portal';
import { useDocumentCreatorState } from 'store/document-creator';
import { Markdown } from 'components/markdown';
import { useCreatorLocalStorageSync } from 'core/use-creator-local-storage-sync';

const SandboxPage = () => {
  useCreatorLocalStorageSync();
  const { render } = usePortal();
  const { code } = useDocumentCreatorState();

  return (
    <>
      {render(
        <header className="px-4 fixed border-b border-zinc-300 dark:border-zinc-800 bg-zinc-100 dark:bg-gray-950 top-0 left-0 right-0 h-[72px] flex items-center">
          content
        </header>,
      )}
      {render(
        <div className="fixed top-[72px] left-0 right-[50%] bottom-0">
          <textarea
            className="resize-none w-full h-full bg-transparent focus:outline-none p-4"
            value={code}
          ></textarea>
        </div>,
      )}
      <main className="mt-[72px]">
        <Markdown className="ml-auto !max-w-[50%] p-4">{code}</Markdown>
      </main>
    </>
  );
};

export default SandboxPage;

export const Head: HeadFC = () => {
  return (
    <Meta
      appName={meta.appName}
      title="Sandbox page"
      description="Test here any component or feature to verify MVP or POC"
      url={meta.siteUrl + meta.routes.sandbox}
      lang={meta.lang}
      image={meta.siteUrl + LogoThumbnail}
      robots="noindex, nofollow"
    />
  );
};
