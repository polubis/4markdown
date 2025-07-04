import { Button } from "design-system/button";
import React from "react";
import { BiLowVision, BiRefresh, BiShow, BiWorld } from "react-icons/bi";
import { docStoreActions, useDocStore } from "store/doc/doc.store";
import { type DocsStoreOkState, useDocsStore } from "store/docs/docs.store";
import c from "classnames";
import { differenceInDays, formatDistance } from "date-fns";
import { Tabs } from "design-system/tabs";
import { reloadYourDocuments } from "actions/reload-your-documents.action";
import type { API4MarkdownDto } from "api-4markdown-contracts";
import { Modal2 } from "design-system/modal2";
import { Loader } from "design-system/loader";

const rangeFilters = [`Recent`, `Old`, `Really Old`] as const;

type RangeFilter = (typeof rangeFilters)[number];

const rangeLookup: Record<RangeFilter, [number, number]> = {
	Recent: [0, 7],
	Old: [8, 30],
	"Really Old": [31, Number.MAX_VALUE],
};

const DocsListModalContainer = ({ onClose }: { onClose(): void }) => {
	const docsStore = useDocsStore();
	const docStore = useDocStore();
	const [activeRange, setActiveRange] = React.useState<RangeFilter>(
		rangeFilters[0],
	);

	const selectDoc = (
		document: API4MarkdownDto<"getYourDocuments">[number],
	): void => {
		docStoreActions.setActive(document);
		onClose();
	};

	const docs = React.useMemo((): DocsStoreOkState["docs"] => {
		if (docsStore.is !== `ok`) return [];

		const now = new Date();

		return docsStore.docs.filter((doc) => {
			const diff = differenceInDays(now, doc.mdate);
			const [from, to] = rangeLookup[activeRange];

			return diff >= from && diff <= to;
		});
	}, [docsStore, activeRange]);

	const pending = docsStore.is === `idle` || docsStore.is === `busy`;

	return (
		<Modal2 disabled={pending} onClose={onClose}>
			<Modal2.Header
				title="Your Documents"
				closeButtonTitle="Close your documents"
			>
				<Button
					type="button"
					i={2}
					s={1}
					title="Sync documents"
					disabled={pending}
					onClick={reloadYourDocuments}
				>
					<BiRefresh />
				</Button>
			</Modal2.Header>

			<Modal2.Body>
				{pending && <Loader size="xl" className="mx-auto" />}
				{docsStore.is === `fail` && (
					<p className="text-xl text-red-600 dark:text-red-400 text-center">
						Something went wrong... Try again with above button refresh button
					</p>
				)}
				{docsStore.is === `ok` && (
					<>
						{docs.length > 0 ? (
							<ul className="flex flex-col space-y-3 ">
								{docs.map((doc) => (
									<li
										className={c(
											`flex flex-col cursor-pointer border-2 rounded-lg px-4 py-3`,
											docStore.is === `active` && docStore.id === doc.id
												? `bg-green-700 text-white border-green-700`
												: `bg-zinc-200 dark:hover:bg-gray-900 dark:bg-gray-950 hover:bg-zinc-300 border-zinc-300 dark:border-zinc-800`,
										)}
										title={doc.name}
										key={doc.id}
										onClick={() => selectDoc(doc)}
									>
										<div className="flex justify-between mb-0.5">
											<span className="text-sm capitalize">
												Edited{` `}
												{formatDistance(new Date(), doc.mdate, {
													addSuffix: true,
												})}
												{` `}
												ago
											</span>
											{doc.visibility === `private` && (
												<BiLowVision
													size="20"
													title="This document is private"
												/>
											)}
											{doc.visibility === `public` && (
												<BiShow size="20" title="This document is public" />
											)}
											{doc.visibility === `permanent` && (
												<BiWorld size="20" title="This document is permanent" />
											)}
										</div>
										<strong>{doc.name}</strong>
									</li>
								))}
							</ul>
						) : (
							<h6 className="p-4 text-center">
								No documents for selected filters
							</h6>
						)}
					</>
				)}
			</Modal2.Body>
			<Modal2.Footer>
				<Tabs>
					{rangeFilters.map((range) => (
						<Tabs.Item
							key={range}
							disabled={pending}
							title={`${range} documents`}
							active={range === activeRange}
							onClick={() => setActiveRange(range)}
						>
							{range}
						</Tabs.Item>
					))}
				</Tabs>
			</Modal2.Footer>
		</Modal2>
	);
};

export { DocsListModalContainer };
