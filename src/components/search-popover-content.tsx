import { searchStaticContentAct } from "acts/search-static-content.act";
import type { ParsedError } from "api-4markdown-contracts";
import { Input } from "design-system/input";
import { Modal } from "design-system/modal";
import { navigate } from "gatsby";
import type { SearchDataItem } from "models/pages-data";
import React from "react";

type SearchPopoverContentProps = {
	onClose(): void;
};

let searchDataCache: { is: `idle` } | { is: `ok`; data: SearchDataItem[] } = {
	is: `idle`,
};

type LoadState =
	| { is: `busy` }
	| { is: `ok`; data: SearchDataItem[] }
	| { is: `fail`; error: ParsedError };

const SearchPopoverContent = ({ onClose }: SearchPopoverContentProps) => {
	const [search, setSearch] = React.useState(``);
	const [searchData, setSearchData] = React.useState<LoadState>(() =>
		searchDataCache.is === `idle`
			? {
					is: `busy`,
				}
			: searchDataCache,
	);

	React.useEffect(() => {
		const loadSearchData = async () => {
			const result = await searchStaticContentAct();

			if (result.is === `ok`) {
				searchDataCache = { is: `ok`, data: result.data };
			}

			setSearchData(result);
		};

		searchDataCache.is === `idle` && loadSearchData();
	}, []);

	const filteredData = React.useMemo(() => {
		const query = search.trim();

		if (searchData.is !== `ok` || query.length === 0) return [];

		return searchData.data.filter(
			(item) =>
				item.title.toLowerCase().includes(query.toLowerCase()) ||
				(item.description &&
					item.description.toLowerCase().includes(query.toLowerCase())) ||
				item.url.toLowerCase().includes(query.toLowerCase()),
		);
	}, [search, searchData]);

	return (
		<Modal disabled={searchData.is === `busy`} onClose={onClose}>
			<Modal.Header title="Find Anything" closeButtonTitle="Close search" />

			<Input
				placeholder="Search by title, description or URL"
				value={search}
				onChange={(e) => setSearch(e.target.value)}
			/>

			{searchData.is === `ok` && filteredData.length > 0 && (
				<ul className="mt-4 flex flex-col space-y-3">
					{filteredData.map((result, index) => (
						<li
							key={index}
							className={`flex flex-col cursor-pointer border-2 rounded-lg px-4 py-3 bg-zinc-200 dark:hover:bg-gray-900 dark:bg-gray-950 hover:bg-zinc-300 border-zinc-300 dark:border-zinc-800`}
							onClick={() => navigate(result.url)}
						>
							<h6>{result.title}</h6>
							{result.description && (
								<p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-4 mt-2">
									{result.description}
								</p>
							)}
							<p className="text-sm mt-1">{result.url}</p>
						</li>
					))}
				</ul>
			)}

			{searchData.is === `fail` && (
				<p className="text-xl text-red-600 dark:text-red-400 text-center mt-4">
					Something went wrong, please try again
				</p>
			)}
		</Modal>
	);
};

export { SearchPopoverContent };
