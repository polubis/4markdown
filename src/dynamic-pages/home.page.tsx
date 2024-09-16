import React from 'react';
import { type HeadFC } from 'gatsby';
import CreatorView from 'features/creator/creator.view';
import Meta from 'components/meta';
import LogoThumbnail from 'images/logo-thumbnail.png';
import { meta } from '../../meta';
import type { HomeViewModel } from 'models/view-models';
import { creatorStoreActions } from 'store/creator/creator.store';
import { superstructMindmapSchema } from 'store/mindmap-creator/schemas/superstruct';

interface HomePageProps {
  pageContext: HomeViewModel;
}

const HomePage = ({ pageContext: { initialCode } }: HomePageProps) => {
  creatorStoreActions.hydrate(initialCode);

  React.useEffect(() => {
    superstructMindmapSchema.validate({});
  }, []);

  return <CreatorView />;
};

export default HomePage;

export const Head: HeadFC = () => {
  return (
    <Meta
      appName={meta.appName}
      title={meta.title}
      description={meta.description}
      url={meta.siteUrl + meta.routes.home}
      keywords={`${meta.appName}, Editor, Github markdown editor online, ${meta.company}, Programming articles, Markdown preview, Online markdown editor`}
      lang={meta.lang}
      image={LogoThumbnail}
    />
  );
};
