import React, { type ComponentProps } from "react";
import { c } from "design-system/c";
import { EMOJIS } from "./config";

export type MeterProps = ComponentProps<"div"> & {
  value: number;
  label?: string;
};

const getEmojiIndex = (value: number): number =>
  Math.max(0, Math.min(9, 10 - Math.round(value)));

const getFillClass = (value: number): string => {
  if (value < 2.5) return "bg-emerald-500";
  if (value < 4.5) return "bg-lime-500";
  if (value < 6.5) return "bg-amber-400";
  if (value < 8.5) return "bg-orange-500";
  return "bg-rose-500";
};

const getIconClass = (value: number): string => {
  if (value < 2.5) return "text-emerald-500";
  if (value < 4.5) return "text-lime-500";
  if (value < 6.5) return "text-amber-500";
  if (value < 8.5) return "text-orange-500";
  return "text-rose-500";
};

const getRating = (value: number): string => {
  if (value < 2.5) return "EXCELLENT";
  if (value < 4.5) return "GOOD";
  if (value < 6.5) return "AVERAGE";
  if (value < 8.5) return "BAD";
  return "TERRIBLE";
};

const clamp = (v: number) => Math.max(0, Math.min(100, (v / 10) * 100));

const BUBBLES = [
  { left: "18%", duration: "0.9s", delay: "0s" },
  { left: "46%", duration: "1.15s", delay: "0.38s" },
  { left: "74%", duration: "0.85s", delay: "0.72s" },
];

export const Meter = ({
  value,
  label = "Bullsheet Meter",
  className,
  ...props
}: MeterProps) => {
  const safe = Math.max(0, Math.min(10, value));
  const percent = clamp(safe);
  const emoji = EMOJIS[getEmojiIndex(safe)];

  return (
    <div
      {...props}
      className={c(
        "flex items-center gap-3 rounded-xl border bg-white p-4 shadow-sm",
        "border-zinc-200 dark:border-zinc-800 dark:bg-zinc-900",
        className,
      )}
    >
      <style>{`
        @keyframes meter-wave {
          0%   { background-position: -100% center; }
          100% { background-position: 300% center; }
        }
        @keyframes meter-shimmer {
          0%   { transform: translateX(-300%) skewX(-22deg); opacity: 0; }
          20%  { opacity: 1; }
          80%  { opacity: 1; }
          100% { transform: translateX(700%) skewX(-22deg); opacity: 0; }
        }
        @keyframes meter-bubble {
          0%   { transform: translateY(0) scale(1);      opacity: 0.4; }
          100% { transform: translateY(-400%) scale(0.1); opacity: 0; }
        }
      `}</style>

      <div className="flex items-center justify-center w-10 h-10 rounded-full shrink-0 bg-zinc-100 dark:bg-zinc-800">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className={c("w-7 h-7", getIconClass(safe))}
          fill="currentColor"
        >
          <circle cx="12" cy="18" r="4" />
          <rect x="10.5" y="4" width="3" height="12" rx="1.5" />
          <rect
            x="11.25"
            y="8"
            width="1.5"
            height="10"
            rx="0.75"
            fill="white"
            opacity="0.35"
          />
        </svg>
      </div>

      <div className="flex flex-col gap-1.5 flex-1 min-w-0">
        <span className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          {label}
        </span>
        <div className="relative w-full overflow-hidden rounded-full bg-zinc-200/80 dark:bg-zinc-800 h-2.5">
          <div
            className={c(
              "absolute inset-y-0 left-0 rounded-full overflow-hidden",
              getFillClass(safe),
            )}
            style={{ width: `${percent}%` }}
          >
            {/* Continuous liquid wave */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.14) 50%, transparent 100%)",
                backgroundSize: "55% 100%",
                animation: "meter-wave 3.5s linear infinite",
              }}
            />
            {/* Periodic flash shimmer */}
            <div
              className="absolute inset-y-0 w-8"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                animation: "meter-shimmer 6s ease-in-out infinite",
              }}
            />
            {/* Micro rising bubbles */}
            {BUBBLES.map(({ left, duration, delay }, i) => (
              <div
                key={i}
                className="absolute bottom-0 rounded-full bg-white/30"
                style={{
                  width: 2,
                  height: 2,
                  left,
                  animation: `meter-bubble ${duration} ease-in infinite`,
                  animationDelay: delay,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <div className="text-right">
          <div className="font-mono font-bold tabular-nums text-base text-zinc-900 dark:text-zinc-50">
            {safe.toFixed(1)}
            <span className="font-normal text-zinc-400 dark:text-zinc-500">
              /10
            </span>
          </div>
          <div className="text-xs font-semibold tracking-wide uppercase text-zinc-500 dark:text-zinc-400">
            {getRating(safe)}
          </div>
        </div>
        <span aria-hidden="true" className="text-2xl leading-none">
          {emoji}
        </span>
      </div>
    </div>
  );
};
