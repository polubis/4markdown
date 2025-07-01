import { parseError } from "api-4markdown";
import { Markdown } from "components/markdown";
import { Loader } from "design-system/loader";
import { Modal } from "design-system/modal";
import type { Transaction } from "development-kit/utility-types";
import React from "react";

type CheatSheetModalProps = {
	onClose(): void;
};

const CheatSheetModal = ({ onClose }: CheatSheetModalProps) => {
	const [cheatsheet, setCheatsheet] = React.useState<
		Transaction<{ content: string }>
	>({ is: `idle` });

	React.useEffect(() => {
		setCheatsheet({ is: `busy` });

		fetch(`/intro.md`)
			.then((response) => response.text())
			.then((content) => {
				setCheatsheet({ is: `ok`, content });
			})
			.catch((err) => {
				setCheatsheet({ is: `fail`, error: parseError(err) });
			});
	}, []);

	return (
		<Modal
			data-testid="[cheatsheet-modal]:container"
			className="[&>*]:w-[100%] [&>*]:max-w-prose"
			onClose={onClose}
		>
			<Modal.Header
				title="Markdown Cheatsheet"
				closeButtonTitle="Close markdown cheatsheet"
			/>

			{(cheatsheet.is === `idle` || cheatsheet.is === `busy`) && (
				<Loader className="my-6 mx-auto" size="xl" />
			)}
			{cheatsheet.is === `ok` && <Markdown>{cheatsheet.content}</Markdown>}
			{cheatsheet.is === `fail` && (
				<p className="text-xl text-red-600 dark:text-red-400 text-center mb-4">
					Something went wrong... Close and try again
				</p>
			)}
		</Modal>
	);
};

export { CheatSheetModal };
