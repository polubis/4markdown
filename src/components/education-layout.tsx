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
    <main className="flex max-w-[1280px] mx-auto relative">
      <section className="w-full border-r-2 border-zinc-300 dark:border-zinc-800 py-6">
        <p className="text-sm mb-0.5 capitalize px-4">{subTitle}</p>
        <h1 className="text-3xl border-b-2 border-zinc-300 dark:border-zinc-800 pb-4 px-4">
          {title}
        </h1>
        <div className="mx-4 mt-6">{body}</div>
      </section>
      <section className="px-6 pb-6">
        <div className="top-0 sticky right-0 pt-6">{side}</div>
      </section>
    </main>
  );
};

export { EducationLayout };
