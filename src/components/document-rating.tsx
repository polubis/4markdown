import { Button } from 'design-system/button';
import React from 'react';
import { BiBulb, BiHeart, BiLaugh, BiLike, BiDislike } from 'react-icons/bi';

interface DocumentRatingProps {
  mode: 'interactive' | 'static';
  active?: number;
  onRate(): void;
}

const ICONS = [BiHeart, BiBulb, BiLike, BiLaugh, BiDislike] as const;

const playNote = (idx: number): void => {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();

  if (!audioContext) return;

  const notes = [
    { name: `C4`, frequency: 261.63 },
    { name: `D4`, frequency: 293.66 },
    { name: `E4`, frequency: 329.63 },
    { name: `F4`, frequency: 349.23 },
    { name: `G4`, frequency: 392.0 },
  ];
  const frequency = notes[idx].frequency;

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

const DocumentRating = ({ mode, active }: DocumentRatingProps) => {
  const handleClick = (idx: number): void => {
    playNote(idx);
  };

  return (
    <div className="flex space-x-2">
      {mode === `interactive`
        ? ICONS.map((Icon, idx) => (
            <Button
              i={2}
              s={2}
              className={active === idx ? `fade-in` : ``}
              key={Icon.name}
              onClick={() => handleClick(idx)}
            >
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
