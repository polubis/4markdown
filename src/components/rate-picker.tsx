import { Atoms } from "api-4markdown-contracts";
import { RATING_ICONS } from "core/rating-config";
import { Button } from "design-system/button";
import { c } from "design-system/c";
import React from "react";

type RatePickerProps = {
  className?: string;
  rating: Record<Atoms["RatingCategory"], number>;
  rate: Atoms["RatingCategory"] | null;
  onRate: (category: Atoms["RatingCategory"], index: number) => void;
};

const NOTES = [
  { name: `C4`, frequency: 261.63 },
  { name: `D4`, frequency: 293.66 },
  { name: `E4`, frequency: 329.63 },
  { name: `F4`, frequency: 349.23 },
  { name: `G4`, frequency: 392.0 },
];

let audioContextInstance: AudioContext | null = null;

const getAudioContext = (): AudioContext | null => {
  if (typeof window === "undefined") return null;
  return audioContextInstance;
};

const initializeAudioContext = (): void => {
  if (typeof window === "undefined" || audioContextInstance) return;

  const AudioContextClass =
    window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContextClass) return;

  audioContextInstance = new AudioContextClass();
};

const playNote = (frequency: number): void => {
  const audioContext = getAudioContext();
  if (!audioContext) return;

  if (audioContext.state === "suspended") {
    audioContext.resume();
  }

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  const now = audioContext.currentTime;

  oscillator.type = `sine`;
  oscillator.frequency.setValueAtTime(frequency, now);
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(0.3, now + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.00001, now + 0.15);

  oscillator.start(now);
  oscillator.stop(now + 0.15);
};

const RatePicker = ({ className, rate, rating, onRate }: RatePickerProps) => {
  React.useEffect(() => {
    initializeAudioContext();
  }, []);

  const rateAndPlay = async (
    category: Atoms["RatingCategory"],
    index: number,
  ): Promise<void> => {
    playNote(NOTES[index].frequency);
    onRate(category, index);
  };

  return (
    <div className={c(`flex`, className)}>
      {RATING_ICONS.map(([Icon, category], idx) => (
        <Button
          i={rate === category ? 2 : 1}
          s={1}
          auto
          key={category}
          title={`Rate as ${category}`}
          onClick={() => rateAndPlay(category, idx)}
        >
          <Icon className="mr-0.5" />
          <strong>{rating[category]}</strong>
        </Button>
      ))}
    </div>
  );
};

export { RatePicker };
