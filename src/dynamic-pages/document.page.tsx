import React from 'react';
import { navigate, type HeadFC } from 'gatsby';
import Meta from 'components/meta';
import {
  siteMetadataStoreSelectors,
  useSiteMetadataStore,
} from 'store/site-metadata/site-metadata.store';
import LogoThumbnail from 'images/logo-thumbnail.png';
import { useSiteMetadataQuery } from 'queries/use-site-metadata-query';
import { Button } from 'design-system/button';
import { BiArrowToLeft } from 'react-icons/bi';
import Markdown from 'components/markdown';
import { PermanentDoc } from 'models/doc';

interface DocumentPageProps {
  pageContext: {
    doc: PermanentDoc;
  };
}

const DocumentPage = (props: DocumentPageProps) => {
  const synced = React.useRef(false);
  const siteMetadata = useSiteMetadataQuery();

  if (!synced.current) {
    useSiteMetadataStore.setState({
      is: `ready`,
      ...siteMetadata,
    });

    synced.current = true;
  }

  return (
    <>
      <header className="p-4">
        <nav>
          <Button
            type="button"
            i={2}
            s={2}
            title="Go back to editor"
            onClick={() => navigate(siteMetadata.routes.home)}
          >
            <BiArrowToLeft />
          </Button>
        </nav>
      </header>
      <main className="max-w-4xl p-4 mx-auto">
        <Markdown>{props.pageContext.doc.code}</Markdown>
      </main>
    </>
  );
};

export default DocumentPage;

export const Head: HeadFC = () => {
  const meta = siteMetadataStoreSelectors.useReady();

  return (
    <Meta
      appName={meta.appName}
      title={meta.title}
      description={meta.description}
      url={meta.siteUrl}
      lang={meta.lang}
      image={LogoThumbnail}
      robots="noindex, nofollow"
    />
  );
};
