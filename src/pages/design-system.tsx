import type { HeadFC } from 'gatsby';
import React from 'react';
import { meta } from '../../meta';
import Meta from 'components/meta';
import LogoThumbnail from 'images/logo-thumbnail.png';
import { Button, type ButtonProps } from 'design-system/button';
import { AppNavigation } from 'components/app-navigation';
import { AppFooterContainer } from 'containers/app-footer.container';
import { CreationLinkContainer } from 'containers/creation-link.container';
import { EducationRankLinkContainer } from 'containers/education-rank-link.container';
import { EducationZoneLinkContainer } from 'containers/education-zone-link.container';
import { DesignSystemLinkContainer } from 'containers/design-system-link.container';
import { Select, SelectField, type SelectOption } from 'design-system/select';
import { Field } from 'design-system/field';

// TODO: Add more button variants, like icon buttons, loading buttons, etc.
// TODO: Think about the labels
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
    <div className="p-8 space-y-8">
      <section className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Button Variants
        </h2>

        <div
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8"
          data-testid="button-variants-container"
        >
          {buttonVariants.map(({ label, ...props }) => (
            <div key={label} className="flex flex-col items-center space-y-2">
              <Button {...props}>{props.auto ? `Button Text` : `A`}</Button>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {label}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const DesignSystemSelectPreview = () => {
  const [value, setValue] = React.useState<string>(``);

  const options: SelectOption[] = [
    { value: `apple`, label: `Apple` },
    { value: `banana`, label: `Banana` },
    { value: `orange`, label: `Orange` },
    { value: `grape`, label: `Grape` },
    { value: `strawberry`, label: `Strawberry` },
    { value: `blueberry`, label: `Blueberry` },
    { value: `raspberry`, label: `Raspberry` },
    { value: `blackberry`, label: `Blackberry` },
    { value: `kiwi`, label: `Kiwi` },
    { value: `mango`, label: `Mango` },
  ];

  return (
    <div className="p-8 max-w-md mx-auto space-y-8">
      <h1 className="text-2xl font-bold">Select Component Demo</h1>

      <div className="space-y-6">
        <SelectField
          label="Select a fruit"
          options={options}
          value={value}
          onChange={setValue}
          hint={
            <p className="text-xs text-gray-600 dark:text-gray-300">
              Choose your favorite fruit
            </p>
          }
        />

        <Field label="Disabled Select">
          <Select
            options={options}
            value={value}
            onChange={setValue}
            disabled
          />
        </Field>
      </div>

      <div className="p-4 bg-gray-300 dark:bg-slate-800 rounded-md">
        <p className="font-medium">Selected value: {value || `None`}</p>
        <p className="text-sm mt-2">Try using keyboard navigation:</p>
        <ul className="text-sm list-disc list-inside mt-1">
          <li>Tab to focus the select</li>
          <li>Space/Enter to open dropdown</li>
          <li>Arrow keys to navigate options</li>
          <li>Enter to select an option</li>
          <li>Escape to close dropdown</li>
        </ul>
      </div>
    </div>
  );
};

const DesignSystemPage = () => {
  return (
    <>
      <AppNavigation>
        <CreationLinkContainer />
        <EducationRankLinkContainer />
        <EducationZoneLinkContainer />
        <DesignSystemLinkContainer />
      </AppNavigation>
      <DesignSystemButtonPreview buttonVariants={buttonVariants} />
      <DesignSystemSelectPreview />
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
