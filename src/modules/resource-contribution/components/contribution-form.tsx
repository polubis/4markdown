import React from "react";
import { Button } from "design-system/button";
import { Field } from "design-system/field";
import { Textarea } from "design-system/textarea";
import { BiErrorAlt } from "react-icons/bi";
import { ContributionExclaimer } from "./contribution-exclaimer";
import type { ResourceContributionInput } from "../models";

const CONTENT_MIN_LENGTH = 10;

type ContributionFormProps = {
  input: ResourceContributionInput;
  proposedContent: string;
  onProposedContentChange: (value: string) => void;
  onSubmit: () => void;
  /** When set, the primary button becomes "Review changes" and calls this instead of onSubmit. */
  onReviewChanges?: () => void;
  isSubmitting: boolean;
  submitError: string | null;
  showExclaimer?: boolean;
};

const ContributionForm = ({
  input,
  proposedContent,
  onProposedContentChange,
  onSubmit,
  onReviewChanges,
  isSubmitting,
  submitError,
  showExclaimer = false,
}: ContributionFormProps) => {
  const trimmed = proposedContent.trim();
  const invalid = trimmed.length < CONTENT_MIN_LENGTH;
  const untouched = trimmed === input.currentContent.trim();
  const isReviewMode = typeof onReviewChanges === "function";

  return (
    <div className="flex flex-col gap-4">
      <Field
        label={
          proposedContent.length === 0
            ? "Your improved content*"
            : `Your improved content (${proposedContent.length} chars)*`
        }
        hint={
          trimmed.length > 0 && trimmed.length < CONTENT_MIN_LENGTH ? (
            <Field.Error>
              Content must be at least {CONTENT_MIN_LENGTH} characters
            </Field.Error>
          ) : (
            <Field.Hint>
              Edit the content above and submit. Min {CONTENT_MIN_LENGTH}{" "}
              characters.
            </Field.Hint>
          )
        }
      >
        <Textarea
          placeholder="Paste or edit the article content with your improvements..."
          rows={12}
          className="font-mono text-sm"
          value={proposedContent}
          onChange={(e) => onProposedContentChange(e.target.value)}
        />
      </Field>

      {showExclaimer && <ContributionExclaimer className="mt-2" />}

      {submitError && (
        <p className="flex gap-2 text-sm items-center bg-red-300 dark:bg-red-700 p-2 rounded-md">
          <BiErrorAlt className="shrink-0" size={20} />
          {submitError}
        </p>
      )}

      <div className="flex gap-2 justify-end mt-2">
        <Button
          i={2}
          s={2}
          auto
          disabled={invalid || untouched || isSubmitting}
          title={isReviewMode ? "Review changes before sending" : "Submit contribution"}
          onClick={isReviewMode ? onReviewChanges : onSubmit}
        >
          {isSubmitting
            ? "Submitting…"
            : isReviewMode
              ? "Review changes"
              : "Submit contribution"}
        </Button>
      </div>
    </div>
  );
};

export { ContributionForm, CONTENT_MIN_LENGTH };
