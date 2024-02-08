import React from 'react';

interface DocBarRowProps {
  title: string;
  children: React.ReactNode;
}

const DocBarRow = ({ title, children }: DocBarRowProps) => {
  return (
    <>
      <h6
        className="text-xl font-bold max-w-[260px] truncate mr-4"
        title={title}
      >
        {title}
      </h6>
      <div className="flex gap-2">{children}</div>
    </>
  );
};

export { DocBarRow };
