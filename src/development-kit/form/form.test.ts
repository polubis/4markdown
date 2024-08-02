import type { FormSubscriber, FormSubscriberAction } from './defs';
import { expect } from '@jest/globals';
import { form } from './form';
import { minLength, maxLength } from './validators';
import { optional } from './core';

describe(`Form management can be used when: `, () => {
  interface SignInFormValues {
    username: string;
    password: string;
  }

  const createSignInFormValues = (
    username: SignInFormValues['username'],
    password: SignInFormValues['password'],
  ): SignInFormValues => ({
    username,
    password,
  });

  it(`supports optional validators`, () => {
    const signInForm = form<SignInFormValues>({
      username: [optional(minLength(2), maxLength(3))],
    });

    expect(signInForm.init(createSignInFormValues(``, ``))).toMatchSnapshot();
    expect(signInForm.init(createSignInFormValues(`d`, ``))).toMatchSnapshot();
    expect(
      signInForm.init(createSignInFormValues(`dsd`, ``)),
    ).toMatchSnapshot();
  });

  it(`validates`, () => {
    const signInForm = form<SignInFormValues>({
      username: [minLength(1), maxLength(3)],
    });

    expect(signInForm.init(createSignInFormValues(`sd`, ``))).toMatchSnapshot();
    expect(signInForm.init(createSignInFormValues(``, ``))).toMatchSnapshot();
    expect(signInForm.set(createSignInFormValues(`ds`, ``))).toMatchSnapshot();
    expect(signInForm.set(createSignInFormValues(``, ``))).toMatchSnapshot();
    expect(signInForm.confirm()).toMatchSnapshot();
    expect(signInForm.init(createSignInFormValues(`sd`, ``))).toMatchSnapshot();
    expect(signInForm.set(createSignInFormValues(``, ``))).toMatchSnapshot();
    expect(signInForm.reset()).toMatchSnapshot();
    expect(
      signInForm.reconfigure(createSignInFormValues(`s`, ``), {
        username: [minLength(2)],
      }),
    ).toMatchSnapshot();
  });

  it(`triggers events with metadata when interaction happens`, () => {
    const spy = jest.fn() as FormSubscriber<SignInFormValues>;

    const signInForm = form<SignInFormValues>();

    const unsubscribe = signInForm.subscribe(spy);

    const initStateResult = signInForm.init(createSignInFormValues(``, ``));

    expect(spy).toHaveBeenCalledWith(
      `init` as FormSubscriberAction,
      initStateResult,
    );
    expect(initStateResult).toMatchSnapshot();

    const setStateResult = signInForm.set(createSignInFormValues(``, ``));

    expect(spy).toHaveBeenCalledWith(
      `set` as FormSubscriberAction,
      setStateResult,
    );
    expect(setStateResult).toMatchSnapshot();

    const confirmStateResult = signInForm.confirm();

    expect(spy).toHaveBeenCalledWith(
      `confirm` as FormSubscriberAction,
      confirmStateResult,
    );
    expect(confirmStateResult).toMatchSnapshot();

    const resetStateResult = signInForm.reset();

    expect(spy).toHaveBeenCalledWith(
      `reset` as FormSubscriberAction,
      resetStateResult,
    );
    expect(resetStateResult).toMatchSnapshot();

    const reconfigureStateResult = signInForm.reconfigure(
      createSignInFormValues(``, ``),
      {
        username: [minLength(1)],
      },
    );

    expect(spy).toHaveBeenCalledWith(
      `reconfigure` as FormSubscriberAction,
      reconfigureStateResult,
    );
    expect(reconfigureStateResult).toMatchSnapshot();

    expect(spy).toHaveBeenCalledTimes(5);

    unsubscribe();
  });
});
