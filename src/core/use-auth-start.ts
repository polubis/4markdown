import { logIn } from "actions/log-in.action";
import React from "react";
import { useAuthStore } from "store/auth/auth.store";

const useAuthStart = () => {
  const auth = useAuthStore();
  const shouldStartAfterLogIn = React.useRef(false);
  const onLoginCallbackRef = React.useRef<(() => void) | null>(null);

  const start = React.useCallback(
    (onLogIn: () => void) => {
      onLoginCallbackRef.current = onLogIn;

      if (auth.is === `authorized`) {
        onLoginCallbackRef.current?.();
        return;
      }

      shouldStartAfterLogIn.current = true;

      logIn();
    },
    [auth],
  );

  React.useEffect(() => {
    if (auth.is === `authorized` && shouldStartAfterLogIn.current) {
      onLoginCallbackRef.current?.();
      shouldStartAfterLogIn.current = false;
    }
  }, [auth]);

  return start;
};

export { useAuthStart };
