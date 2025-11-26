import React from 'react';
import type { HeadFC } from 'gatsby';
import Meta from 'components/meta';
import { meta } from '../../meta';
import LogoThumbnail from 'images/logo-thumbnail.png';
import { HomeView } from 'features/home/home.view';

const HomePage = () => {
  return (
    <main>
      <HomeView />
    </main>
  );
};

export default HomePage;

export const Head: HeadFC = () => {
  return (
    <Meta
      appName={meta.appName}
      title={meta.title}
      description={meta.description}
      url={meta.siteUrl + meta.routes.home}
      lang={meta.lang}
      image={meta.siteUrl + LogoThumbnail}
    />
  );
};
