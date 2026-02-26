import React from "react";
import { useAuthStore } from "store/auth/auth.store";
import { usePreviousWorkState } from "../store";
import { clearOpenRequestAction } from "../actions";
import { PreviousWorkWidget } from "../components/previous-work-widget";
import { PREVIOUS_WORK_WIDGET_PREFS_LS_KEY } from "../store/config";

type WidgetPosition = { left: number; top: number };
type WidgetCorner = "top-left" | "top-right" | "bottom-left" | "bottom-right";

function loadWidgetPrefs(): {
  minimized: boolean;
  position: WidgetPosition | null;
} {
  if (typeof window === "undefined")
    return { minimized: false, position: null };
  try {
    const raw = window.localStorage.getItem(PREVIOUS_WORK_WIDGET_PREFS_LS_KEY);
    if (raw === null) return { minimized: false, position: null };
    const parsed = JSON.parse(raw) as unknown;
    if (typeof parsed !== "object" || parsed === null)
      return { minimized: false, position: null };
    const p = parsed as { minimized?: boolean; left?: number; top?: number };
    if (
      typeof p.left === "number" &&
      typeof p.top === "number" &&
      Number.isFinite(p.left) &&
      Number.isFinite(p.top)
    ) {
      return {
        minimized: Boolean(p.minimized),
        position: { left: p.left, top: p.top },
      };
    }
    return { minimized: Boolean(p.minimized), position: null };
  } catch {
    return { minimized: false, position: null };
  }
}

function saveWidgetPrefs(prefs: {
  minimized: boolean;
  position: WidgetPosition | null;
}): void {
  if (typeof window === "undefined") return;
  try {
    const toSave =
      prefs.position === null
        ? { minimized: prefs.minimized }
        : {
            minimized: prefs.minimized,
            left: prefs.position.left,
            top: prefs.position.top,
          };
    window.localStorage.setItem(
      PREVIOUS_WORK_WIDGET_PREFS_LS_KEY,
      JSON.stringify(toSave),
    );
  } catch {
    // ignore
  }
}

const DEFAULT_OFFSET = 16;
const DEFAULT_TOP = 80;

function getViewportSize(): { width: number; height: number } {
  if (typeof window === "undefined") return { width: 0, height: 0 };
  const v = window.visualViewport;
  return {
    width: v ? v.width : window.innerWidth,
    height: v ? v.height : window.innerHeight,
  };
}

function getNearestCorner(params: {
  left: number;
  top: number;
  width: number;
  height: number;
  viewportWidth: number;
  viewportHeight: number;
}): WidgetCorner {
  const centerX = params.left + params.width / 2;
  const centerY = params.top + params.height / 2;
  const corners: Array<{ corner: WidgetCorner; x: number; y: number }> = [
    { corner: "top-left", x: 0, y: 0 },
    { corner: "top-right", x: params.viewportWidth, y: 0 },
    { corner: "bottom-left", x: 0, y: params.viewportHeight },
    {
      corner: "bottom-right",
      x: params.viewportWidth,
      y: params.viewportHeight,
    },
  ];

  let nearest = corners[0];
  let nearestDistance =
    (centerX - nearest.x) * (centerX - nearest.x) +
    (centerY - nearest.y) * (centerY - nearest.y);

  for (const candidate of corners.slice(1)) {
    const distance =
      (centerX - candidate.x) * (centerX - candidate.x) +
      (centerY - candidate.y) * (centerY - candidate.y);
    if (distance < nearestDistance) {
      nearest = candidate;
      nearestDistance = distance;
    }
  }

  return nearest.corner;
}

function getPositionForCorner(params: {
  corner: WidgetCorner;
  width: number;
  height: number;
  viewportWidth: number;
  viewportHeight: number;
}): WidgetPosition {
  const maxLeft = Math.max(0, params.viewportWidth - params.width);
  const maxTop = Math.max(0, params.viewportHeight - params.height);
  const left =
    params.corner === "top-right" || params.corner === "bottom-right"
      ? maxLeft
      : 0;
  const top =
    params.corner === "bottom-left" || params.corner === "bottom-right"
      ? maxTop
      : 0;

  return { left, top };
}

const PreviousWorkWidgetContainer = () => {
  const isAuthorized = useAuthStore((s) => s.is === `authorized`);
  const entries = usePreviousWorkState((s) => s.entries);
  const openRequested = usePreviousWorkState((s) => s.openRequested);
  const [dismissed, setDismissed] = React.useState(false);
  const [prefs, setPrefs] = React.useState(() => loadWidgetPrefs());
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const pendingCornerSnapRef = React.useRef<WidgetCorner | null>(null);

  React.useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const el = wrapperRef.current;
    if (!el) return;

    const { width: vw, height: vh } = getViewportSize();

    if (prefs.position === null) {
      const width = el.offsetWidth;
      const left = vw - width - DEFAULT_OFFSET;
      const top = DEFAULT_TOP;
      setPrefs((prev) => {
        const next = { ...prev, position: { left, top } };
        saveWidgetPrefs(next);
        return next;
      });
      return;
    }

    const w = el.offsetWidth;
    const h = el.offsetHeight;
    const maxLeft = vw - w;
    const maxTop = vh - h;
    const { left, top } = prefs.position;
    const clampedLeft = Math.max(0, Math.min(left, maxLeft));
    const clampedTop = Math.max(0, Math.min(top, maxTop));
    if (clampedLeft !== left || clampedTop !== top) {
      setPrefs((prev) => {
        const next = {
          ...prev,
          position: { left: clampedLeft, top: clampedTop },
        };
        saveWidgetPrefs(next);
        return next;
      });
    }
  }, [prefs.position, prefs.minimized]);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const clampPositionToViewport = () => {
      const el = wrapperRef.current;
      if (!el) return;
      const { width: vw, height: vh } = getViewportSize();
      setPrefs((prev) => {
        if (prev.position === null) return prev;
        const w = el.offsetWidth;
        const h = el.offsetHeight;
        const maxLeft = vw - w;
        const maxTop = vh - h;
        const { left, top } = prev.position;
        const clampedLeft = Math.max(0, Math.min(left, maxLeft));
        const clampedTop = Math.max(0, Math.min(top, maxTop));
        if (clampedLeft === left && clampedTop === top) return prev;
        const next = {
          ...prev,
          position: { left: clampedLeft, top: clampedTop },
        };
        saveWidgetPrefs(next);
        return next;
      });
    };

    window.addEventListener("resize", clampPositionToViewport);
    const vv = window.visualViewport;
    if (vv) vv.addEventListener("resize", clampPositionToViewport);

    return () => {
      window.removeEventListener("resize", clampPositionToViewport);
      if (vv) vv.removeEventListener("resize", clampPositionToViewport);
    };
  }, []);

  React.useLayoutEffect(() => {
    const pendingCorner = pendingCornerSnapRef.current;
    if (pendingCorner === null) return;

    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const { width: vw, height: vh } = getViewportSize();
    const nextPosition = getPositionForCorner({
      corner: pendingCorner,
      width: wrapper.offsetWidth,
      height: wrapper.offsetHeight,
      viewportWidth: vw,
      viewportHeight: vh,
    });

    pendingCornerSnapRef.current = null;
    setPrefs((prev) => {
      const currentPosition = prev.position;
      if (
        currentPosition &&
        currentPosition.left === nextPosition.left &&
        currentPosition.top === nextPosition.top
      ) {
        return prev;
      }
      const next = { ...prev, position: nextPosition };
      saveWidgetPrefs(next);
      return next;
    });
  }, [prefs.minimized]);

  const handleClose = React.useCallback(() => {
    clearOpenRequestAction();
    setDismissed(true);
  }, []);

  const handleToggleMinimize = React.useCallback(() => {
    const wrapper = wrapperRef.current;
    if (wrapper) {
      const rect = wrapper.getBoundingClientRect();
      const { width: vw, height: vh } = getViewportSize();
      pendingCornerSnapRef.current = getNearestCorner({
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
        viewportWidth: vw,
        viewportHeight: vh,
      });
    }

    setPrefs((prev) => {
      const next = { ...prev, minimized: !prev.minimized };
      saveWidgetPrefs(next);
      return next;
    });
  }, []);

  const handleMovePointerDown = React.useCallback((e: React.PointerEvent) => {
    if (e.button !== 0) return;
    const startX = e.clientX;
    const startY = e.clientY;
    const wrapper = wrapperRef.current;
    if (!wrapper) return;
    const captureTarget = e.currentTarget;
    const pointerId = e.pointerId;
    const rect = wrapper.getBoundingClientRect();
    const startLeft = rect.left;
    const startTop = rect.top;
    captureTarget.setPointerCapture(pointerId);

    const onPointerMove = (moveEvent: PointerEvent) => {
      const dx = moveEvent.clientX - startX;
      const dy = moveEvent.clientY - startY;
      const w = wrapper.offsetWidth;
      const h = wrapper.offsetHeight;
      const { width: vw, height: vh } = getViewportSize();
      const maxLeft = vw - w;
      const maxTop = vh - h;
      const left = Math.max(0, Math.min(startLeft + dx, maxLeft));
      const top = Math.max(0, Math.min(startTop + dy, maxTop));
      setPrefs((prev) => {
        const next = {
          ...prev,
          position: { left, top },
        };
        saveWidgetPrefs(next);
        return next;
      });
    };

    const onPointerUp = () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      if (
        captureTarget &&
        typeof captureTarget.releasePointerCapture === "function"
      ) {
        captureTarget.releasePointerCapture(pointerId);
      }
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  }, []);

  const showWidget =
    (openRequested || !dismissed) && isAuthorized && entries.length > 0;
  if (!showWidget) return null;

  const style: React.CSSProperties =
    prefs.position === null
      ? { right: DEFAULT_OFFSET, top: DEFAULT_TOP }
      : { left: prefs.position.left, top: prefs.position.top };

  return (
    <div ref={wrapperRef} className="fixed z-10 hidden md:block" style={style}>
      <PreviousWorkWidget
        entries={entries}
        onClose={handleClose}
        minimized={prefs.minimized}
        onToggleMinimize={handleToggleMinimize}
        onMovePointerDown={handleMovePointerDown}
      />
    </div>
  );
};

export { PreviousWorkWidgetContainer };
