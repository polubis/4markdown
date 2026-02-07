import { Button } from "design-system/button";
import React from "react";
import { BiLogInCircle, BiLogoGoogle, BiUserPlus } from "react-icons/bi";
import { useAuthStore } from "store/auth/auth.store";
import { useDocsStore } from "store/docs/docs.store";
import { YourAvatarContainer } from "../containers/your-avatar.container";
import { useSimpleFeature } from "@greenonsoftware/react-kit";
import { useYourUserProfileState } from "store/your-user-profile";
import { useYourAccountState } from "store/your-account";
import { useAppEvent } from "core/app-events";
import { ButtonLink } from "design-system/button-link";
import { Link } from "gatsby";
import { meta } from "../../meta";
import { Modal2 } from "design-system/modal2";
import { logInAct } from "acts/log-in.act";
import type { API4MarkdownError } from "api-4markdown-contracts";

const UserPopoverContent = React.lazy(() => import(`./user-popover-content`));

const TokensBadge = ({ tokens }: { tokens: number }) => {
  return (
    <p className="animate-fade-in text-[10px] bg-gray-300 dark:bg-slate-800 shadow-lg flex items-center justify-center size-5 rounded-full absolute -top-2 -right-2">
      <span>{tokens >= 100 ? `99+` : tokens}</span>
    </p>
  );
};

const UserPopover = () => {
  const menu = useSimpleFeature();
  const authMenu = useSimpleFeature();
  const authStore = useAuthStore();
  const docsStore = useDocsStore();
  const yourUserProfile = useYourUserProfileState();
  const yourAccount = useYourAccountState();
  const [googleState, setGoogleState] = React.useState<
    { is: "idle" } | { is: "busy" } | { is: "fail"; error: API4MarkdownError }
  >({ is: "idle" });

  useAppEvent((event) => {
    if (event.type === "SHOW_USER_PROFILE_FORM") {
      menu.on();
    }
  });

  React.useEffect(() => {
    if (authStore.is === "authorized") {
      authMenu.off();
    }
  }, [authStore.is, authMenu]);

  const startGoogleAuth = async () => {
    if (googleState.is === "busy") return;
    setGoogleState({ is: "busy" });

    const result = await logInAct();

    if (result.is === "ok") {
      authMenu.off();
      return;
    }

    setGoogleState({ is: "fail", error: result.error });
  };

  const handleClick = () => {
    if (authStore.is === `idle`) return;

    if (authStore.is === `authorized`) {
      menu.on();
      return;
    }

    authMenu.isOn ? authMenu.off() : authMenu.on();
  };

  return (
    <>
      <div className="relative">
        <Button
          i={1}
          s={2}
          className="relative"
          disabled={
            authStore.is === `idle` ||
            docsStore.is === `busy` ||
            yourUserProfile.is === `busy` ||
            yourAccount.is === `busy`
          }
          title={
            authStore.is === `authorized` ? `User Details & Options` : `Sign In`
          }
          aria-label={
            authStore.is === `authorized` ? `User Details & Options` : `Sign In`
          }
          onClick={handleClick}
        >
          {authStore.is === `authorized` && <YourAvatarContainer size="tn" />}
          {(authStore.is === `idle` || authStore.is === `unauthorized`) && (
            <BiLogInCircle />
          )}
          {yourAccount.is === `ok` && (
            <TokensBadge
              key={yourAccount.balance.tokens}
              tokens={yourAccount.balance.tokens}
            />
          )}
        </Button>
      </div>
      {menu.isOn && (
        <React.Suspense>
          <UserPopoverContent onClose={menu.off} />
        </React.Suspense>
      )}
      {authMenu.isOn && authStore.is === "unauthorized" && (
        <Modal2 onClose={authMenu.off}>
          <Modal2.Header
            title="Sign In Options"
            closeButtonTitle="Close sign in"
          />
          <Modal2.Body>
            <div className="flex flex-col gap-3">
              <ButtonLink
                to={meta.routes.auth.register}
                title="Create Account"
                className="w-full flex items-center gap-2 justify-center"
                component={(props) => (
                  <Link {...props} onClick={authMenu.off} />
                )}
              >
                <BiUserPlus />
                Create Account
              </ButtonLink>
              <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                <span className="h-px flex-1 bg-zinc-300 dark:bg-zinc-800" />
                Or
                <span className="h-px flex-1 bg-zinc-300 dark:bg-zinc-800" />
              </div>
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
              <ButtonLink
                to={meta.routes.auth.login}
                title="Sign In"
                className="w-full flex items-center gap-2 justify-center"
                component={(props) => (
                  <Link {...props} onClick={authMenu.off} />
                )}
              >
                <BiLogInCircle />
                Via Credentials
              </ButtonLink>
              {googleState.is === "fail" && (
                <output
                  className="rounded-md border border-red-300 bg-red-50 text-red-700 dark:border-red-700/60 dark:bg-red-950/40 dark:text-red-200 p-3 text-sm"
                  aria-live="polite"
                >
                  {googleState.error.message}
                </output>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400">
                By continuing, you agree to the{" "}
                <Link
                  to={meta.routes.privacyPolicy}
                  className="underline underline-offset-2 text-blue-700 dark:text-blue-400"
                  onClick={authMenu.off}
                >
                  4Markdown Policy
                </Link>
                .
              </p>
            </div>
          </Modal2.Body>
        </Modal2>
      )}
    </>
  );
};

export default UserPopover;
