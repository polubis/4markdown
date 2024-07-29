import { Button } from 'design-system/button';
import React from 'react';
import type {
  DocumentRatingCategory,
  DocumentRatingDto,
} from 'api-4markdown-contracts';
import { DOCUMENT_RATING_ICONS } from './document-rating-config';
import { useToggle } from 'development-kit/use-toggle';

interface DocumentRatingProps {
  rating: DocumentRatingDto;
}

interface VotedSectionProps {
  activeCategory: DocumentRatingCategory;
  onReset(): void;
}

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

const VotedSection = ({ activeCategory, onReset }: VotedSectionProps) => {
  const [Icon] = DOCUMENT_RATING_ICONS.find(
    ([_, category]) => category === activeCategory,
  )!;

  return (
    <div className="animate-fade-in flex items-center text-md dark:text-white text-black">
      <span>You&apos;ve already voted: </span>
      <Icon className="mr-4 ml-2" size={24} />
      <Button i={2} s={2} auto onClick={onReset}>
        Change
      </Button>
    </div>
  );
};

const DocumentRatingInteractive = ({ rating }: DocumentRatingProps) => {
  const voted = useToggle<DocumentRatingCategory>();

  const handleClick = (category: DocumentRatingCategory, idx: number): void => {
    const notes = [
      { name: `C4`, frequency: 261.63 },
      { name: `D4`, frequency: 293.66 },
      { name: `E4`, frequency: 329.63 },
      { name: `F4`, frequency: 349.23 },
      { name: `G4`, frequency: 392.0 },
    ];
    const frequency = notes[idx].frequency;

    playNote(frequency);
    voted.openWithData(category);
  };

  return (
    <div className="h-10">
      {voted.data ? (
        <VotedSection activeCategory={voted.data} onReset={voted.close} />
      ) : (
        <div className="animate-fade-in flex space-x-2">
          {DOCUMENT_RATING_ICONS.map(([Icon, category], idx) => (
            <Button
              i={2}
              s={2}
              key={category}
              onClick={() => handleClick(category, idx)}
            >
              <Icon />
            </Button>
          ))}
        </div>
      )}
    </div>
  );
};

export { DocumentRatingInteractive };
