import React from "react";
import { useAuthStore } from "store/auth/auth.store";
import { useYourAccountState } from "store/your-account";
import { useYourUserProfileState } from "store/your-user-profile";
import { reloadYourAccountAct } from "acts/reload-your-account.act";
import { getYourUserProfileAct } from "acts/get-your-user-profile.act";
import { reloadYourUserProfileAct } from "acts/reload-your-user-profile.act";
import {
  getApiIntegrationAct,
  mockedApiIntegration,
} from "acts/get-api-integration.act";
import { Button } from "design-system/button";
import {
  BiError,
  BiHide,
  BiInfoCircle,
  BiRefresh,
  BiShow,
  BiTrash,
} from "react-icons/bi";
import { Field } from "design-system/field";
import { Input } from "design-system/input";
import { Textarea } from "design-system/textarea";
import { Err } from "design-system/err";
import { Loader } from "design-system/loader";
import { Modal2 } from "design-system/modal2";
import { toast } from "design-system/toast";
import { Avatar } from "design-system/avatar";
import { UserSocials } from "components/user-socials";
import { RATING_ICONS } from "core/rating-config";
import { useForm } from "development-kit/use-form";
import type { ValidatorFn, ValidatorsSetup } from "development-kit/form";
import { navigate } from "gatsby";
import { meta } from "../../../meta";
import { getAPI, parseError } from "api-4markdown";
import type {
  API4MarkdownDto,
  UserProfileCommentDto,
} from "api-4markdown-contracts";

const settingsCategories = [
  {
    id: "account",
    title: "Account",
    description: "Identity and sign-in details",
  },
  {
    id: "balance",
    title: "Balance",
    description: "Tokens and refill information",
  },
  {
    id: "profile",
    title: "Your Profile",
    description: "Profile data, socials and engagement stats",
  },
  {
    id: "billing",
    title: "Billing",
    description: "Current plan and included features",
  },
  {
    id: "api",
    title: "API",
    description: "Integration endpoints, API key and usage limits",
  },
] as const;

type SettingsCategoryId = (typeof settingsCategories)[number]["id"];

const DetailRow = ({
  label,
  title,
  action,
}: {
  label: string;
  title: string;
  action?: React.ReactNode;
}) => (
  <div className="min-w-0">
    <div className="flex items-center justify-between gap-2 mb-1">
      <dt className="text-sm font-semibold uppercase tracking-wide text-pretty">
        {label}
      </dt>
      {action}
    </div>
    <dd className="text-sm break-all" title={title}>
      {title}
    </dd>
  </div>
);

const StatTile = ({
  label,
  value,
}: {
  label: React.ReactNode;
  value: string;
}) => (
  <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/50 px-3 py-2 min-w-0">
    <p className="text-xs truncate">{label}</p>
    <p className="text-lg font-semibold tabular-nums text-black dark:text-white truncate">
      {value}
    </p>
  </div>
);

const maskUid = (uid: string): string => {
  if (uid.length <= 8) return `${"*".repeat(uid.length)}`;
  return `${uid.slice(0, 2)}${"*".repeat(uid.length - 4)}${uid.slice(-2)}`;
};

const maskEmail = (email: string | null): string => {
  if (!email) return `***`;
  return email.replace(/^[^@]+/, "***");
};

const maskApiKey = (apiKey: string): string => {
  if (!apiKey) return "***";
  if (apiKey.length <= 2) return "*".repeat(apiKey.length);
  return `${apiKey[0]}${"*".repeat(apiKey.length - 2)}${apiKey[apiKey.length - 1]}`;
};

const formatUtcDate = (iso: string): string =>
  new Intl.DateTimeFormat(undefined, {
    dateStyle: `medium`,
    timeStyle: `short`,
  }).format(new Date(iso));

const formatNumber = (value: number): string =>
  new Intl.NumberFormat(undefined, {
    maximumFractionDigits: 1,
  }).format(value);

const tokenValidationLimits = {
  name: {
    min: 2,
    max: 60,
  },
  description: {
    max: 500,
  },
} as const;

type TokenFormValues = {
  name: string;
  description: string;
};

const tokenNameValidator: ValidatorFn<string, string> = (value: string) => {
  const trimmed = value.trim();

  if (trimmed.length < tokenValidationLimits.name.min) {
    return `Token name must be at least ${tokenValidationLimits.name.min} characters long`;
  }

  if (trimmed.length > tokenValidationLimits.name.max) {
    return `Token name must be at most ${tokenValidationLimits.name.max} characters long`;
  }

  if (!/^[ a-zA-Z0-9_-]+$/.test(trimmed)) {
    return "Token name can only contain letters, spaces, numbers, underscores, and dashes";
  }

  return null;
};

const tokenDescriptionValidator: ValidatorFn<string, string> = (
  value: string,
) => {
  const trimmed = value.trim();

  if (trimmed.length > tokenValidationLimits.description.max) {
    return `Token description must be at most ${tokenValidationLimits.description.max} characters long`;
  }

  return null;
};

const tokenFormValidators: ValidatorsSetup<TokenFormValues> = {
  name: [tokenNameValidator],
  description: [tokenDescriptionValidator],
};

type ApiTokenItem = {
  id: string;
  name: string;
  description: string | null;
  value: string;
  createdAt: string;
  durationDays: string;
  isVisible: boolean;
  callsUsedByEndpoint: Record<string, number>;
};

const createEndpointUsageByToken = (
  endpoints: API4MarkdownDto<"getApiIntegration">["endpoints"],
): Record<string, number> =>
  endpoints.reduce<Record<string, number>>((acc, endpoint) => {
    const endpointId = `${endpoint.method}-${endpoint.path}`;
    const simulatedUsage = Math.floor(
      Math.random() * (endpoint.dailyLimit / 3),
    );
    acc[endpointId] = simulatedUsage;
    return acc;
  }, {});

const AccountView = () => {
  const authStore = useAuthStore();
  const yourAccount = useYourAccountState();
  const yourUserProfile = useYourUserProfileState();
  const [isUidVisible, setIsUidVisible] = React.useState(false);
  const [isEmailVisible, setIsEmailVisible] = React.useState(false);
  const uidTimeoutRef = React.useRef<number | null>(null);
  const emailTimeoutRef = React.useRef<number | null>(null);
  const [activeCategoryId, setActiveCategoryId] =
    React.useState<SettingsCategoryId>("account");
  const [apiTokens, setApiTokens] = React.useState<ApiTokenItem[]>([]);
  const [isCreateTokenModalOpen, setIsCreateTokenModalOpen] =
    React.useState(false);
  const [tokenPendingDelete, setTokenPendingDelete] =
    React.useState<ApiTokenItem | null>(null);
  const [apiKeyDurationDays, setApiKeyDurationDays] = React.useState("30");
  const [apiKeyStatus, setApiKeyStatus] = React.useState<string>("");
  const [apiIntegrationState, setApiIntegrationState] = React.useState<
    | { is: "idle" | "busy" }
    | { is: "ok"; data: API4MarkdownDto<"getApiIntegration"> }
    | { is: "fail"; message: string }
  >({ is: "idle" });
  const [commentsState, setCommentsState] = React.useState<
    | { is: "idle" | "busy" }
    | { is: "ok"; comments: UserProfileCommentDto[] }
    | { is: "fail"; message: string }
  >({ is: "idle" });
  const activeCategory = settingsCategories.find(
    (category) => category.id === activeCategoryId,
  );
  const profile = yourUserProfile.is === `ok` ? yourUserProfile.user : null;
  const hasSocials =
    Boolean(profile?.githubUrl) ||
    Boolean(profile?.fbUrl) ||
    Boolean(profile?.linkedInUrl) ||
    Boolean(profile?.twitterUrl) ||
    Boolean(profile?.blogUrl);

  React.useEffect(() => {
    return () => {
      if (uidTimeoutRef.current) {
        window.clearTimeout(uidTimeoutRef.current);
      }
      if (emailTimeoutRef.current) {
        window.clearTimeout(emailTimeoutRef.current);
      }
    };
  }, []);

  React.useEffect(() => {
    if (activeCategoryId !== "profile") return;
    if (yourUserProfile.is !== "idle") return;
    getYourUserProfileAct();
  }, [activeCategoryId, yourUserProfile.is]);

  React.useEffect(() => {
    if (activeCategoryId !== "profile") return;
    if (!profile?.id) return;

    let mounted = true;
    setCommentsState({ is: "busy" });

    getAPI()
      .call("getUserProfile")({ profileId: profile.id })
      .then((response) => {
        if (!mounted) return;
        setCommentsState({ is: "ok", comments: response.comments });
      })
      .catch((error: unknown) => {
        if (!mounted) return;
        setCommentsState({ is: "fail", message: parseError(error).message });
      });

    return () => {
      mounted = false;
    };
  }, [activeCategoryId, profile?.id]);

  React.useEffect(() => {
    if (activeCategoryId !== "api") return;
    if (apiIntegrationState.is === "ok" || apiIntegrationState.is === "busy") {
      return;
    }

    let mounted = true;
    setApiIntegrationState({ is: "busy" });

    getApiIntegrationAct()
      .then((data) => {
        if (!mounted) return;
        setApiIntegrationState({ is: "ok", data });
        setApiKeyDurationDays(String(data.defaultKeyDurationDays));
      })
      .catch((error: unknown) => {
        if (!mounted) return;
        setApiIntegrationState({
          is: "fail",
          message: parseError(error).message,
        });
      });

    return () => {
      mounted = false;
    };
  }, [activeCategoryId, apiIntegrationState.is]);

  const showUidTemporarily = () => {
    setIsUidVisible(true);
    if (uidTimeoutRef.current) {
      window.clearTimeout(uidTimeoutRef.current);
    }
    uidTimeoutRef.current = window.setTimeout(() => {
      setIsUidVisible(false);
      uidTimeoutRef.current = null;
    }, 10000);
  };

  const showEmailTemporarily = () => {
    setIsEmailVisible(true);
    if (emailTimeoutRef.current) {
      window.clearTimeout(emailTimeoutRef.current);
    }
    emailTimeoutRef.current = window.setTimeout(() => {
      setIsEmailVisible(false);
      emailTimeoutRef.current = null;
    }, 10000);
  };

  const goToPublicProfile = () => {
    if (!profile?.id) return;
    navigate(`${meta.routes.userProfile.preview}?profileId=${profile.id}`);
  };

  const apiIntegrationData =
    apiIntegrationState.is === "ok"
      ? apiIntegrationState.data
      : mockedApiIntegration;

  const availableApiEndpoints = apiIntegrationData.endpoints;

  const [{ invalid, untouched, values, result }, { inject, reset }] =
    useForm<TokenFormValues>(
      {
        name: "",
        description: "",
      },
      tokenFormValidators,
    );

  const generateApiKey = () => {
    const normalizedName = values.name.trim();
    const normalizedDescription = values.description.trim();
    if (!normalizedName) return;

    const createdKey = `md_${Math.random().toString(36).slice(2, 10)}${Math.random()
      .toString(36)
      .slice(2, 10)}`;
    const tokenId = `token-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setApiTokens((prevTokens) => [
      {
        id: tokenId,
        name: normalizedName,
        description: normalizedDescription || null,
        value: createdKey,
        createdAt: new Date().toISOString(),
        durationDays: apiKeyDurationDays,
        isVisible: false,
        callsUsedByEndpoint: createEndpointUsageByToken(availableApiEndpoints),
      },
      ...prevTokens,
    ]);
    reset({
      name: "",
      description: "",
    });
    setIsCreateTokenModalOpen(false);
    setApiKeyStatus(`API key "${normalizedName}" generated.`);
    toast.success({
      title: `API token "${normalizedName}" created.`,
    });
  };

  const toggleApiTokenVisibility = (tokenId: string) => {
    setApiTokens((prevTokens) =>
      prevTokens.map((token) =>
        token.id === tokenId
          ? { ...token, isVisible: !token.isVisible }
          : token,
      ),
    );
  };

  const openCreateTokenModal = () => {
    setIsCreateTokenModalOpen(true);
  };

  const closeCreateTokenModal = () => {
    setIsCreateTokenModalOpen(false);
    reset({
      name: "",
      description: "",
    });
  };

  const removeApiToken = (tokenId: string) => {
    const tokenToRemove = apiTokens.find((token) => token.id === tokenId);
    setApiTokens((prevTokens) =>
      prevTokens.filter((token) => token.id !== tokenId),
    );
    setApiKeyStatus("API token removed.");
    toast.success({
      title: tokenToRemove
        ? `API token "${tokenToRemove.name}" removed.`
        : "API token removed.",
    });
  };

  const requestApiTokenRemoval = (token: ApiTokenItem) => {
    setTokenPendingDelete(token);
  };

  const cancelApiTokenRemoval = () => {
    setTokenPendingDelete(null);
  };

  const confirmApiTokenRemoval = () => {
    if (!tokenPendingDelete) return;
    removeApiToken(tokenPendingDelete.id);
    setTokenPendingDelete(null);
  };

  if (authStore.is === "idle") {
    return (
      <main className="flex flex-col min-h-[calc(100svh-72px)] py-10 px-4">
        <Loader data-testid="[account]:loader" className="m-auto" size="xl" />
      </main>
    );
  }

  if (authStore.is === "unauthorized") {
    return (
      <main className="flex flex-col min-h-[calc(100svh-72px)] py-10 px-4">
        <h1 className="text-2xl m-auto text-center">
          Resource Not Found at the Specified URL
        </h1>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8 min-h-[calc(100svh-72px)]">
      <div className="grid grid-cols-1 md:grid-cols-[240px_minmax(0,1fr)] gap-6 items-start">
        <aside className="self-start">
          <h1 className="text-xl font-bold mb-3">User Settings</h1>
          <nav aria-label="Account categories" className="flex flex-col gap-1">
            {settingsCategories.map((category) => {
              const isActive = category.id === activeCategoryId;
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setActiveCategoryId(category.id)}
                  className={`text-left rounded-md px-3 py-2 transition-colors ${
                    isActive
                      ? "bg-zinc-200 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100 font-semibold"
                      : "text-zinc-800 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-900"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {category.title}
                </button>
              );
            })}
          </nav>
        </aside>

        <section className="rounded-xl border border-zinc-300 dark:border-zinc-800 p-5 md:p-6">
          {activeCategoryId === "api" && (
            <div className="mb-5 rounded-lg border border-zinc-300 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/40 p-4">
              <div className="flex items-start gap-3">
                <BiInfoCircle
                  size={20}
                  className="shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <div>
                  <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    API Usage Limits Disclaimer
                  </p>
                  <p className="text-sm mt-1">
                    Request limits are assigned by your current plan. Upgrading
                    your plan may increase the allowed request volume per
                    endpoint and token.
                  </p>
                </div>
              </div>
            </div>
          )}
          <h2 className="text-2xl font-bold">{activeCategory?.title}</h2>
          <p className="mt-1 mb-5">{activeCategory?.description}</p>

          {activeCategoryId === "account" && (
            <div className="rounded-lg border border-zinc-300 dark:border-zinc-800 p-4">
              <dl className="space-y-3 text-sm">
                <DetailRow
                  label="User ID"
                  title={
                    isUidVisible
                      ? authStore.user.uid
                      : maskUid(authStore.user.uid)
                  }
                  action={
                    <Button
                      i={1}
                      s={1}
                      title={
                        isUidVisible ? "User ID visible" : "Show User ID value"
                      }
                      aria-label={
                        isUidVisible ? "User ID visible" : "Show User ID value"
                      }
                      onClick={showUidTemporarily}
                    >
                      {isUidVisible ? <BiHide /> : <BiShow />}
                    </Button>
                  }
                />
                <DetailRow
                  label="Email Address"
                  title={
                    isEmailVisible
                      ? (authStore.user.email ?? "***")
                      : maskEmail(authStore.user.email)
                  }
                  action={
                    <Button
                      i={1}
                      s={1}
                      title={
                        isEmailVisible
                          ? "Email visible"
                          : "Show Email Address value"
                      }
                      aria-label={
                        isEmailVisible
                          ? "Email visible"
                          : "Show Email Address value"
                      }
                      onClick={showEmailTemporarily}
                    >
                      {isEmailVisible ? <BiHide /> : <BiShow />}
                    </Button>
                  }
                />
              </dl>
            </div>
          )}

          {activeCategoryId === "balance" && (
            <>
              {(yourAccount.is === `idle` || yourAccount.is === `busy`) && (
                <div
                  className="rounded-md bg-gradient-to-r from-gray-300 via-zinc-200 to-gray-200 dark:from-gray-800 dark:via-zinc-800 dark:to-gray-900 animate-gradient-move bg-[length:200%_200%] h-[120px] w-full"
                  data-testid="[account]:loading"
                />
              )}

              {yourAccount.is === `ok` && (
                <div className="relative border-zinc-300 dark:border-zinc-800 rounded-lg border-2 p-4">
                  <Button
                    i={1}
                    s={1}
                    className="absolute top-2 right-2"
                    title="Resync your account"
                    aria-label="Resync your account"
                    onClick={reloadYourAccountAct}
                  >
                    <BiRefresh />
                  </Button>
                  <h3 className="font-bold text-lg mb-3">Your balance</h3>
                  <dl className="space-y-3 text-sm">
                    <DetailRow
                      label="Available Tokens"
                      title={String(yourAccount.balance.tokens)}
                    />
                    <DetailRow label="Refill Policy" title="50 tokens / 24h" />
                    <DetailRow
                      label="Status"
                      title={
                        yourAccount.balance.tokens > 0 ? "Available" : "Empty"
                      }
                    />
                  </dl>
                </div>
              )}

              {yourAccount.is === `fail` && (
                <Err className="py-4">
                  <Err.Icon>
                    <BiError size={80} />
                  </Err.Icon>
                  <Err.Title>Cannot load your account information</Err.Title>
                  <Err.Description>{yourAccount.error.message}</Err.Description>
                  <Err.Action
                    title="Retry your account load"
                    auto
                    s={2}
                    i={2}
                    onClick={reloadYourAccountAct}
                  >
                    Try again
                  </Err.Action>
                </Err>
              )}
            </>
          )}

          {activeCategoryId === "profile" && (
            <>
              {(yourUserProfile.is === `idle` ||
                yourUserProfile.is === `busy`) && (
                <div className="rounded-md bg-gradient-to-r from-gray-300 via-zinc-200 to-gray-200 dark:from-gray-800 dark:via-zinc-800 dark:to-gray-900 animate-gradient-move bg-[length:200%_200%] h-[220px] w-full" />
              )}

              {yourUserProfile.is === `ok` && profile && (
                <section className="space-y-4">
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    <div className="relative rounded-lg border border-zinc-300 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-900/30 p-5">
                      <Button
                        i={1}
                        s={1}
                        className="absolute top-2 right-2"
                        title="Sync your profile"
                        aria-label="Sync your profile"
                        onClick={reloadYourUserProfileAct}
                      >
                        <BiRefresh />
                      </Button>
                      <Avatar
                        size="lg"
                        alt="Your avatar"
                        className="bg-gray-300 dark:bg-slate-800 mx-auto"
                        char={
                          profile.displayName
                            ? profile.displayName.charAt(0)
                            : undefined
                        }
                        src={profile.avatar?.lg.src}
                      />
                      <h3 className="text-xl font-bold text-center mt-3 text-balance">
                        {profile.displayName ?? "Anonymous"}
                      </h3>
                      <p className="text-center mt-2 break-words">
                        {profile.bio?.trim() || "No bio yet"}
                      </p>
                      {hasSocials ? (
                        <div className="mt-4 flex justify-center gap-2">
                          <UserSocials
                            githubUrl={profile.githubUrl}
                            fbUrl={profile.fbUrl}
                            linkedInUrl={profile.linkedInUrl}
                            twitterUrl={profile.twitterUrl}
                            blogUrl={profile.blogUrl}
                            createTitle={(title) => `Your ${title}`}
                          />
                        </div>
                      ) : (
                        <p className="mt-4 text-sm text-center">
                          No social links added yet.
                        </p>
                      )}
                      <div className="mt-4 flex justify-center">
                        <Button
                          i={2}
                          s={1}
                          auto
                          title="Open your public profile"
                          onClick={goToPublicProfile}
                        >
                          Open Public Profile
                        </Button>
                      </div>
                    </div>

                    <div className="rounded-lg border border-zinc-300 dark:border-zinc-800 p-4">
                      <h3 className="font-bold text-lg mb-3 text-balance">
                        Profile Data
                      </h3>
                      <dl className="space-y-3 text-sm">
                        <DetailRow label="Profile ID" title={profile.id} />
                        <DetailRow
                          label="Profile URL Slug"
                          title={profile.displayNameSlug ?? "Not generated"}
                        />
                        <DetailRow
                          label="Created"
                          title={formatUtcDate(profile.cdate)}
                        />
                        <DetailRow
                          label="Last Modified"
                          title={formatUtcDate(profile.mdate)}
                        />
                      </dl>
                    </div>
                  </div>

                  <div className="rounded-lg border border-zinc-300 dark:border-zinc-800 p-4">
                    <h3 className="font-bold text-lg mb-3 text-balance">
                      Profile Stats
                    </h3>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                      <StatTile
                        label="Score Avg"
                        value={
                          typeof profile.scoreAverage === "number"
                            ? `${formatNumber(profile.scoreAverage)}/10`
                            : "—"
                        }
                      />
                      <StatTile
                        label="Score Count"
                        value={String(profile.scoreCount ?? 0)}
                      />
                      <StatTile
                        label="Comments"
                        value={
                          commentsState.is === "ok"
                            ? String(commentsState.comments.length)
                            : "—"
                        }
                      />
                      {RATING_ICONS.map(([Icon, category]) => (
                        <StatTile
                          key={category}
                          label={
                            <span className="inline-flex items-center gap-1.5">
                              <Icon aria-hidden="true" className="text-sm" />
                              <span className="capitalize">{category}</span>
                            </span>
                          }
                          value={String(profile[category] ?? 0)}
                        />
                      ))}
                    </div>
                    {commentsState.is === "fail" && (
                      <p className="mt-3 text-sm text-red-600 dark:text-red-400">
                        {commentsState.message}
                      </p>
                    )}
                  </div>
                </section>
              )}

              {yourUserProfile.is === `fail` && (
                <Err className="py-4">
                  <Err.Icon>
                    <BiError size={80} />
                  </Err.Icon>
                  <Err.Title>Cannot load your profile information</Err.Title>
                  <Err.Description>
                    {yourUserProfile.error.message}
                  </Err.Description>
                  <Err.Action
                    title="Retry your profile load"
                    auto
                    s={2}
                    i={2}
                    onClick={reloadYourUserProfileAct}
                  >
                    Try again
                  </Err.Action>
                </Err>
              )}
            </>
          )}

          {activeCategoryId === "billing" && (
            <div className="rounded-lg border border-zinc-300 dark:border-zinc-800 p-5 space-y-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold">Current Plan</h3>
                  <p className="text-sm mt-1">
                    You are currently on the free plan.
                  </p>
                </div>
                <span className="inline-flex items-center rounded-full border border-zinc-300 dark:border-zinc-700 px-3 py-1 text-sm font-semibold text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-900">
                  Free
                </span>
              </div>

              <div className="rounded-lg border border-zinc-300 dark:border-zinc-800 p-4 bg-zinc-50/70 dark:bg-zinc-900/40">
                <h4 className="font-semibold">Included in Free</h4>
                <ul className="mt-2 space-y-1 text-sm">
                  <li>Access to core 4markdown features</li>
                  <li>Standard account and profile usage</li>
                  <li>No subscription cost</li>
                </ul>
              </div>

              <p className="text-sm">
                Billing is currently disabled because all features are free.
              </p>
            </div>
          )}

          {activeCategoryId === "api" && (
            <div className="space-y-5">
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div className="min-w-0">
                  <h3 className="text-lg font-bold">API Key</h3>
                  <p className="text-sm mt-1">
                    Generate API keys, assign token details, and monitor
                    per-token request usage.
                  </p>
                </div>
                <Button
                  i={2}
                  s={1}
                  auto
                  title="Open API token creation form"
                  onClick={openCreateTokenModal}
                >
                  Create API Token
                </Button>
              </div>
              <p aria-live="polite" className="text-sm">
                {apiKeyStatus}
              </p>

              <div>
                <h4 className="font-semibold mb-1 text-balance">API Tokens</h4>
                <p className="text-sm mb-3">
                  Calls are grouped by token to help track usage per
                  integration.
                </p>
                {apiIntegrationState.is === "busy" &&
                  availableApiEndpoints.length === 0 && (
                    <div className="rounded-md bg-gradient-to-r from-gray-300 via-zinc-200 to-gray-200 dark:from-gray-800 dark:via-zinc-800 dark:to-gray-900 animate-gradient-move bg-[length:200%_200%] h-[120px] w-full" />
                  )}
                {apiIntegrationState.is === "fail" && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {apiIntegrationState.message}. Try reloading the API tab.
                  </p>
                )}
                {apiTokens.length === 0 && (
                  <p className="text-sm">No API tokens created yet.</p>
                )}
                <ul className="space-y-4">
                  {apiTokens.map((token) => (
                    <li
                      key={token.id}
                      className="rounded-md border border-zinc-200 dark:border-zinc-800 p-4 space-y-3"
                    >
                      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                        <div className="min-w-0">
                          <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                            {token.name}
                          </p>
                          {token.description && (
                            <p className="text-sm mt-1">{token.description}</p>
                          )}
                          <p className="text-xs mt-1">
                            Created: {formatUtcDate(token.createdAt)} | Limit:{" "}
                            {token.durationDays} day
                            {token.durationDays === "1" ? "" : "s"}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className="font-mono text-sm break-all text-zinc-900 dark:text-zinc-100"
                            title={token.value}
                          >
                            {token.isVisible
                              ? token.value
                              : maskApiKey(token.value)}
                          </span>
                          <Button
                            i={1}
                            s={1}
                            title={
                              token.isVisible
                                ? "Hide API key value"
                                : "Show API key value"
                            }
                            aria-label={
                              token.isVisible
                                ? "Hide API key value"
                                : "Show API key value"
                            }
                            onClick={() => toggleApiTokenVisibility(token.id)}
                          >
                            {token.isVisible ? <BiHide /> : <BiShow />}
                          </Button>
                          <Button
                            i={1}
                            s={1}
                            title={`Remove API token ${token.name}`}
                            aria-label={`Remove API token ${token.name}`}
                            onClick={() => requestApiTokenRemoval(token)}
                          >
                            <BiTrash />
                          </Button>
                        </div>
                      </div>
                      <ul className="border-t border-zinc-200 dark:border-zinc-800 divide-y divide-zinc-200 dark:divide-zinc-800">
                        {availableApiEndpoints.map((endpoint) => {
                          const endpointId = `${endpoint.method}-${endpoint.path}`;
                          const callsUsed =
                            token.callsUsedByEndpoint[endpointId] ?? 0;

                          return (
                            <li
                              key={`${token.id}-${endpointId}`}
                              className="flex flex-col gap-2 py-3 md:flex-row md:items-center md:justify-between"
                            >
                              <div className="min-w-0">
                                <p
                                  className="font-mono text-sm break-all text-zinc-900 dark:text-zinc-100"
                                  translate="no"
                                >
                                  <span className="font-bold text-emerald-700 dark:text-emerald-400 mr-2">
                                    {endpoint.method}
                                  </span>
                                  {endpoint.path}
                                </p>
                                <p className="text-sm mt-1">
                                  {endpoint.description}
                                </p>
                              </div>
                              <span className="text-sm font-semibold tabular-nums text-zinc-900 dark:text-zinc-100 shrink-0">
                                {callsUsed}/{endpoint.dailyLimit}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </li>
                  ))}
                </ul>
              </div>

              {isCreateTokenModalOpen && (
                <Modal2 onClose={closeCreateTokenModal}>
                  <Modal2.Header
                    title="Create API Token"
                    closeButtonTitle="Close token creation form"
                  />
                  <Modal2.Body>
                    <div className="space-y-4">
                      <Field
                        label={`Token Name (${values.name.length})*`}
                        hint={
                          result.name ? (
                            <Field.Error>{result.name}</Field.Error>
                          ) : (
                            <Field.Hint>
                              {tokenValidationLimits.name.min}-
                              {tokenValidationLimits.name.max} characters. Only
                              letters, numbers, spaces, underscores, and dashes.
                            </Field.Hint>
                          )
                        }
                      >
                        <Input
                          placeholder="Enter token name"
                          {...inject("name")}
                        />
                      </Field>
                      <Field
                        label={`Token Description (${values.description.length})`}
                        hint={
                          result.description ? (
                            <Field.Error>{result.description}</Field.Error>
                          ) : (
                            <Field.Hint>
                              Optional. Max{" "}
                              {tokenValidationLimits.description.max}{" "}
                              characters.
                            </Field.Hint>
                          )
                        }
                      >
                        <Textarea
                          rows={3}
                          placeholder="Enter token description (optional)"
                          {...inject("description")}
                        />
                      </Field>
                      <Field
                        label="Key Time Limit (days)"
                        hint={
                          <Field.Hint>
                            Select how long this token stays active.
                          </Field.Hint>
                        }
                      >
                        <select
                          id="api-key-duration"
                          name="api-key-duration"
                          aria-label="API key time limit in days"
                          autoComplete="off"
                          value={apiKeyDurationDays}
                          onChange={(event) =>
                            setApiKeyDurationDays(event.target.value)
                          }
                          className="w-full rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-950 px-3 py-2 text-sm text-zinc-900 dark:text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-zinc-950"
                        >
                          {apiIntegrationData.availableKeyDurationsDays.map(
                            (durationDays) => (
                              <option
                                key={durationDays}
                                value={String(durationDays)}
                              >
                                {durationDays} day
                                {durationDays === 1 ? "" : "s"}
                              </option>
                            ),
                          )}
                        </select>
                      </Field>
                    </div>
                  </Modal2.Body>
                  <Modal2.Footer className="flex gap-3">
                    <Button
                      i={1}
                      s={2}
                      className="flex-1"
                      auto
                      title="Cancel token creation"
                      onClick={closeCreateTokenModal}
                    >
                      Cancel
                    </Button>
                    <Button
                      i={2}
                      s={2}
                      className="flex-1"
                      auto
                      title="Generate API key"
                      disabled={invalid || untouched}
                      onClick={generateApiKey}
                    >
                      Create Token
                    </Button>
                  </Modal2.Footer>
                </Modal2>
              )}

              {tokenPendingDelete && (
                <Modal2 onClose={cancelApiTokenRemoval}>
                  <Modal2.Header
                    title="Remove API Token"
                    closeButtonTitle="Close token removal confirmation"
                  />
                  <Modal2.Body>
                    <p className="text-sm">
                      Are you sure you want to remove token{" "}
                      <strong>{tokenPendingDelete.name}</strong>? This action
                      cannot be undone.
                    </p>
                  </Modal2.Body>
                  <Modal2.Footer className="flex gap-3">
                    <Button
                      i={1}
                      s={2}
                      className="flex-1"
                      auto
                      title="Cancel token removal"
                      onClick={cancelApiTokenRemoval}
                    >
                      Cancel
                    </Button>
                    <Button
                      i={2}
                      s={2}
                      className="flex-1"
                      auto
                      title="Confirm token removal"
                      onClick={confirmApiTokenRemoval}
                    >
                      Remove
                    </Button>
                  </Modal2.Footer>
                </Modal2>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export { AccountView };
