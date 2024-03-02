import React, { useState } from 'react';
import { Field } from 'design-system/field';

function Search() {
  const [query, setQuery] = useState(``);

  return (
    <div>
      <Field label="Search for an article">
        <div className="flex gap-4">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            type="text"
            className="outline-none px-4 py-2 border-2 focus:border-blue-500  border-gray-300 rounded-lg w-80"
          />
        </div>
      </Field>
    </div>
  );
}

export default Search;
