import React, { useRef } from "react";
import { Subject, Subscription } from "rxjs";

type AppEvent = {
  type: "SHOW_USER_PROFILE_FORM";
};

const appEventsBus = new Subject<AppEvent>();
const appEventsBus$ = appEventsBus.asObservable();

const emit = (event: AppEvent): void => {
  appEventsBus.next(event);
};

const subscribe = (callback: (event: AppEvent) => void): Subscription =>
  appEventsBus$.subscribe(callback);

const useAppEvent = (callback: (event: AppEvent) => void): void => {
  const callbackRef = useRef(callback);

  React.useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  React.useEffect(() => {
    const subscription = subscribe(callbackRef.current);

    return () => {
      subscription.unsubscribe();
    };
  }, []);
};

export type { AppEvent };
export { emit, subscribe, useAppEvent };
