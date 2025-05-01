import type { HeadFC } from 'gatsby';
import React from 'react';
import { meta } from '../../meta';
import Meta from 'components/meta';
import LogoThumbnail from 'images/logo-thumbnail.png';
import { Button, type ButtonProps } from 'design-system/button';
import { AppNavigation } from 'components/app-navigation';
import { AppFooterContainer } from 'containers/app-footer.container';

const buttonVariants: Array<ButtonProps & { label: string }> = [
  { s: 1, i: 1, label: `s=1, i=1` },
  { s: 1, i: 2, label: `s=1, i=2` },
  { s: 2, i: 1, label: `s=2, i=1` },
  { s: 2, i: 2, label: `s=2, i=2` },

  { s: 1, i: 1, auto: true, label: `auto s=1, i=1` },
  { s: 1, i: 2, auto: true, label: `auto s=1, i=2` },
  { s: 2, i: 1, auto: true, label: `auto s=2, i=1` },
  { s: 2, i: 2, auto: true, label: `auto s=2, i=2` },

  { s: 1, i: 2, rounded: true, label: `pill s=1, i=2` },
  { s: 2, i: 2, rounded: true, label: `pill s=2, i=2` },

  { s: 2, i: 2, disabled: true, label: `disabled` },
];

type ButtonVariantsProps = {
  buttonVariants: Array<ButtonProps & { label: string }>;
};

const DesignSystemButtonPreview = ({ buttonVariants }: ButtonVariantsProps) => {
  return (
    <div className="p-8 space-y-8 min-h-screen">
      <section className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Button Variants
        </h2>

        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          data-testid="button-variants-container"
        >
          {buttonVariants.map(({ label, ...props }) => (
            <div key={label} className="flex flex-col items-center">
              <p className="mb-3 text-sm text-zinc-600 dark:text-zinc-400">
                {label}
              </p>
              <Button {...props}>{props.auto ? `Button Text` : `A`}</Button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const DesignSystemPage = () => {
  return (
    <>
      <AppNavigation>siemka</AppNavigation>
      <DesignSystemButtonPreview buttonVariants={buttonVariants} />
      <AppFooterContainer />
    </>
  );
};
export default DesignSystemPage;

export const Head: HeadFC = () => {
  return (
    <Meta
      appName={meta.appName}
      title={meta.title}
      description={meta.description}
      url={meta.siteUrl + meta.routes.creator.preview}
      lang={meta.lang}
      image={meta.siteUrl + LogoThumbnail}
      robots="noindex, nofollow"
    />
  );
};
