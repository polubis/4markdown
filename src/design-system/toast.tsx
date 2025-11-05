import React from "react";

import { Button } from "./button";
import type { CSSProperties } from "react";
import { usePortal } from "development-kit/use-portal";
import { c } from "./c";
import { BiX } from "react-icons/bi";

const getToastClassName = ({
  variant = "informative",
  animated = true,
  mode = "static",
  position = "top-center",
  className,
}: {
  variant?: "informative" | "warning" | "error" | "success";
  animated?: boolean;
  mode?: "static" | "outside";
  position?:
    | "top-left"
    | "top-center"
    | "top-right"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right";
  className?: string;
}) => {
  const baseClasses =
    "rounded-lg border-l-4 py-3 px-4 flex flex-col min-w-[17.5rem] bg-white dark:bg-slate-900 shadow-lg";

  const variantClasses = {
    informative: "border-l-blue-500",
    warning: "border-l-yellow-500",
    error: "border-l-red-500",
    success: "border-l-green-500",
  };

  const animatedClasses = animated ? "" : "";

  const modeClasses = mode === "outside" ? "z-50 fixed" : "";

  const positionClasses =
    mode === "outside"
      ? {
          "top-left": "left-4 top-4",
          "top-center": "left-1/2 -translate-x-1/2 top-4",
          "top-right": "right-4 top-4",
          "bottom-left": "left-4 bottom-4",
          "bottom-center": "left-1/2 -translate-x-1/2 bottom-4",
          "bottom-right": "right-4 bottom-4",
        }[position]
      : "";

  return c(
    baseClasses,
    variantClasses[variant],
    animatedClasses,
    modeClasses,
    positionClasses,
    className,
  );
};

type ToastProps = React.ComponentProps<"div"> & {
  variant?: "informative" | "warning" | "error" | "success";
  title: string;
  role?: "alert" | "status";
  animated?: boolean;
  mode?: "static" | "outside";
  position?:
    | "top-left"
    | "top-center"
    | "top-right"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right";
  onClose?(): void;
};

type ToastOptions = Omit<ToastProps, "mode" | "onClose"> & {
  duration?: number | "infinite";
  onClose?(id: string): void;
};

type ActiveToast = ToastOptions & { id: string };

let toasts: ActiveToast[] = [];
let listeners: (() => void)[] = [];
let toastId = 0;
const timeoutIds = new Map<string, NodeJS.Timeout>();

const emitChange = () => {
  for (const listener of listeners) {
    listener();
  }
};

const addToast = (options: ToastOptions) => {
  const id = (toastId++).toString();
  const newToast = { ...options, id };

  toasts = [...toasts, newToast];

  emitChange();

  if (options.duration !== "infinite") {
    const duration = options.duration ?? 5000;
    const timeoutId = setTimeout(() => removeToast(id), duration);
    timeoutIds.set(id, timeoutId);
  }
};

const removeToast = (id: string) => {
  if (timeoutIds.has(id)) {
    clearTimeout(timeoutIds.get(id)!);
    timeoutIds.delete(id);
  }

  const initialCount = toasts.length;
  toasts = toasts.filter((t) => t.id !== id);

  if (toasts.length < initialCount) {
    emitChange();
  }
};

const toast = (options: ToastOptions) => addToast(options);

toast.success = (options: Omit<ToastOptions, "variant">) => {
  toast({ ...options, variant: "success" });
};

toast.error = (options: Omit<ToastOptions, "variant">) => {
  toast({ ...options, variant: "error", role: "alert" });
};

toast.warning = (options: Omit<ToastOptions, "variant">) => {
  toast({ ...options, variant: "warning", role: "alert" });
};

toast.info = (options: Omit<ToastOptions, "variant">) => {
  toast({ ...options, variant: "informative", role: "status" });
};

const subscribe = (listener: () => void) => {
  listeners = [...listeners, listener];

  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
};

const getSnapshot = () => toasts;

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  (
    {
      className,
      variant,
      children,
      title,
      mode,
      role = "alert",
      position,
      animated,
      onClose,
      ...props
    },
    ref,
  ) => {
    const defaultPosition = position ?? "top-center";
    const uniqueId = React.useId();
    const titleId = `${uniqueId}-title`;
    const descriptionId = `${uniqueId}-description`;
    const { render } = usePortal();

    const content = (
      // biome-ignore lint/a11y/useAriaPropsSupportedByRole: <Not needed>
      <div
        ref={ref}
        role={role}
        aria-labelledby={titleId}
        aria-describedby={children ? descriptionId : undefined}
        className={getToastClassName({
          variant,
          mode,
          animated,
          position,
          className,
        })}
        style={
          {
            "--slide-x": defaultPosition.includes("left")
              ? "-1rem"
              : defaultPosition.includes("right")
                ? "1rem"
                : "0",
            "--slide-y": defaultPosition.includes("top")
              ? "-1rem"
              : defaultPosition.includes("bottom")
                ? "1rem"
                : "0",
            "--start-opacity": 0,
            ...props.style,
          } as CSSProperties
        }
        {...props}
      >
        <div className="flex items-center gap-2">
          <span id={titleId} className="text-base truncate">
            {title}
          </span>
          {onClose && (
            <Button
              data-uid="toast-close"
              className="ml-auto size-6"
              onClick={onClose}
              i={1}
              s={1}
              auto
              type="button"
            >
              <BiX className="shrink-0" />
            </Button>
          )}
        </div>
        {children && (
          <div
            id={descriptionId}
            className="inline-flex pt-1 max-w-[90%] text-sm"
          >
            {children}
          </div>
        )}
      </div>
    );

    if (mode === "outside") {
      return render(content);
    }

    return content;
  },
);

const ToastSlot = () => {
  const allToasts = React.useSyncExternalStore(subscribe, getSnapshot);

  if (allToasts.length === 0) {
    return null;
  }

  const groupedToasts = allToasts.reduce(
    (acc, toast) => {
      const position = toast.position ?? "top-center";
      if (!acc[position]) {
        acc[position] = [];
      }
      acc[position].push(toast);
      return acc;
    },
    {} as Record<NonNullable<ToastProps["position"]>, ActiveToast[]>,
  );

  return (
    <>
      {Object.entries(groupedToasts).map(([position, toastsInGroup]) => (
        <React.Fragment key={position}>
          {toastsInGroup.map(({ id, ...props }, idx) => (
            <Toast
              key={id}
              {...props}
              className={c(
                idx !== toastsInGroup.length - 1 && "shadow-none scale-90",
                "transition-all max-w-[480px] w-[90%]",
              )}
              style={{
                [position.includes("top") ? "marginTop" : "marginBottom"]:
                  `${idx * 1.25}rem`,
              }}
              mode="outside"
              onClose={() => {
                props.onClose?.(id);
                removeToast(id);
              }}
            />
          ))}
        </React.Fragment>
      ))}
    </>
  );
};

Toast.displayName = "Toast";

export type { ToastProps };
export { Toast, ToastSlot, toast };
