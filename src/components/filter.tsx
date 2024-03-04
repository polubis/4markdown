import React from 'react';
import { Field } from 'design-system/field';
function Filter({ children, label, option, setOption }) {
  return (
    <Field label={label}>
      <div className="w-52 relative">
        <span className="absolute top-1/2 right-0 transform -translate-x-1/2 -translate-y-1/2">
          🔽
        </span>
        <select
          value={option}
          onChange={(e) => setOption(e.target.value)}
          className="appearance-none w-full text-base px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 "
        >
          {children}
        </select>
      </div>
    </Field>
  );
}

export default Filter;
