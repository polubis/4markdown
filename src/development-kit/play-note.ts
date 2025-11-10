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

const play = (frequency: number): void => {
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

const NOTES = new Map([
  [`c0`, 16.35],
  [`c#0`, 17.32],
  [`d0`, 18.35],
  [`d#0`, 19.45],
  [`e0`, 20.6],
  [`f0`, 21.83],
  [`f#0`, 23.12],
  [`g0`, 24.5],
  [`g#0`, 25.96],
  [`a0`, 27.5],
  [`a#0`, 29.14],
  [`b0`, 30.87],

  // Octave 1
  [`c1`, 32.7],
  [`c#1`, 34.65],
  [`d1`, 36.71],
  [`d#1`, 38.89],
  [`e1`, 41.2],
  [`f1`, 43.65],
  [`f#1`, 46.25],
  [`g1`, 49.0],
  [`g#1`, 51.91],
  [`a1`, 55.0],
  [`a#1`, 58.27],
  [`b1`, 61.74],

  // Octave 2
  [`c2`, 65.41],
  [`c#2`, 69.3],
  [`d2`, 73.42],
  [`d#2`, 77.78],
  [`e2`, 82.41],
  [`f2`, 87.31],
  [`f#2`, 92.5],
  [`g2`, 98.0],
  [`g#2`, 103.83],
  [`a2`, 110.0],
  [`a#2`, 116.54],
  [`b2`, 123.47],

  // Octave 3
  [`c3`, 130.81],
  [`c#3`, 138.59],
  [`d3`, 146.83],
  [`d#3`, 155.56],
  [`e3`, 164.81],
  [`f3`, 174.61],
  [`f#3`, 185.0],
  [`g3`, 196.0],
  [`g#3`, 207.65],
  [`a3`, 220.0],
  [`a#3`, 233.08],
  [`b3`, 246.94],

  // Octave 4
  [`c4`, 261.63],
  [`c#4`, 277.18],
  [`d4`, 293.66],
  [`d#4`, 311.13],
  [`e4`, 329.63],
  [`f4`, 349.23],
  [`f#4`, 369.99],
  [`g4`, 392.0],
  [`g#4`, 415.3],
  [`a4`, 440.0],
  [`a#4`, 466.16],
  [`b4`, 493.88],

  // Octave 5
  [`c5`, 523.25],
  [`c#5`, 554.37],
  [`d5`, 587.33],
  [`d#5`, 622.25],
  [`e5`, 659.25],
  [`f5`, 698.46],
  [`f#5`, 739.99],
  [`g5`, 783.99],
  [`g#5`, 830.61],
  [`a5`, 880.0],
  [`a#5`, 932.33],
  [`b5`, 987.77],

  // Octave 6
  [`c6`, 1046.5],
  [`c#6`, 1108.73],
  [`d6`, 1174.66],
  [`d#6`, 1244.51],
  [`e6`, 1318.51],
  [`f6`, 1396.91],
  [`f#6`, 1479.98],
  [`g6`, 1567.98],
  [`g#6`, 1661.22],
  [`a6`, 1760.0],
  [`a#6`, 1864.66],
  [`b6`, 1975.53],
] as const);

initializeAudioContext();

const playNote = (noteName: Parameters<typeof NOTES.get>[0]): void => {
  const frequency = NOTES.get(noteName);

  if (!frequency) return;

  play(frequency);
};

export { playNote };
