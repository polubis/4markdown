import React from 'react';
import Markdown from './markdown';
import { Tags } from 'models/general';
import { Badges } from 'design-system/badges';
import { Badge } from 'design-system/badge';
import { Avatar } from 'design-system/avatar';
import { UserSocials } from './user-socials';

interface DocumentLayoutProps {
  children: string;
  tags: Tags;
}

const DocumentLayout = ({ children, tags }: DocumentLayoutProps) => {
  return (
    <main className="max-w-4xl p-4 my-6 mx-auto relative">
      {tags.length > 0 && (
        <Badges className="mb-4">
          {tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </Badges>
      )}
      <Markdown>{children}</Markdown>
      <section className="mt-10">
        <div className="flex max-w-xl space-x-5 ml-auto rounded-lg">
          <Avatar
            className="shrink-0 bg-gray-300 dark:bg-slate-800"
            size="md"
            src=""
            alt="User avatar"
            char="A"
          />
          <div className="flex flex-col">
            <i>About Author</i>
            <strong className="mb-1 text-black dark:text-white">
              tom_riddle
            </strong>
            <p>
              dasd asddadas sadd sada asdsad asdsad asdsa sad sadadsa sadsa
              sadsad sad d asdsa sads adsa d asdsadsads adsdasa asd saasd asdsa
              asd
            </p>
            <div className="flex space-x-2 mt-2">
              <UserSocials
                githubUrl="dsad"
                linkedInUrl="dasd"
                blogUrl="dasd"
                twitterUrl="dasd"
                fbUrl="dasd"
                createTitle={(title) => `Author ${title}`}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export { DocumentLayout };
