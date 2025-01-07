const observeFirstInteraction = (
  onInteraction: () => void,
): { unobserve(): void } => {
  const events = [`mousemove`, `mousedown`, `touchstart`, `touchmove`] as const;

  const unobserve = (): void => {
    events.forEach((event) => removeEventListener(event, markAsInteracted));
  };

  const markAsInteracted = (): void => {
    unobserve();
    onInteraction();
  };

  events.forEach((event) => addEventListener(event, markAsInteracted));

  return { unobserve };
};

export { observeFirstInteraction };
