import React from 'react';
import { Link, type HeadFC } from 'gatsby';
import LogoThumbnail from 'images/logo-thumbnail.png';
import Meta from 'components/meta';
import { meta } from '../../meta';
import Markdown from 'components/markdown';
import { creatorStoreSelectors } from 'store/creator/creator.store';
import { useCreatorLocalStorageSync } from 'core/use-creator-local-storage-sync';

const CreatorPreviewPage = () => {
  useCreatorLocalStorageSync();

  const creatorStore = creatorStoreSelectors.useState();

  return (
    <main className="max-w-2xl mx-auto">
      {creatorStore.is === `idle` && (
        <section className="flex flex-col justify-center h-screen">
          <h1 className="text-2xl text-center">Preview Unavailable</h1>
          <p className="mt-2 text-center">
            Please go to{` `}
            <Link
              className="underline underline-offset-2 text-blue-800 dark:text-blue-500 mt-1 font-bold"
              to={meta.routes.home}
            >
              Creator
            </Link>
            {` `}and start writing some content first.
          </p>
        </section>
      )}
      {creatorStore.is === `ready` && (
        <div className="p-4">
          <Markdown>{creatorStore.code}</Markdown>
        </div>
      )}
    </main>
  );
};

export default CreatorPreviewPage;

export const Head: HeadFC = () => {
  return (
    <Meta
      appName={meta.appName}
      title={meta.title}
      description={meta.description}
      url={meta.siteUrl + meta.routes.creator.preview}
      lang={meta.lang}
      image={LogoThumbnail}
      robots="noindex, nofollow"
    />
  );
};
