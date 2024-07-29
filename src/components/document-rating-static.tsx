import React from 'react';
import { DOCUMENT_RATING_ICONS } from './document-rating-config';
import type { DocumentRatingDto } from 'api-4markdown-contracts';

interface DocumentRatingStaticProps {
  rating: DocumentRatingDto;
}

const DocumentRatingStatic = ({ rating }: DocumentRatingStaticProps) => {
  return (
    <div className="flex space-x-2">
      {DOCUMENT_RATING_ICONS.map(([Icon, category]) => (
        <div className="relative p-1 text-black dark:text-white" key={category}>
          <Icon size={24} />
          <strong className="absolute text-md -top-2 -right-1">
            {rating[category]}
          </strong>
        </div>
      ))}
    </div>
  );
};

export { DocumentRatingStatic };
