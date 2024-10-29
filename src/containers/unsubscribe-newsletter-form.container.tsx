import { Field } from 'design-system/field';
import { Input } from 'design-system/input';
import React, { type FormEventHandler } from 'react';
import { Button } from 'design-system/button';
import { getAPI } from 'api-4markdown';
import type { Email } from 'api-4markdown-contracts';
import { parseError } from 'development-kit/parse-error';
import type { Transaction } from 'development-kit/utility-types';
import ErrorModal from 'components/error-modal';
import { Status } from 'design-system/status';

type UnsubscribeNewsletterFormContainerProps = {
  className?: string;
};

const UnsubscribeNewsletterFormContainer = ({
  className,
}: UnsubscribeNewsletterFormContainerProps) => {
  // @TODO[PRIO=3]: [Maybe parse error automatically in API response?].
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

  React.useEffect(() => {
    // @TODO[PRIO=3]: [Handle it in dedicated component?].
    let timeout: ReturnType<typeof setTimeout>;

    if (transaction.is === `ok`) {
      timeout = setTimeout(() => {
        setTransaction({ is: `idle` });
      }, 3500);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [transaction]);

  return (
    <>
      {transaction.is === `ok` && <Status>Bye, Bye ¯\_(ツ)_/¯</Status>}
      <form className={className} onSubmit={handleSubscribeSubmit}>
        <Field label="Email*">
          <Input
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Type your email to address"
          />
        </Field>
        <p className="text-sm mb-6 mt-3 italic">
          We&apos;re ಥ_ಥ to see you leaving the knowledge train. We hope
          you&apos;ll be back soon!
        </p>
        <div className="flex space-x-3">
          <Button
            disabled={transaction.is === `busy`}
            auto
            s={2}
            i={2}
            title="Confirm unsubscription from newsletter"
            type="submit"
          >
            Unsubscribe
          </Button>
        </div>
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
