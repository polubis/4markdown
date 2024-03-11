import React from 'react';
import ArticleListitem from './article-list-item';

function ArticleList({ articlesData }) {
  return (
    <ul className=" p-4 border-4 border-blue-500 rounded-lg my-8 flex flex-col gap-4">
      {articlesData &&
        articlesData.length > 0 &&
        articlesData.map((curr) => (
          <ArticleListitem key={curr.id} articleData={curr} />
        ))}
    </ul>
  );
}

export default ArticleList;
