import { Button } from "design-system/button";
import { Field } from "design-system/field";
import { Hint } from "design-system/hint";
import { Input } from "design-system/input";
import { Textarea } from "design-system/textarea";
import React, { useEffect } from "react";
import {
  BiErrorAlt,
  BiPlusCircle,
  BiSearch,
  BiUserPlus,
  BiX,
} from "react-icons/bi";
import { useResourceAccessState } from "./store";
import { removeAccessItemAction, setPhraseAction } from "./store/actions";
import { Avatar } from "design-system/avatar";
import { getResourceAccessInfoAct } from "./acts/get-resource-access-info.act";
import { findUserAct } from "./acts/find-user.act";
import { Loader } from "design-system/loader";
import { context } from "@greenonsoftware/react-kit";
import { useForm } from "development-kit/use-form";
import { type ValidatorsSetup, type ValidatorFn } from "development-kit/form";
import { Modal2 } from "design-system/modal2";

type ResourceAccessManagerModuleProps = {
  onClose(): void;
  onBack(): void;
};

const VIEW_TYPES = ["default", "group-management"];

type ViewType = (typeof VIEW_TYPES)[number];

type GroupFormValues = {
  name: string;
  description: string;
};

type UserProfile = {
  id: string;
  displayName: string;
  email: string;
  avatar?: {
    sm: { src: string };
  };
};

const limits = {
  name: {
    min: 2,
    max: 50,
  },
  description: {
    min: 10,
    max: 250,
  },
} as const;

const nameValidator: ValidatorFn<string, string> = (value: string) => {
  const trimmed = value.trim();

  if (trimmed.length < limits.name.min) {
    return `Group name must be at least ${limits.name.min} characters`;
  }

  if (trimmed.length > limits.name.max) {
    return `Group name must be fewer than ${limits.name.max} characters`;
  }

  return null;
};

const descriptionValidator: ValidatorFn<string, string> = (value: string) => {
  const trimmed = value.trim();

  // Description is optional, so only validate if not empty
  if (trimmed.length === 0) return null;

  if (trimmed.length < limits.description.min) {
    return `Description must be at least ${limits.description.min} characters`;
  }

  if (trimmed.length > limits.description.max) {
    return `Description must be fewer than ${limits.description.max} characters`;
  }

  return null;
};

const groupValidators: ValidatorsSetup<GroupFormValues> = {
  name: [nameValidator],
  description: [descriptionValidator],
};

const [LocalProvider, useLocalContext] = context(
  (props: ResourceAccessManagerModuleProps) => {
    const [view, setView] = React.useState<ViewType>("default");

    return {
      ...props,
      view,
      setView,
    };
  },
);

const DefaultContainer = () => {
  const { phrase, loading, error, busy, access } = useResourceAccessState();
  const { setView } = useLocalContext();

  const phraseValid = phrase.length >= 2 && phrase.length <= 30;

  useEffect(() => {
    getResourceAccessInfoAct();
  }, []);

  if (loading) {
    return <Loader className="mx-auto" size="lg" />;
  }

  if (error) {
    return (
      <p className="flex gap-2 text-sm justify-center items-center bg-red-300 dark:bg-red-700 p-2 rounded-md">
        <BiErrorAlt className="shrink-0" size={20} />
        {error.message}
      </p>
    );
  }

  return (
    <>
      <p className="mb-4">
        Provide <strong>Email</strong> or <strong>Display Name</strong> and{" "}
        <strong>confirm</strong> to give access to this mindmap only for
        specific users/user groups. Remember to save changes.
      </p>
      <Field
        label="Display Name/User Profile ID/Group Name/Group ID"
        hint={<Hint trigger={`Press enter to find and add`} />}
      >
        <Input
          placeholder="tom1994, rocket-developers or xyz-xds-21x-231-abc"
          onChange={(e) => setPhraseAction(e.target.value)}
          value={phrase}
          onKeyDown={(e) => {
            if (phraseValid && e.key === `Enter`) {
              findUserAct();
            }
          }}
        />
      </Field>
      <div className="mt-3 flex items-center justify-end gap-2">
        <Button
          className="w-fit"
          title="Create access group"
          auto
          disabled={busy}
          s={1}
          i={2}
          onClick={() => setView("group-management")}
        >
          Create Group <BiPlusCircle />
        </Button>
        <span>or</span>
        <Button
          className="w-fit"
          title="Add user to shared list"
          auto
          disabled={busy || !phraseValid}
          s={1}
          i={2}
          onClick={findUserAct}
        >
          Add User <BiUserPlus />
        </Button>
      </div>
      {access.length > 0 && (
        <>
          <h6 className="text-md mt-4 mb-3">Access List ({access.length})</h6>
          <div className="flex flex-wrap gap-3">
            {access.map((profile) => (
              <div
                className="relative flex-1 border-2 rounded-lg flex items-center gap-3 p-2 bg-zinc-200 dark:bg-gray-950 border-zinc-300 dark:border-zinc-800"
                key={profile.id}
              >
                <Avatar
                  size="sm"
                  alt="User avatar"
                  className="bg-gray-300 dark:bg-slate-800"
                  char={
                    profile.displayName
                      ? profile.displayName.charAt(0)
                      : undefined
                  }
                  src={profile.avatar?.sm.src}
                />
                <div className="flex flex-col items-start">
                  <Button
                    s="auto"
                    className="absolute top-1 right-1"
                    i={1}
                    auto
                    onClick={() => removeAccessItemAction(profile.id)}
                  >
                    <BiX size={24} />
                  </Button>
                  <strong className="text-sm text-left">
                    {profile.displayName}
                  </strong>

                  <span className="text-sm text-left">{profile.email}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
};

const GroupManagementContainer = () => {
  const { setView } = useLocalContext();
  const [{ invalid, values, untouched, result }, { inject }] =
    useForm<GroupFormValues>(
      {
        name: "",
        description: "",
      },
      groupValidators,
    );

  const [searchPhrase, setSearchPhrase] = React.useState("");
  const [selectedUsers, setSelectedUsers] = React.useState<UserProfile[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);

  const searchPhraseValid =
    searchPhrase.length >= 2 && searchPhrase.length <= 30;

  const handleFindUser = async () => {
    setIsSearching(true);
    try {
      await findUserAct();
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddUser = (user: UserProfile) => {
    if (!selectedUsers.some((u) => u.id === user.id)) {
      setSelectedUsers([...selectedUsers, user]);
    }
    setSearchPhrase("");
  };

  const handleRemoveUser = (userId: string) => {
    setSelectedUsers(selectedUsers.filter((u) => u.id !== userId));
  };

  const handleSubmit = () => {
    // TODO: Implement group creation logic
    console.log("Creating group:", {
      ...values,
      users: selectedUsers.map((u) => u.id),
    });
    // After successful creation, navigate back
    setView("default");
  };

  return (
    <>
      <p className="mb-4">
        Create a <strong>user group</strong> that can be granted access to
        resources together. Add users to the group and provide a descriptive
        name.
      </p>
      <div className="flex flex-col gap-3">
        <Field
          label={
            <Field.Label label="Group Name" value={values.name} required />
          }
          hint={
            result.name ? (
              <Field.Error>{result.name}</Field.Error>
            ) : (
              <Field.Hint>
                Any characters, between {limits.name.min} to {limits.name.max}{" "}
                characters
              </Field.Hint>
            )
          }
        >
          <Input
            placeholder="Frontend Team, Developers, Marketing..."
            {...inject("name")}
          />
        </Field>
        <Field
          label={
            <Field.Label
              label="Description"
              value={values.description}
              required={false}
            />
          }
          hint={
            result.description ? (
              <Field.Error>{result.description}</Field.Error>
            ) : (
              <Field.Hint>
                Optional, between {limits.description.min} to{" "}
                {limits.description.max} characters
              </Field.Hint>
            )
          }
        >
          <Textarea
            placeholder="A brief description of the group's purpose and members"
            {...inject("description")}
          />
        </Field>

        <Field
          label="Display Name/User Profile ID"
          hint={<Hint trigger="Press enter to find" />}
        >
          <Input
            placeholder="tom1994 or xyz-xds-21x-231-abc"
            onChange={(e) => setSearchPhrase(e.target.value)}
            value={searchPhrase}
            onKeyDown={(e) => {
              if (searchPhraseValid && e.key === "Enter") {
                handleFindUser();
              }
            }}
          />
        </Field>
        <div className="mt-3 flex items-center justify-end">
          <Button
            className="w-fit"
            title="Find user to add to group"
            auto
            disabled={isSearching || !searchPhraseValid}
            s={1}
            i={2}
            onClick={handleFindUser}
          >
            Add User <BiUserPlus />
          </Button>
        </div>
      </div>

      {selectedUsers.length > 0 && (
        <>
          <h6 className="text-md mt-2 mb-3">
            Selected Users ({selectedUsers.length})
          </h6>
          <div className="flex flex-wrap gap-3">
            {selectedUsers.map((profile) => (
              <div
                className="relative flex-1 border-2 rounded-lg flex items-center gap-3 p-2 bg-zinc-200 dark:bg-gray-950 border-zinc-300 dark:border-zinc-800"
                key={profile.id}
              >
                <Avatar
                  size="sm"
                  alt="User avatar"
                  className="bg-gray-300 dark:bg-slate-800"
                  char={
                    profile.displayName
                      ? profile.displayName.charAt(0)
                      : undefined
                  }
                  src={profile.avatar?.sm.src}
                />
                <div className="flex flex-col items-start">
                  <Button
                    s="auto"
                    className="absolute top-1 right-1"
                    i={1}
                    auto
                    onClick={() => handleRemoveUser(profile.id)}
                  >
                    <BiX size={24} />
                  </Button>
                  <strong className="text-sm text-left">
                    {profile.displayName}
                  </strong>
                  <span className="text-sm text-left">{profile.email}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </>
  );
};

const ResourceAccessManagerModule = () => {
  const { view, onBack, onClose } = useLocalContext();
  const { busy, loading } = useResourceAccessState();

  return (
    <Modal2 disabled={busy} onClose={onClose}>
      <Modal2.Header
        title="Manual Visibility Management"
        closeButtonTitle="Close manual visibility management"
      />
      <Modal2.Body>
        {view === "default" ? (
          <DefaultContainer />
        ) : (
          <GroupManagementContainer />
        )}
      </Modal2.Body>
      <Modal2.Footer>
        <div className="flex space-x-3 w-full">
          <Button
            className="flex-1"
            i={1}
            s={2}
            auto
            disabled={busy}
            title="Back to mindmap details"
            onClick={onBack}
          >
            Back
          </Button>
          <Button
            className="flex-1"
            i={2}
            s={2}
            disabled={busy || loading}
            auto
            title="Confirm manual visibility changes"
          >
            Save
          </Button>
        </div>
      </Modal2.Footer>
    </Modal2>
  );
};

const ConnectedResourceAccessManagerModule = (
  props: ResourceAccessManagerModuleProps,
) => (
  <LocalProvider {...props}>
    <ResourceAccessManagerModule />
  </LocalProvider>
);

export { ConnectedResourceAccessManagerModule as ResourceAccessManagerModule };
