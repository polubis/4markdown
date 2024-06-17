import React from 'react';
import Markdown from './markdown';
import { Tags } from 'models/general';
import { Badges } from 'design-system/badges';
import { Badge } from 'design-system/badge';
import { DocAuthor } from 'models/doc';
import { Avatar } from 'design-system/avatar';
import { UserSocials } from './user-socials';
import { Image } from 'design-system/image';

interface DocumentLayoutProps {
  children: string;
  tags: Tags;
  author: DocAuthor;
}

const image = {
  xl: {
    h: 320,
    w: 864,
    src: `https://images.pexels.com/photos/417173/pexels-photo-417173.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1`,
  },
  lg: {
    w: 690,
    h: 240,
    src: `https://images.pexels.com/photos/417173/pexels-photo-417173.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1`,
  },
  md: {
    w: 460,
    h: 160,
    src: `https://images.pexels.com/photos/417173/pexels-photo-417173.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1`,
  },
  sm: {
    w: 230,
    h: 80,
    src: `https://images.pexels.com/photos/417173/pexels-photo-417173.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1`,
  },
};

const DocumentLayout = ({ children, author, tags }: DocumentLayoutProps) => {
  return (
    <main className="max-w-4xl p-4 my-6 mx-auto">
      <Image
        className="mb-4 w-full h-[320px]"
        placeholder={
          <Image.Placeholder src="data:image/jpeg;base64,/9j/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wgARCAAPABQDASIAAhEBAxEB/8QAGAAAAwEBAAAAAAAAAAAAAAAAAAEDAgT/xAAVAQEBAAAAAAAAAAAAAAAAAAABAv/aAAwDAQACEAMQAAAB5FitzAYn/8QAGRAAAgMBAAAAAAAAAAAAAAAAASEAAhIR/9oACAEBAAEFAquYdkQeTQl2f//EABQRAQAAAAAAAAAAAAAAAAAAABD/2gAIAQMBAT8BP//EABQRAQAAAAAAAAAAAAAAAAAAABD/2gAIAQIBAT8BP//EABkQAAMAAwAAAAAAAAAAAAAAAAEQIQAxkf/aAAgBAQAGPwLQ5ldK/8QAHhABAAICAQUAAAAAAAAAAAAAAQARIUFRMWFxgfH/2gAIAQEAAT8hSKMJBTZ9horiazXqGLqdvJEAnE//2gAMAwEAAgADAAAAEPMf/8QAFREBAQAAAAAAAAAAAAAAAAAAAAH/2gAIAQMBAT8QV//EABYRAQEBAAAAAAAAAAAAAAAAAAABIf/aAAgBAgEBPxDUf//EABwQAQEAAgIDAAAAAAAAAAAAAAERACFBUWFxwf/aAAgBAQABPxAsTLbS+8KbAgk1wPuGQwS949xaBWrm3FOlCap14cVmgDP/2Q==" />
        }
        content={
          <Image.Content
            src={image.sm.src}
            xl={image.xl}
            lg={image.lg}
            md={image.md}
            sm={image.sm}
          />
        }
      />
      {/* <picture>
          {sizes.map((size) => (
            <source
              key={size}
              srcSet={image[size].url}
              media={`(min-width: ${image[size].w}px)`}
            />
          ))}
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1j24FzG-3_rUXMeFsYvO8YSHv6jpl9aRmnw&s"
            alt="Image placeholder"
          />
        </picture> */}
      {tags.length > 0 && (
        <Badges className="mb-4">
          {tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </Badges>
      )}
      <Markdown>{children}</Markdown>
      {author?.bio && author?.displayName && (
        <section className="mt-12">
          <div className="flex max-w-xl space-x-5 ml-auto rounded-lg">
            <Avatar
              className="shrink-0 bg-gray-300 dark:bg-slate-800"
              size="md"
              src={author.avatar?.md.src}
              alt="Author avatar"
              char={author.displayName.charAt(0)}
            />
            <div className="flex flex-col">
              <i>About Author</i>
              <strong className="mb-1 text-black dark:text-white">
                {author.displayName}
              </strong>
              <p>{author.bio}</p>
              <div className="flex space-x-2 mt-4">
                <UserSocials
                  githubUrl={author.githubUrl}
                  linkedInUrl={author.linkedInUrl}
                  blogUrl={author.blogUrl}
                  twitterUrl={author.twitterUrl}
                  fbUrl={author.fbUrl}
                  createTitle={(title) => `Author ${title}`}
                />
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
};

export { DocumentLayout };
