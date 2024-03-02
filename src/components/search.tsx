import React from 'react';
import { BiSearch } from 'react-icons/bi';
import { Button } from 'design-system/button';
import { Field } from 'design-system/field';

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

export default Search;
