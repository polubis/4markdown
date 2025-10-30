import { Prettify } from "development-kit/utility-types";

type WithoutUndefined<TObject extends Record<string, unknown>> = {
  [Key in keyof TObject as undefined extends TObject[Key]
    ? never
    : Key]: Exclude<TObject[Key], undefined>;
};

const omitUndefined = <
  TObject extends Record<string, unknown>,
  TProps extends readonly (keyof TObject)[],
>(
  payload: TObject,
  ...props: TProps
): Prettify<WithoutUndefined<Omit<TObject, TProps[number]>>> => {
  const deepCloned = JSON.parse(JSON.stringify(payload));
  props.forEach((prop) => {
    if (Reflect.has(deepCloned, prop)) {
      Reflect.deleteProperty(deepCloned, prop);
    }
  });

  return deepCloned as WithoutUndefined<Omit<TObject, TProps[number]>>;
};

export { omitUndefined };
