import React, { type FormEventHandler } from 'react';
import { Button } from 'design-system/button';
import { context } from 'development-kit/context';
import { MdOutlineFeedback } from 'react-icons/md';
import { useForm } from 'development-kit/use-form';
import { useSimpleFeature } from '@greenonsoftware/react-kit';
import type { Transaction } from 'development-kit/utility-types';
import type { API4MarkdownPayload } from 'api-4markdown-contracts';
import { Modal } from 'design-system/modal';
import { Hint } from 'design-system/hint';
import { rateApplicationAct } from 'acts/rate-application.act';
import { Field } from 'design-system/field';
import { Input } from 'design-system/input';
import { Status } from 'design-system/status';
import debounce from 'lodash.debounce';

import {
  min,
  max,
  maxLength,
  minLength,
} from 'development-kit/form/validators';

type FormValues = Pick<
  API4MarkdownPayload<`rateApplication`>,
  `rating` | `description`
>;

const limits = {
  rating: {
    min: 1,
    max: 5,
  },
  description: {
    min: 15,
    max: 150,
  },
};

const formCfg = {
  initialValue: {
    rating: 0,
    description: ``,
  },
  validators: {
    rating: [min(limits.rating.min), max(limits.rating.max)],
    description: [
      minLength(limits.description.min),
      maxLength(limits.description.max),
    ],
  },
};

const [RateApplicationProvider, useRateApplicationContext] =
  context(useSimpleFeature);

const closeModal = debounce((off: () => void) => {
  off();
}, 1000);

const RateApplicationModalContainer = () => {
  const [operation, setOperation] = React.useState<Transaction>({ is: `idle` });
  const rateApplicationCtx = useRateApplicationContext();
  const [{ invalid, untouched, values }, { inject }] = useForm<FormValues>(
    formCfg.initialValue,
    formCfg.validators,
  );

  React.useEffect(() => {
    return () => {
      closeModal.cancel();
    };
  }, []);

  const ratingRange = [1, 2, 3, 4, 5];

  const confirmSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    setOperation({ is: `busy` });

    const result = await rateApplicationAct({
      rating: values.rating,
      description: values.description,
    });

    setOperation(result);

    if (result.is === `ok`) {
      closeModal(rateApplicationCtx.off);
    }
  };

  const handleRatingChange = (rating: number) => {
    inject(`rating`).onChange({
      target: { value: String(rating) },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  const busy = operation.is === `busy`;

  return (
    <>
      <Modal disabled={busy} onClose={rateApplicationCtx.off}>
        <Modal.Header
          title="Rate Application"
          closeButtonTitle="Close rate application"
        />
        <form className="flex flex-col gap-3" onSubmit={confirmSubmit}>
          <Field label="Rating">
            <div className="flex gap-2">
              {ratingRange.map((rating) => (
                <Button
                  key={rating}
                  type="button"
                  i={Number(values.rating) === rating ? 2 : 1}
                  s={2}
                  onClick={() => handleRatingChange(rating)}
                  disabled={busy}
                >
                  {rating}
                </Button>
              ))}
            </div>
          </Field>
          <Field
            label={`Description`}
            hint={
              <Hint
                trigger={
                  <>
                    Optional, {limits.description.min}-{limits.description.max}
                    {` `}
                    characters
                  </>
                }
              />
            }
          >
            <Input
              placeholder={`Share your thoughts about the application...`}
              {...inject(`description`)}
            />
          </Field>
          {operation.is === `fail` && (
            <p className="rounded-md py-1 px-2 bg-red-500 text-white mt-4">
              {operation.error.message}
            </p>
          )}
          <footer className="flex space-x-3 mt-6">
            <Button
              type="button"
              i={1}
              className="flex-1"
              s={2}
              disabled={busy}
              auto
              title="Cancel rate application"
              onClick={rateApplicationCtx.off}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={invalid || untouched || busy}
              i={2}
              className="flex-1"
              s={2}
              auto
              title="Submit your rate application"
            >
              Submit
            </Button>
          </footer>
        </form>
      </Modal>
      {operation.is === `ok` && <Status>Thank you for your feedback!</Status>}
    </>
  );
};

const RateApplicationContainer = () => {
  const rateApplicationCtx = useRateApplicationContext();
  return (
    <>
      <Button
        i={1}
        s={2}
        title="Rate application"
        className="bg-gradient-to-r from-sky-200 via-pink-200 to-gray-300 dark:from-sky-800 dark:via-pink-800 dark:to-gray-900 animate-gradient-move bg-[length:200%_200%]"
        onClick={rateApplicationCtx.on}
      >
        <MdOutlineFeedback />
      </Button>
      {rateApplicationCtx.isOn && <RateApplicationModalContainer />}
    </>
  );
};

const ConnectedRateApplicationContainer = () => (
  <RateApplicationProvider>
    <RateApplicationContainer />
  </RateApplicationProvider>
);

export { ConnectedRateApplicationContainer as RateApplicationContainer };
