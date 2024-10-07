import type { Tags } from 'api-4markdown-contracts';
import { Badge } from 'design-system/badge';
import { Badges } from 'design-system/badges';
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
      <Badges>
        {tags.map((tag) => (
          <Link key={tag} to={`${meta.routes.docs.educationZone}${tag}/`}>
            <Badge>{tag}</Badge>
          </Link>
        ))}
      </Badges>
    </div>
  );
};

export { EducationTopTags };
