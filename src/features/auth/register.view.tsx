import React from "react";
import { Link, navigate } from "gatsby";
import { Button } from "design-system/button";
import { Field } from "design-system/field";
import { Input } from "design-system/input";
import { useAuthCredentialsForm } from "core/use-auth-credentials-form";
import { logInAct } from "acts/log-in.act";
import type { API4MarkdownError } from "api-4markdown-contracts";
import { BiLogoGoogle } from "react-icons/bi";
import { meta } from "../../../meta";
import { AppNavigation } from "components/app-navigation";
import { AppFooterContainer } from "containers/app-footer.container";
import { CreationLinkContainer } from "containers/creation-link.container";
import { EducationRankLinkContainer } from "containers/education-rank-link.container";
import { EducationZoneLinkContainer } from "containers/education-zone-link.container";

type GoogleState =
  | { is: "idle" }
  | { is: "busy" }
  | { is: "fail"; error: API4MarkdownError };

const RegisterView = () => {
  const {
    status,
    result,
    inject,
    resetStatus,
    canSubmit,
    passwordMismatch,
    submit,
    touched,
  } = useAuthCredentialsForm({
    initialMode: "register",
    onSuccess: () => navigate(meta.routes.home),
  });
  const [googleState, setGoogleState] = React.useState<GoogleState>({
    is: "idle",
  });

  const emailInput = inject("email");
  const passwordInput = inject("password");
  const confirmPasswordInput = inject("confirmPassword");

  const withReset =
    (onChange: (event: React.ChangeEvent<HTMLInputElement>) => void) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      resetStatus();
      if (googleState.is === "fail") {
        setGoogleState({ is: "idle" });
      }
      onChange(event);
    };

  const startGoogleAuth = async () => {
    if (googleState.is === "busy") return;
    setGoogleState({ is: "busy" });

    const result = await logInAct();

    if (result.is === "ok") {
      navigate(meta.routes.home);
      return;
    }

    setGoogleState({ is: "fail", error: result.error });
  };

  return (
    <>
      <AppNavigation>
        <CreationLinkContainer />
        <EducationRankLinkContainer />
        <EducationZoneLinkContainer />
      </AppNavigation>
      <main className="px-4 py-10 flex items-center justify-center min-h-[calc(100svh-72px)]">
        <section className="w-full max-w-md border border-zinc-300 dark:border-zinc-800 bg-white dark:bg-black rounded-lg overflow-hidden">
          <header className="p-6 border-b border-zinc-300 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950">
            <h1 className="text-2xl font-bold">Create Account</h1>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Create an account to save documents and manage access.
            </p>
          </header>
          <div className="p-6 flex flex-col gap-4">
            <Button
              i={2}
              s={2}
              auto
              className="w-full gap-2 justify-center"
              title="Continue with Google"
              disabled={googleState.is === "busy"}
              onClick={startGoogleAuth}
            >
              <BiLogoGoogle />
              Continue with Google
            </Button>
            {googleState.is === "fail" && (
              <output
                className="rounded-md border border-red-300 bg-red-50 text-red-700 dark:border-red-700/60 dark:bg-red-950/40 dark:text-red-200 p-3 text-sm"
                aria-live="polite"
              >
                {googleState.error.message}
              </output>
            )}
            <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
              <span className="h-px flex-1 bg-zinc-300 dark:bg-zinc-800" />
              Or Use Email
              <span className="h-px flex-1 bg-zinc-300 dark:bg-zinc-800" />
            </div>
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
              <Field
                label="Email"
                hint={
                  touched && result.email ? (
                    <Field.Error>{result.email}</Field.Error>
                  ) : (
                    <Field.Hint>Use your account email address.</Field.Hint>
                  )
                }
              >
                <Input
                  type="email"
                  placeholder="you@example.com…"
                  autoComplete="email"
                  spellCheck={false}
                  aria-label="Email"
                  {...emailInput}
                  onChange={withReset(emailInput.onChange)}
                />
              </Field>
              <Field
                label="Password"
                hint={
                  touched && result.password ? (
                    <Field.Error>{result.password}</Field.Error>
                  ) : (
                    <Field.Hint>
                      At least 8 characters, 1 number, 1 special character.
                    </Field.Hint>
                  )
                }
              >
                <Input
                  type="password"
                  placeholder="Enter your password…"
                  autoComplete="new-password"
                  aria-label="Password"
                  {...passwordInput}
                  onChange={withReset(passwordInput.onChange)}
                />
              </Field>
              <Field
                label="Confirm password"
                hint={
                  touched && passwordMismatch ? (
                    <Field.Error>Passwords do not match.</Field.Error>
                  ) : (
                    <Field.Hint>Repeat your password.</Field.Hint>
                  )
                }
              >
                <Input
                  type="password"
                  placeholder="Repeat your password…"
                  autoComplete="new-password"
                  aria-label="Confirm password"
                  {...confirmPasswordInput}
                  onChange={withReset(confirmPasswordInput.onChange)}
                />
              </Field>
              <Button
                type="submit"
                i={2}
                s={2}
                auto
                className="w-full"
                title="Create Account"
                disabled={!canSubmit || status.is === "busy"}
              >
                {status.is === "busy" ? "Creating Account…" : "Create Account"}
              </Button>
            </form>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Already have an account?{" "}
              <Link
                to={meta.routes.auth.login}
                className="underline underline-offset-2"
              >
                Sign in
              </Link>
              .
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              <span className="text-blue-700 dark:text-blue-400 font-medium">
                4Markdown Policy
              </span>
              {": "}
              <Link
                to={meta.routes.privacyPolicy}
                className="underline underline-offset-2 text-blue-700 dark:text-blue-400"
              >
                Read policy
              </Link>
              .
            </p>
          </div>
        </section>
      </main>
      <AppFooterContainer />
    </>
  );
};

export { RegisterView };
