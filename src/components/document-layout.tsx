import React from 'react';
import Markdown from './markdown';
import { Tags } from 'models/general';
import { Badges } from 'design-system/badges';
import { Badge } from 'design-system/badge';
import { DocThumbnailUrls } from 'models/doc-thumbnail';

interface DocumentLayoutProps {
  children: string;
  tags: Tags;
  urls?: DocThumbnailUrls;
}

const DocumentLayout = ({ children, tags, urls }: DocumentLayoutProps) => {
  const srcSet = `${urls?.xl} 1920w, ${urls?.lg} 1440w, ${urls?.md} 960w, ${urls?.sm} 480w, ${urls?.xs} 240w`;

  return (
    <main>
      {urls && (
        <picture>
          <source
            srcSet={srcSet}
            sizes="(max-width: 240px) 240px,
                (max-width: 480px) 480px,
                (max-width: 960px) 960px,
                (max-width: 1440px) 1440px,
                1920px"
          />
          <img
            src={urls.xl}
            alt="Responsive Image"
            srcSet={srcSet}
            sizes="(max-width: 240px) 240px,
                (max-width: 480px) 480px,
                (max-width: 960px) 960px,
                (max-width: 1440px) 1440px,
                1920px"
          />
        </picture>
      )}
      <div className="max-w-4xl p-4 my-6 mx-auto">
        {tags.length > 0 && (
          <Badges className="mb-4">
            {tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </Badges>
        )}
        <Markdown>{children}</Markdown>
      </div>
    </main>
  );
};

export { DocumentLayout };
