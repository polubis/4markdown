import { Field } from 'design-system/field';
import { Input } from 'design-system/input';
import { Link } from 'gatsby';
import React from 'react';
import { meta } from '../../meta';
import { Button } from 'design-system/button';

const SubscribeNewsletterFormContainer = () => {
  return (
    <form aria-label="Subscribe to our newsletter">
      <Field label="Subscribe To Our Newsletter">
        <Input required type="email" placeholder="Type your email..." />
      </Field>
      <div className="mt-2 mb-6">
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
          .
        </label>
      </div>
      <Button auto s={1} i={2} type="submit">
        Subscribe
      </Button>
    </form>
  );
};

export { SubscribeNewsletterFormContainer };
