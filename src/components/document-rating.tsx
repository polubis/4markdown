import type {
  DocumentRatingCategory,
  DocumentRatingDto,
} from 'api-4markdown-contracts';
import React from 'react';
import c from 'classnames';
import { Button } from 'design-system/button';
import { DOCUMENT_RATING_ICONS } from 'core/document-rating-config';

type DocumentRatingProps = {
  className?: string;
  rating: DocumentRatingDto;
  yourRate: DocumentRatingCategory | null;
  onRate(category: DocumentRatingCategory, index: number): void;
};

const NOTES = [
  { name: `C4`, frequency: 261.63 },
  { name: `D4`, frequency: 293.66 },
  { name: `E4`, frequency: 329.63 },
  { name: `F4`, frequency: 349.23 },
  { name: `G4`, frequency: 392.0 },
];

const playNote = (frequency: number): void => {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();

  if (!audioContext) return;

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.type = `sine`;
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.start();
  gainNode.gain.exponentialRampToValueAtTime(
    0.00001,
    audioContext.currentTime + 1,
  );
  oscillator.stop(audioContext.currentTime + 1);
};

const DocumentRating = ({
  className,
  yourRate,
  rating,
  onRate,
}: DocumentRatingProps) => {
  const handleClick = async (
    category: DocumentRatingCategory,
    index: number,
  ): Promise<void> => {
    playNote(NOTES[index].frequency);
    onRate(category, index);
  };

  return (
    <section className={c(`flex`, className)}>
      {DOCUMENT_RATING_ICONS.map(([Icon, category], idx) => (
        <Button
          i={yourRate === category ? 2 : 1}
          s={1}
          auto
          key={category}
          title={`Rate as ${category}`}
          onClick={() => handleClick(category, idx)}
        >
          <Icon className="mr-0.5" />
          <strong>{rating[category]}</strong>
        </Button>
      ))}
    </section>
  );
};

export { DocumentRating };
export type { DocumentRatingProps };
