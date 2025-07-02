import React from "react";
import { useDocManagementStore } from "store/doc-management/doc-management.store";
import { Modal } from "design-system/modal";
import { createDocumentAct } from "acts/create-document.act";
import { startConversationAction } from "store/document-generation/actions";
import {
	NewDocumentForm,
	type NewDocumentFormProps,
} from "components/new-document-form";
import { useDocumentGenerationState } from "store/document-generation";
import { useYourAccountState } from "store/your-account";
import { hasTokensForFeatureSelector } from "store/your-account/selectors";
import { AI_CONTENT_GENERATION_TOKEN_COST } from "core/consts";
import { AIPolicyDisclaimer } from "components/ai-policy-disclaimer";

type CreateDocumentModalContainerProps = {
	onClose(): void;
};

const MAX_AI_GENERATION_COUNT = 3;

const CreateDocumentModalContainer = ({
	onClose,
}: CreateDocumentModalContainerProps) => {
	const [activeType, setActiveType] = React.useState<`ai` | `manual` | `none`>(
		`none`,
	);
	const { conversations } = useDocumentGenerationState();
	const docManagementStore = useDocManagementStore();
	const hasTokens = useYourAccountState(
		hasTokensForFeatureSelector(AI_CONTENT_GENERATION_TOKEN_COST),
	);

	const submitManualDocumentCreation: Extract<
		NewDocumentFormProps,
		{ variant: `manual` }
	>["onSubmit"] = async (values) => {
		(await createDocumentAct(values)).is === `ok` && onClose();
	};

	const submitAIDocumentCreation: Extract<
		NewDocumentFormProps,
		{ variant: `ai` }
	>["onSubmit"] = async (values) => {
		startConversationAction({
			...values,
			style: values.style.split(`,`),
		});

		onClose();
	};

	const isMaxAIGenerationReached =
		conversations.length >= MAX_AI_GENERATION_COUNT;

	return (
		<Modal disabled={docManagementStore.is === `busy`} onClose={onClose}>
			<Modal.Header
				title="Create Document"
				closeButtonTitle="Close document adding"
			/>

			{activeType === `none` && (
				<>
					<section className="flex flex-col gap-3">
						<button
							className="flex flex-col cursor-pointer hover:bg-zinc-300 dark:hover:bg-gray-900 p-3 rounded-md bg-zinc-200 border dark:bg-gray-950 border-zinc-300 dark:border-zinc-800"
							onClick={() => setActiveType(`manual`)}
							title="Go to manual document creation form"
						>
							<h6 className="capitalize text-left">Setup Things Manually</h6>
							<p className="mt-1 text-sm text-left">
								Adding document by providing its name
							</p>
						</button>
						<button
							className="disabled:bg-neutral-300/90 disabled:text-black/50 dark:disabled:bg-gray-900/20 dark:disabled:text-white/50 disabled:cursor-not-allowed flex flex-col cursor-pointer enabled:hover:bg-zinc-300 dark:enabled:hover:bg-gray-900 p-3 rounded-md bg-zinc-200 border dark:bg-gray-950 border-zinc-300 dark:border-zinc-800"
							onClick={() => setActiveType(`ai`)}
							disabled={isMaxAIGenerationReached || !hasTokens}
							title="Go to AI generation form"
						>
							<h6 className="capitalize text-left">Generate With AI</h6>

							{hasTokens || (
								<p className="mt-1 text-sm text-left">
									You don&apos;t have enough tokens to generate document
								</p>
							)}

							{isMaxAIGenerationReached && (
								<p className="mt-1 text-sm text-left">
									You&apos;ve reached the maximum parallel number of AI
									generations ({conversations.length}/{MAX_AI_GENERATION_COUNT})
								</p>
							)}

							{!isMaxAIGenerationReached && hasTokens && (
								<p className="mt-1 text-sm text-left">
									Use AI to generate document. Provide structure, metadata and
									voilà!
								</p>
							)}
						</button>
					</section>
				</>
			)}

			{activeType === `ai` && (
				<AIPolicyDisclaimer onCancel={() => setActiveType(`none`)}>
					<NewDocumentForm
						variant={activeType}
						disabled={docManagementStore.is === `busy`}
						onSubmit={submitAIDocumentCreation}
						onBack={() => setActiveType(`none`)}
					/>
				</AIPolicyDisclaimer>
			)}

			{activeType === `manual` && (
				<NewDocumentForm
					variant={activeType}
					disabled={docManagementStore.is === `busy`}
					onSubmit={submitManualDocumentCreation}
					onBack={() => setActiveType(`none`)}
				/>
			)}
		</Modal>
	);
};

export { CreateDocumentModalContainer };
