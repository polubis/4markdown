/* eslint-disable @typescript-eslint/no-explicit-any */
export type ValidatorResult<Identifier extends string> = Identifier | null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ValuesBase = Record<string | number, any>;

export type ValidatorFn<Value, Result extends string> = (
  value: Value,
) => ValidatorResult<Result>;

export type ValidatorsSetup<Values extends ValuesBase> = {
  [Key in keyof Values]?: ValidatorFn<Values[Key], string>[];
};

export type ValuesKeys<Values extends ValuesBase> = (keyof Values)[];

export type ValidationResult<Values extends ValuesBase> = {
  [Key in keyof Values]: ValidatorResult<string>;
};

export interface FormState<Values extends ValuesBase> {
  values: Values;
  result: ValidationResult<Values>;
  touched: boolean;
  untouched: boolean;
  confirmed: boolean;
  unconfirmed: boolean;
  invalid: boolean;
  valid: boolean;
}

export type FormSubscriberAction = `init` | `set` | `confirm`;
export type FormSubscriber<Values extends ValuesBase> = (
  action: FormSubscriberAction,
  state: FormState<Values>,
) => void;
export type FormSubscription = () => void;
