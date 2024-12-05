import React from 'react';
import { type HeadFC } from 'gatsby';
import LogoThumbnail from 'images/logo-thumbnail.png';
import Meta from 'components/meta';
import { meta } from '../../meta';
import { M } from 'components/markdown';
import { creatorStoreSelectors } from 'store/creator/creator.store';
import { useCreatorLocalStorageSync } from 'core/use-creator-local-storage-sync';
import c from 'classnames';

const CreatorPreviewPage = () => {
  useCreatorLocalStorageSync();

  const creatorStore = creatorStoreSelectors.useState();

  return (
    <main className="max-w-2xl mx-auto">
      <section className={c(M.className, `p-4`)}>
        <M>{creatorStore.code}</M>
      </section>
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
      image={meta.siteUrl + LogoThumbnail}
      robots="noindex, nofollow"
    />
  );
};
