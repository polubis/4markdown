import React from 'react';
import { type HeadFC } from 'gatsby';
import CreatorView from 'features/creator/creator.view';
import Meta from 'components/meta';
import LogoThumbnail from 'images/logo-thumbnail.png';
import {
  createInitialCode,
  useCreatorStore,
} from 'store/creator/creator.store';
import { meta } from 'core/consts/meta';

const HomePage = () => {
  const synced = React.useRef(false);

  if (!synced.current) {
    const code = createInitialCode(meta);

    useCreatorStore.setState({
      is: `ready`,
      initialCode: code,
      code,
      changed: false,
    });

    synced.current = true;
  }

  return <CreatorView />;
};

export default HomePage;

export const Head: HeadFC = () => {
  return (
    <Meta
      appName={meta.appName}
      title={meta.title}
      description={meta.description}
      url={meta.siteUrl}
      keywords={`${meta.appName}, Editor, Github markdown editor online, ${meta.company}, Programming articles, Markdown preview, Online markdown editor`}
      lang={meta.lang}
      image={LogoThumbnail}
    />
  );
};
