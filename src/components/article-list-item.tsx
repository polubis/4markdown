import React from 'react';

function ArticleListitem({ articleData }) {
  return (
    <li className=" pb-2 border-b-2 border-black">
      <h3 className="bold text-xl">{articleData.name}</h3>
      <p className="text-lg">{articleData.description}</p>
    </li>
  );
}

export default ArticleListitem;
