import { Button } from "design-system/button";
import { Field } from "design-system/field";
import { Input } from "design-system/input";
import { Textarea } from "design-system/textarea";
import { useForm } from "development-kit/use-form";
import React from "react";
import { ValidatorFn, ValidatorsSetup } from "development-kit/form";
import { changeViewAction } from "../store/actions";
import { BiSave } from "react-icons/bi";
import { createAccessGroupAct } from "../acts/create-access-group.act";
import { useAct } from "core/act";
import { useAccessGroupsManagementStore } from "../store";
import { editAccessGroupAct } from "../acts/edit-access-group.act";

const validationLimits = {
  name: {
    min: 2,
    max: 100,
  },
  description: {
    min: 10,
    max: 500,
  },
} as const;

const groupNameValidator: ValidatorFn<string, string> = (value: string) => {
  const trimmed = value.trim();

  if (trimmed.length < validationLimits.name.min) {
    return `Group name must be at least ${validationLimits.name.min} characters long`;
  }

  if (trimmed.length > validationLimits.name.max) {
    return `Group name must be at most ${validationLimits.name.max} characters long`;
  }

  if (!/^[ a-zA-Z0-9_-]+$/.test(trimmed)) {
    return `Group name can only contain letters, spaces, numbers, underscores, and dashes`;
  }

  return null;
};

const groupDescriptionValidator: ValidatorFn<string, string> = (
  value: string,
) => {
  const trimmed = value.trim();

  if (trimmed.length === 0) {
    return null;
  }

  if (trimmed.length < validationLimits.description.min) {
    return `Group description must be at least ${validationLimits.description.min} characters long`;
  }

  if (trimmed.length > validationLimits.description.max) {
    return `Group description must be at most ${validationLimits.description.max} characters long`;
  }

  return null;
};

type FormValues = {
  name: string;
  description: string;
};

const validators: ValidatorsSetup<FormValues> = {
  name: [groupNameValidator],
  description: [groupDescriptionValidator],
};

const AccessGroupFormContainer = () => {
  const accessGroupToEdit =
    useAccessGroupsManagementStore.use.accessGroupToEdit();
  const [{ invalid, values, untouched, result }, { inject }] =
    useForm<FormValues>(
      accessGroupToEdit
        ? {
            name: accessGroupToEdit.name,
            description: accessGroupToEdit.description || "",
          }
        : {
            name: "",
            description: "",
          },
      validators,
    );

  const { name, description } = values;

  const [, { busy }, start] = useAct({
    onOk: () => changeViewAction("list"),
  });

  const handleSubmit = () => {
    start(() =>
      accessGroupToEdit
        ? editAccessGroupAct({
            name,
            description: description || null,
            id: accessGroupToEdit.id,
          })
        : createAccessGroupAct({
            name,
            description: description || null,
          }),
    );
  };

  return (
    <div className="max-w-md w-full m-auto animate-fade-in">
      <header className="mb-5">
        {accessGroupToEdit ? (
          <h1 className="text-2xl font-bold mb-1.5">
            Edit Group "{accessGroupToEdit.name}"
          </h1>
        ) : (
          <h1 className="text-2xl font-bold mb-1.5">Create New Group</h1>
        )}
        <p className="text-sm">
          You'll be able to manage access to your created content. After this
          step you can add users to the group.
        </p>
      </header>
      <section className="space-y-4">
        <div className="space-y-4">
          <Field
            label={`Group Name (${name.length})*`}
            hint={
              result.name ? (
                <Field.Error>{result.name}</Field.Error>
              ) : (
                <Field.Hint>
                  {validationLimits.name.min}-{validationLimits.name.max}{" "}
                  characters. Only letters, numbers, underscores, and dashes
                  allowed.
                </Field.Hint>
              )
            }
          >
            <Input
              autoFocus
              placeholder="Enter group name"
              {...inject("name")}
            />
          </Field>

          <Field
            label={`Group Description (${description.length})`}
            hint={
              result.description ? (
                <Field.Error>{result.description}</Field.Error>
              ) : (
                <Field.Hint>
                  Optional. {validationLimits.description.min}-
                  {validationLimits.description.max} characters if provided.
                </Field.Hint>
              )
            }
          >
            <Textarea
              placeholder="Enter group description (optional)"
              {...inject("description")}
              rows={3}
            />
          </Field>
        </div>

        <div className="flex space-x-3 pt-4">
          <Button
            i={1}
            s={2}
            className="flex-1"
            auto
            title={`Cancel group ${accessGroupToEdit ? "update" : "creation"}`}
            disabled={busy}
            onClick={() => changeViewAction("list")}
          >
            Cancel
          </Button>
          <Button
            i={2}
            s={2}
            auto
            className="flex-1"
            disabled={busy || invalid || untouched}
            onClick={handleSubmit}
            title={`Confirm group ${accessGroupToEdit ? "update" : "creation"}`}
          >
            <BiSave />
            Confirm
          </Button>
        </div>
      </section>
    </div>
  );
};

export { AccessGroupFormContainer };
