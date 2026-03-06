import React from "react";
import { Modal2 } from "design-system/modal2";
import { Markdown } from "components/markdown";
import { MarkdownDiffViewer } from "components/markdown-diff-viewer";
import { Loader } from "design-system/loader";
import { Button } from "design-system/button";
import { BiErrorAlt, BiInfoCircle } from "react-icons/bi";
import { useYourUserProfileState } from "store/your-user-profile";
import { emit } from "core/app-events";
import { useMutation2 } from "core/use-mutation-2";
import { toast } from "design-system/toast";
import type { ResourceContributionInput } from "../models";
import { submitDocumentContributionAct } from "../acts/submit-document-contribution.act";
import { submitMindmapNodeContributionAct } from "../acts/submit-mindmap-node-contribution.act";
import { ContributionForm } from "../components/contribution-form";
import { ContributionExclaimer } from "../components/contribution-exclaimer";
import { c } from "design-system/c";
import type { API4MarkdownDto } from "api-4markdown-contracts";

type ResourceContributionContainerProps = {
  input: ResourceContributionInput;
  onClose: () => void;
  onSuccess?: () => void;
};

const handleSuccess = (
  onSuccess: (() => void) | undefined,
  onClose: () => void,
) => {
  toast.success({
    title: "Contribution submitted",
    children: "Thank you! Your contribution will be reviewed.",
  });
  onSuccess?.();
  onClose();
};

type ContributionStep = "form" | "confirm";

const ResourceContributionContainer = ({
  input,
  onClose,
  onSuccess,
}: ResourceContributionContainerProps) => {
  const yourUserProfile = useYourUserProfileState();
  const [step, setStep] = React.useState<ContributionStep>("form");
  const [proposedContent, setProposedContent] = React.useState(
    input.currentContent,
  );

  const documentMutation = useMutation2<
    API4MarkdownDto<"submitDocumentContribution">
  >({
    onOk: () => handleSuccess(onSuccess, onClose),
    onFail: (error) => {
      toast.error({
        title: "Failed to submit",
        children: error.message,
      });
    },
  });

  const mindmapNodeMutation = useMutation2<
    API4MarkdownDto<"submitMindmapNodeContribution">
  >({
    onOk: () => handleSuccess(onSuccess, onClose),
    onFail: (error) => {
      toast.error({
        title: "Failed to submit",
        children: error.message,
      });
    },
  });

  const isSubmitting = documentMutation.busy || mindmapNodeMutation.busy;
  const submitError =
    documentMutation.error?.message ??
    mindmapNodeMutation.error?.message ??
    null;

  const handleSubmit = React.useCallback(() => {
    if (input.type === "document") {
      documentMutation.start(() =>
        submitDocumentContributionAct({
          documentId: input.documentId,
          currentContent: input.currentContent,
          proposedContent: proposedContent.trim(),
        }),
      );
    } else {
      mindmapNodeMutation.start(() =>
        submitMindmapNodeContributionAct({
          mindmapId: input.mindmapId,
          nodeId: input.nodeId,
          currentContent: input.currentContent,
          proposedContent: proposedContent.trim(),
        }),
      );
    }
  }, [input, proposedContent, documentMutation, mindmapNodeMutation]);

  const goToUserProfileForm = () => {
    onClose();
    emit({ type: "SHOW_USER_PROFILE_FORM" });
  };

  React.useEffect(() => {
    setProposedContent(input.currentContent);
  }, [input.currentContent]);

  React.useEffect(() => {
    setStep("form");
  }, [input.currentContent]);

  const showExclaimer = input.isCompleted === true;

  return (
    <Modal2 onClose={onClose} disabled={isSubmitting}>
      <Modal2.Header title="Contribute" closeButtonTitle="Close contribution" />
      <Modal2.Body className="flex flex-col gap-4 overflow-y-auto">
        {(yourUserProfile.is === "idle" || yourUserProfile.is === "busy") && (
          <Loader size="xl" className="m-auto" />
        )}

        {yourUserProfile.is === "fail" && (
          <p className="flex gap-2 text-sm items-center bg-red-300 dark:bg-red-700 p-2 rounded-md">
            <BiErrorAlt className="shrink-0" size={20} />
            {yourUserProfile.error.message}
          </p>
        )}

        {yourUserProfile.is === "ok" && !yourUserProfile.user && (
          <div
            className={c(
              "flex gap-2 text-sm items-start border rounded-md p-3",
              "bg-zinc-100 dark:bg-zinc-900/80 border-zinc-300 dark:border-zinc-800",
            )}
          >
            <BiInfoCircle className="shrink-0 mt-0.5" size={20} aria-hidden />
            <div className="flex flex-col gap-2">
              <p>
                You need a user profile to contribute. Create one so you can be
                credited as an author when your changes are applied.
              </p>
              <Button
                i={2}
                s={2}
                auto
                title="Create user profile"
                onClick={goToUserProfileForm}
              >
                Create profile
              </Button>
            </div>
          </div>
        )}

        {yourUserProfile.is === "ok" &&
          yourUserProfile.user &&
          step === "form" && (
            <>
              <section>
                <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
                  Current content
                </h3>
                <div className="rounded-md border border-zinc-300 dark:border-zinc-700 p-3 bg-zinc-50 dark:bg-zinc-900/50 overflow-auto max-h-48">
                  <Markdown className="text-sm">
                    {input.currentContent}
                  </Markdown>
                </div>
              </section>

              <section>
                <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
                  Your improvements
                </h3>
                <ContributionForm
                  input={input}
                  proposedContent={proposedContent}
                  onProposedContentChange={setProposedContent}
                  onSubmit={handleSubmit}
                  onReviewChanges={() => setStep("confirm")}
                  isSubmitting={isSubmitting}
                  submitError={submitError}
                  showExclaimer={showExclaimer}
                />
              </section>
            </>
          )}

        {yourUserProfile.is === "ok" &&
          yourUserProfile.user &&
          step === "confirm" && (
            <>
              <section>
                <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-2">
                  Review your changes
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
                  Confirm the diff below before sending your contribution.
                </p>
                <MarkdownDiffViewer
                  previous={input.currentContent}
                  current={proposedContent.trim()}
                  previousLabel="Current"
                  currentLabel="Your version"
                  showFullScreenButton={true}
                  modalTitle="Contribution diff"
                  className="min-h-[320px]"
                />
              </section>
              {showExclaimer && <ContributionExclaimer className="mt-2" />}
              {submitError && (
                <p className="flex gap-2 text-sm items-center bg-red-300 dark:bg-red-700 p-2 rounded-md">
                  <BiErrorAlt className="shrink-0" size={20} />
                  {submitError}
                </p>
              )}
              <div className="flex space-x-3 w-full mt-2 [&_button]:flex-1">
                <Button
                  s={2}
                  i={1}
                  auto
                  disabled={isSubmitting}
                  title="Back to editing"
                  onClick={() => setStep("form")}
                >
                  Back
                </Button>
                <Button
                  s={2}
                  i={2}
                  auto
                  disabled={isSubmitting}
                  title="Confirm and send contribution"
                  onClick={handleSubmit}
                >
                  {isSubmitting ? "Submitting…" : "Confirm and send"}
                </Button>
              </div>
            </>
          )}
      </Modal2.Body>
    </Modal2>
  );
};

export { ResourceContributionContainer };
export type { ResourceContributionContainerProps };
