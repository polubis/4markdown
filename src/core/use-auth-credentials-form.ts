import React from "react";
import { useForm } from "development-kit/use-form";
import type { ValidatorFn, ValidatorsSetup } from "development-kit/form";
import { logInWithCredentialsAct } from "acts/log-in-with-credentials.act";
import { registerWithCredentialsAct } from "acts/register-with-credentials.act";
import type { API4MarkdownError } from "api-4markdown-contracts";

type AuthMode = "sign-in" | "register";

type SubmitState =
  | { is: "idle" }
  | { is: "busy" }
  | { is: "fail"; error: API4MarkdownError };

type FormValues = {
  email: string;
  password: string;
  confirmPassword: string;
};

type UseAuthCredentialsFormOptions = {
  initialMode?: AuthMode;
  onSuccess?(): void;
};

const emailValidator: ValidatorFn<string, string> = (value: string) => {
  const trimmed = value.trim();

  if (trimmed.length === 0) return "Email is required.";

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)
    ? null
    : "Email must be valid.";
};

const passwordValidator: ValidatorFn<string, string> = (value: string) => {
  if (value.length === 0) return "Password is required.";

  if (value.length < 8) {
    return "Password must be at least 8 characters.";
  }

  if (!/[0-9]/.test(value)) {
    return "Password must include at least one number.";
  }

  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value)) {
    return "Password must include at least one special character.";
  }

  return null;
};

const validators: ValidatorsSetup<FormValues> = {
  email: [emailValidator],
  password: [passwordValidator],
};

const useAuthCredentialsForm = ({
  initialMode = "sign-in",
  onSuccess,
}: UseAuthCredentialsFormOptions) => {
  const [mode, setMode] = React.useState<AuthMode>(initialMode);
  const [status, setStatus] = React.useState<SubmitState>({ is: "idle" });
  const [{ invalid, values, result, touched }, { inject, set }] =
    useForm<FormValues>(
      {
        email: "",
        password: "",
        confirmPassword: "",
      },
      validators,
    );

  const passwordMismatch =
    mode === "register" &&
    values.confirmPassword.trim().length > 0 &&
    values.confirmPassword !== values.password;

  const canSubmit =
    values.email.trim().length > 0 &&
    values.password.length > 0 &&
    !passwordMismatch &&
    !invalid &&
    (mode === "sign-in" || values.confirmPassword.length > 0);

  const resetStatus = React.useCallback(() => {
    if (status.is === "fail") {
      setStatus({ is: "idle" });
    }
  }, [status.is]);

  const switchMode = React.useCallback(() => {
    resetStatus();
    setMode((prev) => (prev === "sign-in" ? "register" : "sign-in"));
    set({ confirmPassword: "" });
  }, [resetStatus, set]);

  const submit = React.useCallback(async () => {
    if (!canSubmit || status.is === "busy") return;

    setStatus({ is: "busy" });

    const result =
      mode === "sign-in"
        ? await logInWithCredentialsAct({
            email: values.email.trim(),
            password: values.password,
          })
        : await registerWithCredentialsAct({
            email: values.email.trim(),
            password: values.password,
          });

    if (result.is === "ok") {
      onSuccess?.();
      return;
    }

    setStatus({ is: "fail", error: result.error });
  }, [canSubmit, mode, onSuccess, status.is, values]);

  return {
    mode,
    setMode,
    status,
    values,
    result,
    touched,
    inject,
    set,
    canSubmit,
    passwordMismatch,
    resetStatus,
    switchMode,
    submit,
  };
};

export type { AuthMode, SubmitState, FormValues };
export { useAuthCredentialsForm };
