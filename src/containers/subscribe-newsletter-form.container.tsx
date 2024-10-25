import { Field } from 'design-system/field';
import { Input } from 'design-system/input';
import { Link } from 'gatsby';
import React from 'react';
import { meta } from '../../meta';
import { Button } from 'design-system/button';

type SubscribeNewsletterFormContainerProps = {
  className?: string;
};

const SubscribeNewsletterFormContainer = ({
  className,
}: SubscribeNewsletterFormContainerProps) => {
  return (
    <form className={className} aria-label="Subscribe to our newsletter">
      <Field label="Subscribe To Our Newsletter">
        <Input
          required
          type="email"
          placeholder="Enter your email to hop on the knowledge train!"
        />
      </Field>
      <div className="mt-2">
        <input
          className="h-4 w-4 mr-2 translate-y-[3px] cursor-pointer"
          type="checkbox"
          id="privacyPolicy"
          name="privacyPolicy"
          required
          aria-describedby="privacyPolicyLabel"
        />
        <label
          className="text-sm cursor-pointer"
          htmlFor="privacyPolicy"
          id="privacyPolicyLabel"
        >
          I want to receive the newsletter from{` `}
          <strong>4markdown.com</strong>. I understand that my personal data
          will be processed according to the information in the{` `}
          <Link
            to={meta.routes.privacyPolicy}
            target="_blank"
            className="underline underline-offset-2 text-blue-800 dark:text-blue-500"
          >
            Privacy Policy
          </Link>
        </label>
      </div>
      <p className="text-sm mb-6 mt-3">
        <i>
          Already subscribed? Here you can {` `}
          <button
            type="button"
            className="inline underline underline-offset-2 text-blue-800 dark:text-blue-500"
          >
            Unsubscribe
          </button>
          {` `}from newsletter ಥ_ಥ
        </i>
      </p>
      <Button auto s={1} i={2} type="submit">
        Subscribe
      </Button>
    </form>
  );
};

export { SubscribeNewsletterFormContainer };
