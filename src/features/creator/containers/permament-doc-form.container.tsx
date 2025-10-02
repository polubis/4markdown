import { Button } from "design-system/button";
import { Field } from "design-system/field";
import { Input } from "design-system/input";
import { Textarea } from "design-system/textarea";
import { Modal2 } from "design-system/modal2";
import { useForm } from "development-kit/use-form";
import React from "react";
import { useDocManagementStore } from "store/doc-management/doc-management.store";
import { docStoreSelectors } from "store/doc/doc.store";
import { updateDocumentVisibility } from "actions/update-document-visibility.action";
import { BiInfoCircle } from "react-icons/bi";
import { Markdown } from "components/markdown";
import { ValidatorFn, ValidatorsSetup } from "development-kit/form";
import { useSimpleFeature } from "@greenonsoftware/react-kit";

type PermamentDocFormContainerProps = {
  onConfirm(): void;
  onBack(): void;
};

const md = `**Description**

Google often utilizes the content of the \`<meta>\` tag to create snippets, especially when they believe it provides a more accurate description than the page content itself.

Similarly, Facebook uses \`<meta>\` tag content for link previews when the 'og:description' tag is absent.

However, if Google opts to use the page's meta description as a snippet, it may truncate descriptions that are too long.

To avoid truncation and ensure clarity, it is recommended to keep your page descriptions between 110 and 160 characters. While Google occasionally displays longer snippets, adhering to this range is generally best.

**Google's Recommendations for Effective Descriptions**

- Be specific and concise.
- Provide an accurate summary of the page content.
- Use keywords thoughtfully without overstuffing.
- Craft unique descriptions for each page.

Based on [Ahrefs](https://ahrefs.com/) audits and articles.
`;

const createSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, ``) // Remove special characters
    .replace(/[\s_-]+/g, `-`) // Replace spaces, underscores, and multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ``); // Remove leading/trailing hyphens
};

const validationLimits = {
  name: {
    min: 1,
    max: 70,
    segmentsMin: 3,
    segmentsMax: 15,
  },
  description: {
    min: 110,
    max: 160,
  },
  tag: {
    min: 1,
    max: 40,
  },
  tags: {
    min: 1,
    max: 10,
  },
} as const;

const nameValidator: ValidatorFn<string, string> = (value: string) => {
  const trimmed = value.trim();

  if (trimmed.length < validationLimits.name.min) {
    return `Document name must be at least ${validationLimits.name.min} character`;
  }

  if (trimmed.length > validationLimits.name.max) {
    return `Document name must be fewer than ${validationLimits.name.max} characters`;
  }

  const slug = createSlug(trimmed);
  const segments = slug === `` ? [] : slug.split(`-`);

  if (segments.length < validationLimits.name.segmentsMin) {
    return `Document name must generate at least ${validationLimits.name.segmentsMin} words in the URL path`;
  }

  if (segments.length > validationLimits.name.segmentsMax) {
    return `Document name must generate no more than ${validationLimits.name.segmentsMax} words in the URL path`;
  }

  return null;
};

const descriptionValidator: ValidatorFn<string, string> = (value: string) => {
  const trimmed = value.trim();

  if (trimmed.length < validationLimits.description.min) {
    return `Description must be at least ${validationLimits.description.min} characters`;
  }

  if (trimmed.length > validationLimits.description.max) {
    return `Description must be fewer than ${validationLimits.description.max} characters`;
  }

  return null;
};

const tagsValidator: ValidatorFn<string, string> = (value: string) => {
  const trimmed = value.trim();

  if (trimmed.length === 0) {
    return `At least ${validationLimits.tags.min} tag is required`;
  }

  const tags = trimmed
    .split(`,`)
    .map((tag) => tag.trim().toLowerCase())
    .filter((tag) => tag.length > 0);

  if (tags.length < validationLimits.tags.min) {
    return `At least ${validationLimits.tags.min} tag is required`;
  }

  if (tags.length > validationLimits.tags.max) {
    return `No more than ${validationLimits.tags.max} tags are allowed`;
  }

  if (tags.length !== new Set(tags).size) {
    return `Tags contain duplicates`;
  }

  for (const tag of tags) {
    const slugifiedTag = createSlug(tag);

    if (slugifiedTag.length < validationLimits.tag.min) {
      return `Each tag must be at least ${validationLimits.tag.min} character`;
    }

    if (slugifiedTag.length > validationLimits.tag.max) {
      return `Each tag must be fewer than ${validationLimits.tag.max} characters`;
    }
  }

  return null;
};

type FormValues = {
  name: string;
  description: string;
  tags: string;
};

const validators: ValidatorsSetup<FormValues> = {
  name: [nameValidator],
  description: [descriptionValidator],
  tags: [tagsValidator],
};

const PermamentDocFormContainer = ({
  onConfirm,
  onBack,
}: PermamentDocFormContainerProps) => {
  const info = useSimpleFeature();
  const docStore = docStoreSelectors.active();
  const docManagementStore = useDocManagementStore();
  const [{ invalid, values, untouched, result }, { inject }] =
    useForm<FormValues>(
      {
        name: docStore.name,
        description:
          docStore.visibility === `permanent` ? docStore.description : ``,
        tags:
          docStore.visibility === `permanent` ? docStore.tags.join(`,`) : ``,
      },
      validators,
    );

  const { name, description, tags } = values;

  const disabled = docManagementStore.is === `busy`;

  const handleConfirm = async (): Promise<void> => {
    try {
      await updateDocumentVisibility({
        name,
        description,
        tags: tags.split(`,`),
        visibility: `permanent`,
      });
      onConfirm();
    } catch {}
  };

  const splittedTags = React.useMemo(
    () =>
      values.tags
        .split(`,`)
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0).length,
    [values.tags],
  );

  return (
    <>
      <Modal2.Header
        title="Add Required Data"
        closeButtonTitle="Close document permanent status change"
      />
      <Modal2.Body>
        {info.isOn && <Markdown>{md}</Markdown>}
        {info.isOff && (
          <>
            <Field
              label={`Name (${name.length})*`}
              hint={
                result.name ? (
                  <Field.Error>{result.name}</Field.Error>
                ) : (
                  <Field.Hint>
                    {validationLimits.name.segmentsMin}-
                    {validationLimits.name.segmentsMax} separate words, and
                    {` `}
                    {validationLimits.name.min}-{validationLimits.name.max}
                    {` `}
                    characters
                  </Field.Hint>
                )
              }
            >
              <Input
                autoFocus
                placeholder="Type document name"
                {...inject(`name`)}
              />
            </Field>
            <Field
              label={`Description (${description.length})*`}
              className="mt-3"
              hint={
                result.description ? (
                  <Field.Error>{result.description}</Field.Error>
                ) : (
                  <Field.Hint className="flex justify-between">
                    {validationLimits.description.min}-
                    {validationLimits.description.max} characters.{` `}
                    <button
                      onClick={info.toggle}
                      title="Open SEO description explanation"
                    >
                      <BiInfoCircle size={20} className="ml-3 shrink-0" />
                    </button>
                  </Field.Hint>
                )
              }
            >
              <Textarea
                placeholder="The description will be displayed in Google and under document"
                {...inject(`description`)}
              />
            </Field>
            <Field
              label={splittedTags === 0 ? `Tags*` : `Tags (${splittedTags})*`}
              className="mt-3"
              hint={
                result.tags ? (
                  <Field.Error>{result.tags}</Field.Error>
                ) : (
                  <Field.Hint>
                    Comma-separated, {validationLimits.tags.min}-
                    {validationLimits.tags.max} tags, each unique and{` `}
                    {validationLimits.tag.min}-{validationLimits.tag.max}
                    {` `}
                    characters
                  </Field.Hint>
                )
              }
            >
              <Input
                placeholder="React, ruby-on-rails, c++, c# ...etc"
                {...inject(`tags`)}
              />
            </Field>
          </>
        )}
      </Modal2.Body>
      <Modal2.Footer className="flex space-x-3 w-full">
        <Button
          i={1}
          s={2}
          className="flex-1"
          auto
          title="Back to document status confirmation"
          disabled={disabled}
          onClick={info.isOn ? info.off : onBack}
        >
          Back
        </Button>
        <Button
          i={2}
          s={2}
          auto
          className="flex-1"
          disabled={invalid || untouched || disabled}
          onClick={handleConfirm}
          title="Make document permanent"
        >
          Confirm
        </Button>
      </Modal2.Footer>
    </>
  );
};

export { PermamentDocFormContainer };
