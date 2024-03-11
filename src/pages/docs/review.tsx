import React, { useState, useEffect } from 'react';
import ArticleList from 'components/article-list';
import Pagination from 'components/pagination';
import ArticleForm from 'components/article-form';
import WelcomeMessage from 'components/welcome-message';
import { mock } from 'development-kit/mock';
import { Transaction } from 'models/transaction';
import { parseError } from 'development-kit/parse-error';
import { resolve } from 'path';

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

const DocsReviewPage = () => {
  const [query, setQuery] = useState(``);
  const [status, setStatus] = useState<Response['status']>(`public`);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [articleInfo, setArticleInfo] = useState([]);

  const [response, setResponse] = useState<Transaction<{ data: Response[] }>>({
    is: `idle`,
  });

  useEffect(() => {
    const handleLoad = async () => {
      setResponse({ is: `busy` });

      const config = mock({
        delay: 1,
      });

      const getData = config<Response[]>([
        {
          id: 1,
          name: `cos`,
          description: `dasd`,
          status: `public`,
          accepted: true,
        },
        {
          id: 2,
          name: `cos innego`,
          description: `dasd`,
          status: `public`,
          accepted: false,
        },
      ]);

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
  }, [query, limit, status, page]);

  useEffect(() => {
    console.log(response.data?.at(0));
  }, [response]);

  return (
    <div className=" grid items-start h-screen bg-gray-100">
      <main className="mt-16 mx-8">
        <ArticleForm
          query={query}
          setQuery={setQuery}
          status={status}
          setStatus={setStatus}
          limit={+limit}
          setLimit={setLimit}
        />
        {articleInfo.length > 0 ? ( /////
          <>
            <ArticleList />
            <Pagination
              page={page}
              setPage={setPage}
              limit={+limit}
              articleInfoCount={articleInfo.length} /////
            />
          </>
        ) : (
          <WelcomeMessage msg={`Start by searching for an article! 📰`} />
        )}
        <p>{response.is}</p>
        {response.data &&
          response.data.length > 0 &&
          response.data.map((curr, i) => <p key={i}>{curr.name}</p>)}
      </main>
    </div>
  );
};

export default DocsReviewPage;
