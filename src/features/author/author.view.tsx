import React from 'react';
import type { UserProfileDto } from 'api-4markdown-contracts';
import { AppNavigation } from 'components/app-navigation';
import { CreationLinkContainer } from 'containers/creation-link.container';
import { EducationRankLinkContainer } from 'containers/education-rank-link.container';
import { EducationZoneLinkContainer } from 'containers/education-zone-link.container';
import { AppFooterContainer } from 'containers/app-footer.container';
import { Avatar } from 'design-system/avatar';
import { UserSocials } from 'components/user-socials';
import { Button } from 'design-system/button';
import { GoArrowUpRight } from 'react-icons/go';

type AuthorViewProps = {
  author: UserProfileDto;
};

const AuthorView = ({ author }: AuthorViewProps) => {
  return (
    <>
      <AppNavigation>
        <CreationLinkContainer />
        <EducationRankLinkContainer />
        <EducationZoneLinkContainer />
      </AppNavigation>

      <div className={`min-h-screen bg-zinc-50 dark:bg-zinc-950`}>
        <div className={`relative overflow-hidden`}>
          {/* Background Pattern */}
          <div className={`absolute inset-0 opacity-5`}>
            <div
              className={`absolute top-20 left-10 w-32 h-32 bg-[#00501d] rounded-full blur-3xl`}
            ></div>
            <div
              className={`absolute top-40 right-20 w-48 h-48 bg-[#00501d] rounded-full blur-3xl`}
            ></div>
            <div
              className={`absolute bottom-20 left-1/3 w-40 h-40 bg-[#00501d] rounded-full blur-3xl`}
            ></div>
          </div>

          <div className={`relative z-10 container mx-auto px-4 py-20`}>
            <div className={`text-center mb-16`}>
              <h1
                className={`text-5xl md:text-6xl font-bold text-zinc-900 dark:text-white mb-4`}
              >
                About Me
              </h1>
            </div>

            <div
              className={`grid lg:grid-cols-2 gap-16 items-center max-w-7xl mx-auto`}
            >
              <div className={`flex justify-center lg:justify-start`}>
                <div
                  className={`border-4 border-[#00501d] shadow-2xl rounded-full flex items-center justify-center overflow-hidden`}
                >
                  <Avatar
                    size="lg"
                    src={author.avatar?.lg?.src}
                    alt={author.displayName ?? `Author Avatar`}
                    char={author.displayName?.charAt(0).toUpperCase()}
                    className={`w-full h-full`}
                  />
                </div>
              </div>

              <div className={`space-y-8`}>
                <div className={`inline-block`}>
                  <span
                    className={`px-4 py-2 bg-zinc-900 dark:bg-zinc-800 text-white rounded-full text-sm font-medium border border-[#00501d]`}
                  >
                    About Me
                  </span>
                </div>

                <h2
                  className={`text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white leading-tight`}
                >
                  {author.bio ||
                    `Get to know ${(author.displayName ?? ``).split(` `)[0]} better!`}
                </h2>

                <p
                  className={`text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed`}
                >
                  {author.bio ||
                    `Passionate about creating amazing digital experiences and sharing knowledge with the community.`}
                </p>

                <div className={`grid grid-cols-1 md:grid-cols-2 gap-4`}>
                  <div>
                    <div className={`text-sm font-bold text-[#00501d] mb-1`}>
                      Name:
                    </div>
                    <div className={`text-zinc-900 dark:text-white`}>
                      {author.displayName}
                    </div>
                  </div>
                </div>

                <div className={`flex flex-wrap gap-4 pt-4`}>
                  <Button auto i={2} s={2} rounded={false}>
                    Contact me
                    <GoArrowUpRight />
                  </Button>
                  {author.blogUrl && (
                    <a
                      href={author.blogUrl}
                      target={`_blank`}
                      rel={`noopener noreferrer`}
                    >
                      <Button auto i={2} s={2} rounded={false}>
                        Visit Blog
                      </Button>
                    </a>
                  )}
                </div>

                <div className={`flex gap-4 pt-4`}>
                  <UserSocials
                    githubUrl={author.githubUrl}
                    fbUrl={author.fbUrl}
                    linkedInUrl={author.linkedInUrl}
                    twitterUrl={author.twitterUrl}
                    blogUrl={author.blogUrl}
                    createTitle={(title) => `Author ${title}`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {author.testimonials && author.testimonials.length > 0 && (
          <div className={`bg-white dark:bg-zinc-900 py-20`}>
            <div className={`container mx-auto px-4`}>
              <div className={`text-center mb-16`}>
                <h2
                  className={`text-4xl font-bold text-zinc-900 dark:text-white mb-4`}
                >
                  What People Say
                </h2>
                <p
                  className={`text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto`}
                >
                  Here&apos;s what the community has to say about my work and
                  contributions.
                </p>
              </div>

              <div
                className={`grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto`}
              >
                {author.testimonials.map((testimonial, index) => (
                  <div
                    key={index}
                    className={`bg-zinc-950 p-6 rounded-xl flex flex-col`}
                  >
                    <div className={`flex items-center gap-4 mb-4`}>
                      <Avatar
                        size="tn"
                        src={testimonial.author.avatar?.tn?.src}
                        alt={
                          testimonial.author.displayName ?? `Testimonial author`
                        }
                        char={testimonial.author.displayName?.charAt(0)}
                        className="shrink-0 bg-gray-300 dark:bg-slate-800"
                      />
                      <div className={`flex flex-col`}>
                        <div className={`font-bold text-white text-lg`}>
                          {testimonial.author.displayName ?? `Anonymous`}
                        </div>
                        <div className={`text-zinc-400 text-sm`}>
                          {testimonial.author.bio ?? `Valued Contributor`}
                        </div>
                      </div>
                    </div>
                    <p className={`text-zinc-300 italic mb-4`}>
                      {testimonial.content}
                    </p>

                    <div className={`flex gap-2 mt-auto`}>
                      <UserSocials
                        githubUrl={testimonial.author.githubUrl}
                        fbUrl={testimonial.author.fbUrl}
                        linkedInUrl={testimonial.author.linkedInUrl}
                        twitterUrl={testimonial.author.twitterUrl}
                        blogUrl={testimonial.author.blogUrl}
                        createTitle={(socialNetworkName) =>
                          `${testimonial.author.displayName ?? `Author`}'s ${socialNetworkName.toLowerCase()}`
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <AppFooterContainer />
    </>
  );
};

export { AuthorView };
