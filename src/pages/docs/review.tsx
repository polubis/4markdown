import React, { useState } from 'react';
import ArticleList from 'components/article-list';
import Pagination from 'components/pagination';
import ArticleForm from 'components/article-form';

const DocsReviewPage = () => {
  const [query, setQuery] = useState(``);
  const [articleFilter, setArticleFilter] = useState(`public`);
  const [limit, setLimit] = useState(10);
  const [articleInfo, setArticleInfo] = useState([]);

  return (
    <div className=" grid items-start h-screen bg-gray-100">
      <main className=" mt-16 mx-8 ">
        <ArticleForm
          query={query}
          setQuery={setQuery}
          articleFilter={articleFilter}
          setArticleFilter={setArticleFilter}
          limit={limit}
          setLimit={setLimit}
        />
        <ArticleList />
        <Pagination />
      </main>
    </div>
  );
};

export default DocsReviewPage;
