import { useMemo, useState } from 'react';

interface ToggleConfig<T = null> {
  data?: T | null;
  opened?: boolean;
}

interface ToggleState<T = null> {
  data: T | null;
  opened: boolean;
}

interface ToggleReturn<T = null> extends ToggleState<T> {
  closed: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
  set: (state: ToggleState<T>) => void;
  openWithData: (data?: T | null) => void;
  toggleWithData: (data?: T | null) => void;
}

const useToggle = <T = null>(
  config: ToggleConfig<T> = { data: null, opened: false },
): ToggleReturn<T> => {
  const [state, setState] = useState<ToggleState<T>>(() => ({
    opened: !!config.opened,
    data: config.data ?? null,
  }));

  return useMemo(
    (): ToggleReturn<T> => ({
      data: state.data,
      opened: state.opened,
      closed: !state.opened,
      open: () => setState(({ data }) => ({ data, opened: true })),
      close: () => setState(() => ({ data: null, opened: false })),
      toggle: () => setState(({ opened, data }) => ({ data, opened: !opened })),
      set: (state) => setState(state),
      openWithData: (data) => setState({ opened: true, data: data ?? null }),
      toggleWithData: (data) =>
        setState(({ opened }) => ({ opened: !opened, data: data ?? null })),
    }),
    [state],
  );
};

export { useToggle };
