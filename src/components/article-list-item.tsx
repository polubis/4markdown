import React from 'react';

function ArticleListitem({ articleData }) {
  return (
    <li className=" pb-2 border-b-2 border-black">
      <p className="bold">{articleData.name}</p>
      <p className="italic">{articleData.description}</p>
    </li>
  );
}

export default ArticleListitem;
