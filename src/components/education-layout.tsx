import React, { type ReactNode } from 'react';

type EducationLayoutProps = {
  title: ReactNode;
  subTitle: ReactNode;
  children: [ReactNode, ReactNode];
};

const EducationLayout = ({
  title,
  subTitle,
  children,
}: EducationLayoutProps) => {
  const [body, side] = children;

  return (
    <main className="md:flex max-w-[1280px] mx-auto relative">
      <section className="md:w-[100%] md:border-r-2 border-zinc-300 dark:border-zinc-800 py-6">
        <p className="text-sm mb-0.5 capitalize px-4 md:px-6">{subTitle}</p>
        <h1 className="text-3xl border-b-2 border-zinc-300 dark:border-zinc-800 pb-4 px-4 md:px-6 capitalize">
          {title}
        </h1>
        <div className="mx-4 md:mx-6 mt-4 md:min-h-screen flex flex-col">
          {body}
        </div>
      </section>
      <section className="md:w-[400px] border-t-2 md:border-t-0 border-zinc-300 dark:border-zinc-800">
        <div className="top-0 sticky right-0 py-6 px-4 md:px-6">{side}</div>
      </section>
    </main>
  );
};

export { EducationLayout };
