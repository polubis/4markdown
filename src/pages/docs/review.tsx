import React, { useState } from 'react';
import ArticleList from 'components/article-list';
import Pagination from 'components/pagination';
import ArticleForm from 'components/article-form';
import WelcomeMessage from 'components/welcome-message';

const DocsReviewPage = () => {
  const [query, setQuery] = useState(``);
  const [articleFilter, setArticleFilter] = useState(`public`);
  const [limit, setLimit] = useState(10);
  const [articleInfo, setArticleInfo] = useState(
    Array.from({ length: 100 }, (_, i) => i + 1),
  );

  return (
    <div className=" grid items-start h-screen bg-gray-100">
      <main className="mt-16 mx-8">
        <ArticleForm
          query={query}
          setQuery={setQuery}
          articleFilter={articleFilter}
          setArticleFilter={setArticleFilter}
          limit={+limit}
          setLimit={setLimit}
        />
        {articleInfo.length > 0 ? (
          <>
            <ArticleList />
            <Pagination limit={+limit} articleInfoCount={articleInfo.length} />
          </>
        ) : (
          <WelcomeMessage msg={`Start by searching for an article! 📰`} />
        )}
      </main>
    </div>
  );
};

export default DocsReviewPage;
