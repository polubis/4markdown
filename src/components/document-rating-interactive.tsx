import { Button } from 'design-system/button';
import React from 'react';
import type { DocumentRatingCategory } from 'api-4markdown-contracts';
import { DOCUMENT_RATING_ICONS } from './document-rating-config';
import { useToggle } from 'development-kit/use-toggle';

interface DocumentRatingProps {
  onChange(category: DocumentRatingCategory): void;
}

interface RatedSectionProps {
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

const RatedSection = ({ activeCategory, onReset }: RatedSectionProps) => {
  const [Icon] = DOCUMENT_RATING_ICONS.find(
    ([_, category]) => category === activeCategory,
  )!;

  return (
    <Button
      className="animate-fade-in"
      i={2}
      s={2}
      auto
      onClick={onReset}
      title="Change document rate"
    >
      Change Rate <Icon className="ml-1 animate-shake" size={24} />
    </Button>
  );
};

const DocumentRatingInteractive = ({ onChange }: DocumentRatingProps) => {
  const voted = useToggle<DocumentRatingCategory>();

  const handleClick = async (
    category: DocumentRatingCategory,
    idx: number,
  ): Promise<void> => {
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
    onChange(category);
  };

  return voted.data ? (
    <RatedSection activeCategory={voted.data} onReset={voted.close} />
  ) : (
    <div className="animate-fade-in flex space-x-2">
      {DOCUMENT_RATING_ICONS.map(([Icon, category], idx) => (
        <Button
          i={2}
          s={2}
          key={category}
          title={`Rate as ${category}`}
          onClick={() => handleClick(category, idx)}
        >
          <Icon />
        </Button>
      ))}
    </div>
  );
};

export { DocumentRatingInteractive };
