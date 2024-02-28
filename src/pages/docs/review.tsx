import { Button } from 'design-system/button';
import { Field } from 'design-system/field';
import React from 'react';
import { BiRightArrow, BiLeftArrow, BiSearch } from 'react-icons/bi';

const DocsReviewPage = () => {
  return (
    <div className=" grid items-start h-screen bg-gray-100">
      <main className=" mt-16 mx-8 ">
        <Navigation />
        <ArticleList />
        <Pagination />
      </main>
    </div>
  );
};

export default DocsReviewPage;

function Navigation() {
  return (
    <div className="flex  gap-4 items-end">
      <Search />
      <Filters />
    </div>
  );
}

function Search() {
  return (
    <div>
      <Field label="Search for an article">
        <div className="flex gap-4">
          <input
            type="text"
            className="outline-none px-4 py-2 border-2 focus:border-blue-500  border-gray-300 rounded-lg w-80"
          />
          <Button auto type="button" i={2} s={2} title="Go to previous page">
            <BiSearch />
          </Button>
        </div>
      </Field>
    </div>
  );
}

function Filters() {
  return (
    <div className="w-52 relative">
      <span className="absolute top-1/2 right-0 transform -translate-x-1/2 -translate-y-1/2">
        🔽
      </span>
      <select className="appearance-none w-full text-base px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 ">
        <option value={`public`}>Public</option>
        <option value={`accepted`}>Accepted</option>
        <option value={`review`}>To Review</option>
      </select>
    </div>
  );
}

function Pagination() {
  return (
    <div className="flex gap-8">
      <Button type="button" i={2} s={2} title="Go to previous page">
        <BiLeftArrow />
      </Button>
      <Button type="button" i={2} s={2} title="Go to next page">
        <BiRightArrow />
      </Button>
    </div>
  );
}

function ArticleList() {
  return (
    <ul className=" p-4 border-4 border-blue-500 rounded-lg my-8 flex flex-col gap-4">
      <ArticleListitem />
      <ArticleListitem />
    </ul>
  );
}

function ArticleListitem() {
  return <li className=" pb-2 border-b-2 border-black">Siema</li>;
}
