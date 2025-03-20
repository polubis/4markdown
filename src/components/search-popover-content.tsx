import React, { type FormEventHandler } from 'react';
import { Modal } from 'design-system/modal';
import { Input } from 'design-system/input';
import { useForm } from 'development-kit/use-form';
import type { Transaction } from 'development-kit/utility-types';
import { parseError } from 'api-4markdown';
import { Loader } from 'design-system/loader';
import { navigate } from 'gatsby';

interface SearchResult {
  title: string;
  description: string;
  url: string;
}

type SearchData = {
  allData: SearchResult[];
  results: SearchResult[];
};

type SearchPopoverContentModalProps = {
  onClose(): void;
};

const SearchPopoverContent = ({ onClose }: SearchPopoverContentModalProps) => {
  const [{ values }, { inject }] = useForm<{ query: string }>({
    query: ``,
  });

  const [searchData, setSearchData] = React.useState<Transaction<SearchData>>({
    is: `idle`,
  });

  const trimmedQuery = React.useMemo(() => values.query.trim(), [values.query]);

  const filterResults = React.useCallback(
    (query: string, data: SearchResult[]): SearchResult[] => {
      if (!query) return [];

      return data.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          (item.description &&
            item.description.toLowerCase().includes(query.toLowerCase())) ||
          item.url.toLowerCase().includes(query.toLowerCase()),
      );
    },
    [],
  );

  const search = React.useCallback(
    (query: string, data: SearchResult[]): SearchResult[] => {
      return query.trim() ? filterResults(query, data) : [];
    },
    [filterResults],
  );

  React.useEffect(() => {
    setSearchData({ is: `busy` });

    fetch(`/search-data.json`)
      .then((response) => response.json())
      .then((data) => {
        setSearchData({ is: `ok`, allData: data, results: [] });
      })
      .catch((err) => {
        setSearchData({ is: `fail`, error: parseError(err) });
      });
  }, []);

  React.useEffect(() => {
    if (searchData.is === `ok`) {
      const results = search(trimmedQuery, searchData.allData);
      setSearchData({ ...searchData, results });
    }
  }, [trimmedQuery, search, searchData]);

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e): void => {
    e.preventDefault();

    if (searchData.is === `ok`) {
      const results = search(trimmedQuery, searchData.allData);
      setSearchData({ ...searchData, results });
    }
  };

  const handleClick = (url: string): void => {
    navigate(url);
    onClose();
  };

  return (
    <Modal onClose={onClose}>
      <Modal.Header
        title="Search Documentation"
        closeButtonTitle="Close search"
      />
      <form className="flex flex-col" onSubmit={handleSubmit}>
        <Input
          placeholder="Search by title, description or URL"
          {...inject(`query`)}
        />

        {(searchData.is === `idle` || searchData.is === `busy`) && (
          <Loader className="my-6 mx-auto" size="md" />
        )}

        {searchData.is === `fail` && (
          <p className="mt-4 p-3 text-center text-red-500 dark:text-red-400 bg-gray-100 dark:bg-gray-800 rounded-md">
            Something went wrong... Please try again later
          </p>
        )}

        {searchData.is === `ok` && searchData.results.length > 0 && (
          <div className="mt-4 max-h-64 overflow-y-auto">
            <ul className="bg-gray-100 dark:bg-gray-800 rounded-md divide-y divide-gray-200 dark:divide-gray-700">
              {searchData.results.map((result, index) => (
                <li
                  key={index}
                  className="p-3 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md cursor-pointer"
                  onClick={() => handleClick(result.url)}
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
        )}
      </form>
    </Modal>
  );
};

export default SearchPopoverContent;
