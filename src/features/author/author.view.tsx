import React from 'react';
import type { AuthorProfileDto } from 'api-4markdown-contracts';
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
  author: AuthorProfileDto;
};

const AuthorView = ({ author }: AuthorViewProps) => {
  console.log(`AuthorView`, author);

  const totalRatings = Object.values(author.rating).reduce(
    (sum, count) => sum + count,
    0,
  );
  const averageRating =
    totalRatings > 0
      ? (author.rating.perfect * 5 +
          author.rating.good * 4 +
          author.rating.decent * 3 +
          author.rating.bad * 2 +
          author.rating.ugly * 1) /
        totalRatings
      : 0;
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

                <div className={`grid grid-cols-2 gap-6 py-6`}>
                  <div>
                    <div className={`text-2xl font-bold text-[#00501d] mb-1`}>
                      {averageRating.toFixed(1)}/5.0
                    </div>
                    <div className={`text-sm text-zinc-600 dark:text-zinc-400`}>
                      Average Rating
                    </div>
                    <div className={`flex items-center gap-1 mt-1`}>
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.round(averageRating)
                              ? `fill-[#00501d] text-[#00501d]`
                              : `text-zinc-300 dark:text-zinc-600`
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className={`text-2xl font-bold text-[#00501d] mb-1`}>
                      {totalRatings}
                    </div>
                    <div className={`text-sm text-zinc-600 dark:text-zinc-400`}>
                      Total Reviews
                    </div>
                  </div>
                </div>

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

const Star = ({ className }: { className: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path
      fillRule="evenodd"
      d="M10.788 3.21c.447-1.077 1.977-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.693 21.41c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
      clipRule="evenodd"
    />
  </svg>
);
