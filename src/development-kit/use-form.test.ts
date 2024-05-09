import { act, renderHook } from '@testing-library/react';
import { useForm } from './use-form';
import { maxLength, minLength, optional } from './form';
import { expect } from '@jest/globals';

describe(`Form management is integrated with React when: `, () => {
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

  it(`allows to manage form`, () => {
    const { result } = renderHook(() =>
      useForm<SignInFormValues>(createSignInFormValues(``, ``), {
        username: [minLength(2), maxLength(5)],
        password: [optional(minLength(2), maxLength(5))],
      }),
    );

    expect(result.current[0]).toMatchSnapshot();

    act(() => {
      result.current[1].set({ username: `cos`, password: `s` });
    });

    expect(result.current[0]).toMatchSnapshot();

    act(() => {
      result.current[1].confirm();
    });

    expect(result.current[0]).toMatchSnapshot();

    act(() => {
      result.current[1].reset();
    });

    expect(result.current[0]).toMatchSnapshot();

    act(() => {
      result.current[1].set({ username: `cos`, password: `cos` });
    });

    expect(result.current[0]).toMatchSnapshot();

    act(() => {
      result.current[1].reconfigure({ username: ``, password: `` });
    });

    expect(result.current[0].values).toEqual(createSignInFormValues(``, ``));
    expect(result.current[0]).toMatchSnapshot();

    act(() => {
      result.current[1].set({ username: ``, password: `` });
    });

    expect(result.current[0]).toMatchSnapshot();
  });
});
