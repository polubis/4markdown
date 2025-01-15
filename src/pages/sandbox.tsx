import React from 'react';
import type { HeadFC } from 'gatsby';
import LogoThumbnail from 'images/logo-thumbnail.png';
import Meta from 'components/meta';
import { meta } from '../../meta';
import { usePortal } from 'development-kit/use-portal';
import { useDocumentCreatorState } from 'store/document-creator';
import { Markdown } from 'components/markdown';
import { useCreatorLocalStorageSync } from 'core/use-creator-local-storage-sync';
import c from 'classnames';

const headerSectionClasses = `px-4 border-t md:border-b md:border-t-0 border-zinc-300 dark:border-zinc-800 flex items-center`;

const SandboxPage = () => {
  useCreatorLocalStorageSync();
  const { render } = usePortal();
  const { code } = useDocumentCreatorState();

  return (
    <>
      {render(
        <header className="flex flex-col-reverse md:flex-col fixed bg-zinc-100 dark:bg-gray-950 bottom-0 md:top-0 md:bottom-[unset] left-0 right-0">
          <div className={c(`h-[72px]`, headerSectionClasses)}>top</div>
          <div className={c(`h-[50px]`, headerSectionClasses)}>bottom</div>
        </header>,
      )}
      {render(
        <div className="flex fixed bottom-[122px] top-0 md:top-[122px] md:bottom-0 left-0 right-0 md:right-[50%] ">
          <header className="w-[64px] h-full flex justify-center border-zinc-300 dark:border-zinc-800 border-r py-4">
            xd
          </header>
          <textarea
            className="resize-none w-full h-full bg-transparent focus:outline-none p-4 md:text-base text-sm"
            value={code}
          ></textarea>
        </div>,
      )}
      {/* <main className="mt-[122px]">
        <Markdown className="ml-auto !max-w-[50%] p-4">{code}</Markdown>
      </main> */}
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
