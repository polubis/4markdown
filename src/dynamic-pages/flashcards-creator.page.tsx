import React from 'react';
import type { HeadFC } from 'gatsby';
import Meta from 'components/meta';
import LogoThumbnail from 'images/logo-thumbnail.png';
import { meta } from '../../meta';
import type { FlashcardsCreatorPageModel } from 'models/page-models';
import { FlashcardsCreatorView } from 'features/flashcards-creator/flashcards-creator.view';

type FlashcardsCreatorPageProps = {
  pageContext: FlashcardsCreatorPageModel;
};

const FlashcardsCreatorPage = (_: FlashcardsCreatorPageProps) => {
  return <FlashcardsCreatorView />;
};

export default FlashcardsCreatorPage;

export const Head: HeadFC = () => {
  return (
    <Meta
      appName={meta.appName}
      title="Flashcards Creator - Craft Interactive Flashcards with Markdown"
      description="Create and customize interactive flashcards using Markdown on our Flashcards Creator page. Perfect for organizing and enhancing your learning experience"
      url={meta.siteUrl + meta.routes.flashcards.creator}
      lang={meta.lang}
      image={meta.siteUrl + LogoThumbnail}
    />
  );
};
