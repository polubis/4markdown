import { Field } from 'design-system/field';
import { Input } from 'design-system/input';
import { Link } from 'gatsby';
import React, { type FormEventHandler } from 'react';
import { meta } from '../../meta';
import { Button } from 'design-system/button';
import { getAPI } from 'api-4markdown';
import type { Email } from 'api-4markdown-contracts';
import { parseError } from 'development-kit/parse-error';
import type { Transaction } from 'development-kit/utility-types';
import ErrorModal from 'components/error-modal';
import { UnsubscribeNewsletterFormContainer } from './unsubscribe-newsletter-form.container';

type SubscribeNewsletterFormContainerProps = {
  className?: string;
};

const SubscribeNewsletterFormContainer = ({
  className,
}: SubscribeNewsletterFormContainerProps) => {
  const [isUnsubscribeForm, setIsUnsubscribeForm] = React.useState(false);
  // @TODO[PRIO=3]: [Maybe parse error automatically in API response?].
  const [transaction, setTransaction] = React.useState<Transaction>({
    is: `idle`,
  });
  const [confirmation, setConfirmation] = React.useState(false);
  const [email, setEmail] = React.useState<Email>(``);

  const resetTransaction = (): void => {
    setTransaction({ is: `idle` });
  };

  const toggleIsUnsubscribeForm = (): void => {
    setIsUnsubscribeForm((prevIsUnsubscribeForm) => !prevIsUnsubscribeForm);
  };

  const toggleConfirmation = (): void => {
    setConfirmation((prevConfirmation) => !prevConfirmation);
  };

  const handleSubscribeSubmit: FormEventHandler<HTMLFormElement> = async (
    e,
  ) => {
    e.preventDefault();

    setTransaction({ is: `busy` });

    try {
      await getAPI().call(`subscribeNewsletter`)({
        email,
      });

      setTransaction({ is: `ok` });
      setEmail(``);
      setConfirmation(false);
    } catch (error: unknown) {
      setTransaction({ is: `fail`, error: parseError(error) });
    }
  };

  if (isUnsubscribeForm) {
    return (
      <UnsubscribeNewsletterFormContainer
        className={className}
        onBack={toggleIsUnsubscribeForm}
      />
    );
  }

  return (
    <>
      <form className={className} onSubmit={handleSubscribeSubmit}>
        <Field label="Subscribe To Our Newsletter">
          <Input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Type your email for knowledge!"
          />
        </Field>
        <div className="mt-2">
          <input
            className="h-4 w-4 mr-2 translate-y-[3px] cursor-pointer"
            type="checkbox"
            id="privacyPolicy"
            name="privacyPolicy"
            required
            checked={confirmation}
            onChange={toggleConfirmation}
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
              disabled={transaction.is === `busy`}
              className="inline underline underline-offset-2 text-blue-800 dark:text-blue-500"
              title="Go to newsletter unsubscribe form"
              onClick={toggleIsUnsubscribeForm}
            >
              Unsubscribe
            </button>
            {` `}from newsletter ಥ_ಥ
          </i>
        </p>
        <Button
          disabled={transaction.is === `busy`}
          auto
          s={1}
          i={2}
          type="submit"
          title="Confirm newsletter subscription"
        >
          Subscribe
        </Button>
      </form>
      {transaction.is === `fail` && (
        <ErrorModal
          heading="Ups, something went wrong"
          message={transaction.error.message}
          onClose={resetTransaction}
        />
      )}
    </>
  );
};

export { SubscribeNewsletterFormContainer };
