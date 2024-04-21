import React from 'react';
import Markdown from './markdown';
import { Tags } from 'models/general';
import { Badges } from 'design-system/badges';
import { Badge } from 'design-system/badge';

interface DocumentLayoutProps {
  children: string;
  tags: Tags;
  thumbnail?: string;
}

const DocumentLayout = ({ children, tags, thumbnail }: DocumentLayoutProps) => {
  return (
    <main>
      {thumbnail && (
        <img
          className="object-cover lg:h-[620px] h-[420px] w-full max-w-[1920px] mx-auto"
          src={thumbnail}
          alt="Document thumbnail"
        />
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
