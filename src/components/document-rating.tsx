import { Button } from 'design-system/button';
import React from 'react';
import { BiBulb, BiAngry, BiHeart, BiLaugh, BiLike } from 'react-icons/bi';

interface DocumentRatingProps {
  mode: 'interactive' | 'static';
}

const ICONS = [BiHeart, BiBulb, BiLike, BiLaugh, BiAngry] as const;

const DocumentRating = ({ mode }: DocumentRatingProps) => {
  return (
    <div className="flex space-x-2">
      {mode === `interactive`
        ? ICONS.map((Icon) => (
            <Button i={2} s={2} key={Icon.name}>
              <Icon />
            </Button>
          ))
        : ICONS.map((Icon) => (
            <div
              className="relative p-1 text-black dark:text-white"
              key={Icon.name}
            >
              <Icon size={24} />
              <strong className="absolute text-md -top-2 -right-1">1</strong>
            </div>
          ))}
    </div>
  );
};

export { DocumentRating };
