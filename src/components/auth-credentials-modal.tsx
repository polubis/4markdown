import React from "react";
import { Modal2 } from "design-system/modal2";
import { Field } from "design-system/field";
import { Input } from "design-system/input";
import { Button } from "design-system/button";
import { useAuthCredentialsForm } from "core/use-auth-credentials-form";

type AuthCredentialsModalProps = {
  onClose(): void;
};

const AuthCredentialsModal = ({ onClose }: AuthCredentialsModalProps) => {
  const {
    mode,
    status,
    result,
    inject,
    resetStatus,
    canSubmit,
    passwordMismatch,
    submit,
    switchMode,
  } = useAuthCredentialsForm({ onSuccess: onClose });

  const withReset =
    (onChange: (event: React.ChangeEvent<HTMLInputElement>) => void) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      resetStatus();
      onChange(event);
    };

  const emailInput = inject("email");
  const passwordInput = inject("password");
  const confirmPasswordInput = inject("confirmPassword");

  return (
    <Modal2 disabled={status.is === "busy"} onClose={onClose}>
      <Modal2.Header
        title={mode === "sign-in" ? "Sign In" : "Create Account"}
        closeButtonTitle="Close Sign In"
      />
      <Modal2.Body>
        <form
          className="flex flex-col gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            submit();
          }}
        >
          {status.is === "fail" && (
            <output
              className="rounded-md border border-red-300 bg-red-50 text-red-700 dark:border-red-700/60 dark:bg-red-950/40 dark:text-red-200 p-3 text-sm"
              aria-live="polite"
            >
              {status.error.message}
            </output>
          )}
          <Field label="Email">
            <Input
              type="email"
              placeholder="you@example.com…"
              autoComplete="email"
              spellCheck={false}
              aria-label="Email"
              {...emailInput}
              onChange={withReset(emailInput.onChange)}
            />
            {result.email && <Field.Error>{result.email}</Field.Error>}
          </Field>
          <Field label={mode === "sign-in" ? "Password" : "Password (min 6)"}>
            <Input
              type="password"
              placeholder="Enter your password…"
              autoComplete={
                mode === "sign-in" ? "current-password" : "new-password"
              }
              aria-label="Password"
              {...passwordInput}
              onChange={withReset(passwordInput.onChange)}
            />
            {result.password && <Field.Error>{result.password}</Field.Error>}
          </Field>
          {mode === "register" && (
            <Field label="Confirm password">
              <Input
                type="password"
                placeholder="Repeat your password…"
                autoComplete="new-password"
                aria-label="Confirm password"
                {...confirmPasswordInput}
                onChange={withReset(confirmPasswordInput.onChange)}
              />
              {passwordMismatch && (
                <Field.Error>Passwords do not match.</Field.Error>
              )}
            </Field>
          )}
          <Button
            type="button"
            s={1}
            i={1}
            auto
            className="self-start text-sm"
            title={
              mode === "sign-in"
                ? "Switch to Create Account"
                : "Switch to Sign In"
            }
            onClick={switchMode}
          >
            {mode === "sign-in"
              ? "New Here? Create an Account"
              : "Already Have an Account? Sign In"}
          </Button>
        </form>
      </Modal2.Body>
      <Modal2.Footer className="flex gap-3">
        <Button
          i={1}
          s={2}
          auto
          className="flex-1"
          title="Cancel Sign In"
          disabled={status.is === "busy"}
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          i={2}
          s={2}
          auto
          className="flex-1"
          title={mode === "sign-in" ? "Sign in" : "Create account"}
          disabled={!canSubmit || status.is === "busy"}
          onClick={submit}
        >
          {status.is === "busy"
            ? mode === "sign-in"
              ? "Signing In…"
              : "Creating Account…"
            : mode === "sign-in"
              ? "Sign In"
              : "Create Account"}
        </Button>
      </Modal2.Footer>
    </Modal2>
  );
};

export { AuthCredentialsModal };
