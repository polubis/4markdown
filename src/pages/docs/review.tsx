import React, { useState, useEffect } from 'react';
import ArticleList from 'components/article-list';
import Pagination from 'components/pagination';
import ArticleForm from 'components/article-form';
import WelcomeMessage from 'components/welcome-message';
import { mock } from 'development-kit/mock';
import { Transaction } from 'models/transaction';
import { parseError } from 'development-kit/parse-error';
import Loader from 'components/loader';
import ErrorModal from 'components/error-modal';

interface Payload {
  query: string; // search string
  limit: number; // 10 25 50 100
  page: number; // 1...n
  status: 'public' | 'accepted' | 'review';
}

interface Response {
  id: number;
  name: string;
  description: string;
  status: 'public' | 'permanent' | 'accepted';
  accepted: boolean;
}

const initPayload = (): Payload => ({
  query: '',
  status: 'public',
  limit: 10,
  page: 1,
});

const DocsReviewPage = () => {
  const [payload, setPayload] = useState(initPayload);
  const { query, status, limit, page } = payload;

  const [response, setResponse] = useState<Transaction<{ data: Response[] }>>({
    is: `idle`,
  });

  useEffect(() => {
    const handleLoad = async () => {
      setResponse({ is: `busy` });

      const config = mock({
        delay: 10,
        errorFactor: 100,
      });

      const getData = config<Response[]>(
        Array.from({ length: 50 }, (curr, i) => ({
          id: i + 1,
          name: ` ${i + 1}. Lorem Ipsum is simply dummy text`,
          description: `It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution`,
          status: `public`,
          accepted: true,
        })),
      );
      try {
        const data = await getData<Payload>({
          query,
          limit,
          status,
          page,
        });

        setResponse({ is: `ok`, data });
      } catch (error) {
        setResponse({ is: `fail`, error: parseError(error) });
      }
    };

    handleLoad();
  }, [payload]);

  useEffect(() => {
    console.log(response.is);
  }, [response]);

  useEffect(() => {
    setPayload((payload) => ({ ...payload, page: 1 }));
  }, [query, status, limit]);

  function reset() {
    setPayload(initPayload());
    setResponse({ is: `idle` });
  }

  const changeFilters = (newPayload: Partial<Payload> = {}): void => {
    setPayload((payload) => ({ ...payload, page: 1, ...newPayload }));
  };

  return (
    <div className=" grid items-start  bg-gray-100">
      <main className="mt-16 mx-8">
        <ArticleForm
          query={query}
          onQueryChange={changeFilters}
          status={status}
          limit={+limit}
        />
        {response.data?.length > 0 && (
          <>
            <ArticleList articlesData={response.data} />
            <Pagination
              page={page}
              onPageChange={changeFilters}
              limit={+limit}
              responseCount={response.data.length}
            />
          </>
        )}
        {response.is === `busy` && <Loader />}
        {response.is === `idle` && (
          <WelcomeMessage msg={`Start by searching for an article! 📰`} />
        )}
        {response.is === `fail` && (
          <ErrorModal
            heading={response.error}
            message="Try to search for the articles once again"
            onClose={reset}
          />
        )}
      </main>
    </div>
  );
};

export default DocsReviewPage;
