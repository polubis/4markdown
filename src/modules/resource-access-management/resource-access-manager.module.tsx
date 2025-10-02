import { Button } from "design-system/button";
import { Field } from "design-system/field";
import { Hint } from "design-system/hint";
import { Input } from "design-system/input";
import React, { useEffect } from "react";
import { BiErrorAlt, BiPlusCircle, BiSearch, BiX } from "react-icons/bi";
import { useResourceAccessState } from "./store";
import { removeAccessItemAction, setPhraseAction } from "./store/actions";
import { Avatar } from "design-system/avatar";
import { getResourceAccessInfoAct } from "./acts/get-resource-access-info.act";
import { findUserAct } from "./acts/find-user.act";
import { Loader } from "design-system/loader";

const ResourceAccessManagerModule = () => {
  const { phrase, loading, error, busy, access } = useResourceAccessState();

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
        label="Email/Display Name"
        hint={<Hint trigger={`Press enter to find`} />}
      >
        <Input
          placeholder="tom@gmail.com or tom1994"
          onChange={(e) => setPhraseAction(e.target.value)}
          value={phrase}
          onKeyDown={(e) => {
            if (phraseValid && e.key === `Enter`) {
              findUserAct();
            }
          }}
        />
      </Field>
      <div className="mt-2 flex items-center justify-end gap-2">
        <Button
          className="w-fit"
          title="Add user to shared list"
          auto
          disabled={busy}
          s={1}
          i={2}
          //   onClick={findUserAct}
        >
          Create Access Group <BiPlusCircle />
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
          Find <BiSearch />
        </Button>
      </div>
      {access.length > 0 && (
        <>
          <h6 className="text-md mt-4 mb-3">
            Users With Read Access ({access.length})
          </h6>
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

export { ResourceAccessManagerModule };
