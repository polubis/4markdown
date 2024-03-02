import React from 'react';
import ArticleListitem from './article-list-item';

function ArticleList() {
  return (
    <ul className=" p-4 border-4 border-blue-500 rounded-lg my-8 flex flex-col gap-4">
      <ArticleListitem />
      <ArticleListitem />
    </ul>
  );
}

export default ArticleList;
