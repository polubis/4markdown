import type { Tags } from 'api-4markdown-contracts';
import { Link } from 'gatsby';
import React from 'react';
import { meta } from '../../meta';

type EducationTopTagsProps = {
  className?: string;
  tags: Tags;
};

const EducationTopTags = ({ className, tags }: EducationTopTagsProps) => {
  return (
    <div className={className}>
      <h2 className="text-xl pb-4">Top Tags</h2>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Link
          // @TODO[PRIO=2]: [Why ! is required?].
            activeClassName="!bg-gray-400/60 !dark:bg-slate-800/60"
            key={tag}
            className="focus:outline dark:outline-2 outline-2.5 outline-black dark:outline-white rounded-md text-sm uppercase font-medium bg-slate-200 dark:bg-slate-800 dark:text-white text-black py-1 px-3"
            to={`${meta.routes.docs.educationZone}${tag}/`}
          >
            {tag}
          </Link>
        ))}
      </div>
    </div>
  );
};

export { EducationTopTags };
