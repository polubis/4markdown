import { Field } from 'design-system/field';
import { Input } from 'design-system/input';
import React, { type FormEventHandler } from 'react';
import { Button } from 'design-system/button';
import { getAPI } from 'api-4markdown';
import type { Email } from 'api-4markdown-contracts';
import { parseError } from 'development-kit/parse-error';
import type { Transaction } from 'development-kit/utility-types';
import ErrorModal from 'components/error-modal';

type UnsubscribeNewsletterFormContainerProps = {
  className?: string;
};

const UnsubscribeNewsletterFormContainer = ({
  className,
}: UnsubscribeNewsletterFormContainerProps) => {
  // @TODO[PRIO=3]: [Maybe parse error automatically in API respose?].
  const [transaction, setTransaction] = React.useState<Transaction>({
    is: `idle`,
  });
  const [email, setEmail] = React.useState<Email>(``);

  const resetTransaction = (): void => {
    setTransaction({ is: `idle` });
  };

  const handleSubscribeSubmit: FormEventHandler<HTMLFormElement> = async (
    e,
  ) => {
    e.preventDefault();

    setTransaction({ is: `busy` });

    try {
      await getAPI().call(`unsubscribeNewsletter`)({
        email,
      });

      setTransaction({ is: `ok` });
      setEmail(``);
    } catch (error: unknown) {
      setTransaction({ is: `fail`, error: parseError(error) });
    }
  };

  return (
    <>
      <form
        className={className}
        aria-label="Unsubscribe from our newsletter"
        onSubmit={handleSubscribeSubmit}
      >
        <Field label="Unsubscribe From Our Newsletter">
          <Input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Type your email to unsubscribe"
          />
        </Field>
        <Button
          disabled={transaction.is === `busy`}
          auto
          s={1}
          i={2}
          type="submit"
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

export { UnsubscribeNewsletterFormContainer };
