import type { RatingCategory } from "../domain/models";

let audioContextInstance: AudioContext | null = null;
let masterReverbNode: ConvolverNode | null = null;

const getAudioContext = (): AudioContext | null => {
  if (typeof window === "undefined") return null;
  if (audioContextInstance) return audioContextInstance;

  const Ctor =
    window.AudioContext ||
    (window as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!Ctor) return null;

  audioContextInstance = new Ctor();
  return audioContextInstance;
};

const buildImpulseResponse = (
  ctx: AudioContext,
  durationSeconds: number,
  decay: number,
): AudioBuffer => {
  const length = Math.floor(ctx.sampleRate * durationSeconds);
  const impulse = ctx.createBuffer(2, length, ctx.sampleRate);
  for (let channel = 0; channel < 2; channel++) {
    const data = impulse.getChannelData(channel);
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / length) ** decay;
    }
  }
  return impulse;
};

const getReverb = (ctx: AudioContext): ConvolverNode => {
  if (masterReverbNode) return masterReverbNode;
  masterReverbNode = ctx.createConvolver();
  masterReverbNode.buffer = buildImpulseResponse(ctx, 1.6, 3);
  return masterReverbNode;
};

const createNoiseBuffer = (
  ctx: AudioContext,
  durationSeconds: number,
): AudioBuffer => {
  const length = Math.floor(ctx.sampleRate * durationSeconds);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
};

type Preset = {
  fundamental: number;
  partials: { ratio: number; gain: number }[];
  duration: number;
  attack: number;
  release: number;
  toneLevel: number;
  filterCutoff: number;
  reverbSend: number;
  bloom: number;
};

const PRESETS: Record<RatingCategory, Preset> = {
  perfect: {
    fundamental: 659.25,
    partials: [
      { ratio: 1, gain: 1 },
      { ratio: 2, gain: 0.18 },
      { ratio: 3, gain: 0.05 },
    ],
    duration: 1.8,
    attack: 0.025,
    release: 1.6,
    toneLevel: 0.16,
    filterCutoff: 4200,
    reverbSend: 0.45,
    bloom: 0,
  },
  good: {
    fundamental: 523.25,
    partials: [
      { ratio: 1, gain: 1 },
      { ratio: 2, gain: 0.16 },
      { ratio: 3, gain: 0.04 },
    ],
    duration: 1.6,
    attack: 0.025,
    release: 1.4,
    toneLevel: 0.16,
    filterCutoff: 3600,
    reverbSend: 0.42,
    bloom: 0,
  },
  decent: {
    fundamental: 392,
    partials: [
      { ratio: 1, gain: 1 },
      { ratio: 2, gain: 0.14 },
      { ratio: 3, gain: 0.03 },
    ],
    duration: 1.5,
    attack: 0.03,
    release: 1.3,
    toneLevel: 0.17,
    filterCutoff: 2800,
    reverbSend: 0.4,
    bloom: 0,
  },
  bad: {
    fundamental: 261.63,
    partials: [
      { ratio: 1, gain: 1 },
      { ratio: 2, gain: 0.12 },
    ],
    duration: 1.7,
    attack: 0.035,
    release: 1.5,
    toneLevel: 0.19,
    filterCutoff: 2000,
    reverbSend: 0.42,
    bloom: 0,
  },
  ugly: {
    fundamental: 174.61,
    partials: [
      { ratio: 1, gain: 1 },
      { ratio: 2, gain: 0.1 },
    ],
    duration: 2,
    attack: 0.045,
    release: 1.8,
    toneLevel: 0.21,
    filterCutoff: 1300,
    reverbSend: 0.45,
    bloom: 0,
  },
};

export const playRateSound = (category: RatingCategory): void => {
  const ctx = getAudioContext();
  if (!ctx) return;
  if (ctx.state === "suspended") ctx.resume();

  const p = PRESETS[category];
  const now = ctx.currentTime;
  const sustainEnd = now + p.attack + p.release;

  const dryBus = ctx.createGain();
  dryBus.gain.setValueAtTime(1, now);

  const wetBus = ctx.createGain();
  wetBus.gain.setValueAtTime(p.reverbSend, now);

  const lowpass = ctx.createBiquadFilter();
  lowpass.type = "lowpass";
  lowpass.Q.setValueAtTime(0.7, now);
  lowpass.frequency.setValueAtTime(p.filterCutoff, now);
  lowpass.frequency.exponentialRampToValueAtTime(
    Math.max(p.filterCutoff * 0.4, 400),
    sustainEnd,
  );

  const masterEnv = ctx.createGain();
  masterEnv.gain.setValueAtTime(0, now);
  masterEnv.gain.linearRampToValueAtTime(p.toneLevel, now + p.attack);
  masterEnv.gain.exponentialRampToValueAtTime(0.0001, sustainEnd);

  lowpass.connect(masterEnv);
  masterEnv.connect(dryBus);
  masterEnv.connect(wetBus);
  dryBus.connect(ctx.destination);
  wetBus.connect(getReverb(ctx)).connect(ctx.destination);

  p.partials.forEach((partial, idx) => {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    const startFreq = p.fundamental * partial.ratio * (1 - p.bloom);
    const targetFreq = p.fundamental * partial.ratio;
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(targetFreq, now + 0.12);

    const partialGain = ctx.createGain();
    partialGain.gain.setValueAtTime(0, now);
    partialGain.gain.linearRampToValueAtTime(
      partial.gain,
      now + p.attack + idx * 0.005,
    );
    partialGain.gain.exponentialRampToValueAtTime(
      0.0001,
      now + p.release * (1 - idx * 0.12),
    );

    osc.connect(partialGain);
    partialGain.connect(lowpass);

    osc.start(now);
    osc.stop(sustainEnd + 0.05);
  });

};

const RATE_ORDER: RatingCategory[] = [
  "ugly",
  "bad",
  "decent",
  "good",
  "perfect",
];

export const playRateSubmit = (selected: RatingCategory): void => {
  const sweep = RATE_ORDER.filter((category) => category !== selected);
  sweep.forEach((category, i) => {
    setTimeout(() => playRateSound(category), i * 70);
  });
  setTimeout(() => playRateSound(selected), sweep.length * 70 + 90);
};

type ShooshOptions = {
  duration?: number;
  startFrequency?: number;
  endFrequency?: number;
  volume?: number;
};

export const playShoosh = ({
  duration = 0.25,
  startFrequency = 8000,
  endFrequency = 1200,
  volume = 0.18,
}: ShooshOptions = {}): void => {
  const ctx = getAudioContext();
  if (!ctx) return;
  if (ctx.state === "suspended") ctx.resume();

  const now = ctx.currentTime;
  const noise = ctx.createBufferSource();
  noise.buffer = createNoiseBuffer(ctx, duration);

  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.Q.setValueAtTime(1.2, now);
  filter.frequency.setValueAtTime(startFrequency, now);
  filter.frequency.exponentialRampToValueAtTime(endFrequency, now + duration);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(volume, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  noise.start(now);
  noise.stop(now + duration);
};

export const primeAudio = (): void => {
  const ctx = getAudioContext();
  if (!ctx) return;
  if (ctx.state === "suspended") ctx.resume();

  const now = ctx.currentTime;
  const silent = ctx.createBufferSource();
  silent.buffer = ctx.createBuffer(1, 1, ctx.sampleRate);
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, now);
  silent.connect(gain);
  gain.connect(ctx.destination);
  silent.start(now);
  silent.stop(now + 0.001);

  getReverb(ctx);
};
