import React from "react";
import { useAuthStore } from "store/auth/auth.store";
import { usePreviousWorkState } from "../store";
import { clearOpenRequestAction } from "../actions";
import { PreviousWorkWidget } from "../components/previous-work-widget";

const PreviousWorkWidgetContainer = () => {
  const isAuthorized = useAuthStore((s) => s.is === `authorized`);
  const entries = usePreviousWorkState((s) => s.entries);
  const openRequested = usePreviousWorkState((s) => s.openRequested);
  const [dismissed, setDismissed] = React.useState(false);

  const handleClose = React.useCallback(() => {
    clearOpenRequestAction();
    setDismissed(true);
  }, []);

  const showWidget =
    (openRequested || !dismissed) && isAuthorized && entries.length > 0;
  if (!showWidget) return null;

  return (
    <div className="fixed top-20 right-4 z-10 hidden md:block">
      <PreviousWorkWidget entries={entries} onClose={handleClose} />
    </div>
  );
};

export { PreviousWorkWidgetContainer };
