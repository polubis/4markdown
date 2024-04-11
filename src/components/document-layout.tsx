import React from 'react';
import Markdown from './markdown';
import { Tags } from 'models/general';
import { Badges } from 'design-system/badges';
import { Badge } from 'design-system/badge';

interface DocumentLayoutProps {
  children: string;
  tags: Tags;
}

const DocumentLayout = ({ children, tags }: DocumentLayoutProps) => {
  return (
    <main className="max-w-4xl p-4 mx-auto">
      {tags.length > 0 && (
        <Badges className="mb-4">
          {tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </Badges>
      )}
      <Markdown>{children}</Markdown>
    </main>
  );
};

export { DocumentLayout };
