import React from 'react';
import { Modal } from 'design-system/modal';
import { Input } from 'design-system/input';
import { Loader } from 'design-system/loader';
import { navigate } from 'gatsby';
import { searchStaticContentAct } from 'acts/search-static-content.act';
import type { SearchDataItem } from 'models/pages-data';
import type { ParsedError } from 'api-4markdown-contracts';

type SearchPopoverContentProps = {
  onClose(): void;
};

type LoadState =
  | { is: `busy` }
  | { is: `ok`; data: SearchDataItem[] }
  | { is: `fail`; error: ParsedError };

const SearchPopoverContent = ({ onClose }: SearchPopoverContentProps) => {
  const [search, setSearch] = React.useState(``);
  const [searchData, setSearchData] = React.useState<LoadState>({
    is: `busy`,
  });

  React.useEffect(() => {
    const loadSearchData = async () => {
      setSearchData(await searchStaticContentAct());
    };

    loadSearchData();
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
      <Modal.Header title="Find things" closeButtonTitle="Close search" />

      {searchData.is === `busy` && (
        <Loader className="my-6 mx-auto" size="md" />
      )}

      {searchData.is === `ok` && (
        <>
          <Input
            placeholder="Search by title, description or URL"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="mt-4 overflow-auto max-h-[400px]">
            <ul className="bg-gray-100 dark:bg-gray-800 rounded-md divide-y divide-gray-200 dark:divide-gray-700">
              {filteredData.map((result, index) => (
                <li
                  key={index}
                  className="p-3 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md cursor-pointer"
                  onClick={() => navigate(result.url)}
                >
                  <div className="font-medium">{result.title}</div>
                  {result.description && (
                    <div className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mt-1">
                      {result.description}
                    </div>
                  )}
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {result.url}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      {searchData.is === `fail` && (
        <p className="mt-4 p-3 text-center text-red-500 dark:text-red-400 bg-gray-100 dark:bg-gray-800 rounded-md">
          Something went wrong... Please try again later
        </p>
      )}
    </Modal>
  );
};

export { SearchPopoverContent };
