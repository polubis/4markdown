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

export { emit, subscribe };
