import React, { useState } from 'react';
import ArticleList from 'components/article-list';
import Pagination from 'components/pagination';
import Navigation from 'components/navigation';

const DocsReviewPage = () => {
  const [articleInfo, setArticleInfo] = useState([]);

  function handleArticleInfo(query, filter) {
    console.log(query, filter);
  }

  return (
    <div className=" grid items-start h-screen bg-gray-100">
      <main className=" mt-16 mx-8 ">
        <Navigation handleArticleInfo={handleArticleInfo} />
        <ArticleList />
        <Pagination />
      </main>
    </div>
  );
};

export default DocsReviewPage;
