import { Modal } from 'design-system/modal';
import React, { type FormEventHandler } from 'react';
import { Field } from 'design-system/field';
import { Textarea } from 'design-system/textarea';
import { useForm } from 'development-kit/use-form';
import { Hint } from 'design-system/hint';
import { Input } from 'design-system/input';
import { Button } from 'design-system/button';
import { maxLength, minLength } from 'development-kit/form';
import { BiBug } from 'react-icons/bi';
import { useSimpleFeature } from '@greenonsoftware/react-kit';
import { context } from 'development-kit/context';
import type { Transaction } from 'development-kit/utility-types';
import { reportBugAct } from 'acts/report-bug.act';

const [BugReportProvider, useBugReportContext] = context(useSimpleFeature);

const limits = {
  title: {
    min: 10,
    max: 120,
  },
  description: {
    min: 30,
    max: 500,
  },
};
const BugReportModalContainer = () => {
  const [operation, setOperation] = React.useState<Transaction>({ is: `idle` });
  const reportBugCtx = useBugReportContext();
  const [{ invalid, untouched, values }, { inject }] = useForm(
    {
      title: ``,
      description: ``,
    },
    {
      title: [minLength(limits.title.min), maxLength(limits.title.max)],
      description: [
        minLength(limits.description.min),
        maxLength(limits.description.max),
      ],
    },
  );

  const confirmSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    setOperation({ is: `busy` });

    const result = await reportBugAct({
      title: values.title,
      description: values.description,
    });

    if (result.is === `ok`) {
      reportBugCtx.off();
      return;
    }

    setOperation(result);
  };

  const busy = operation.is === `busy`;

  return (
    <Modal disabled={busy} onClose={reportBugCtx.off}>
      <Modal.Header
        title="Report A Bug"
        closeButtonTitle="Close bug reporting"
      />
      <form className="flex flex-col gap-3" onSubmit={confirmSubmit}>
        <Field
          label={`Title*`}
          hint={
            <Hint
              trigger={
                <>
                  Required, {limits.title.min}-{limits.title.max} characters
                </>
              }
            />
          }
        >
          <Input
            placeholder={`I cannot add mindmap, ...etc`}
            {...inject(`title`)}
          />
        </Field>
        <Field
          label={`Description*`}
          hint={
            <Hint
              trigger={
                <>
                  Required, {limits.description.min}-{limits.description.max}
                  {` `}
                  characters
                </>
              }
            />
          }
        >
          <Textarea
            placeholder={`When clicking a button application crashes, ...etc`}
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
            title="Cancel bug report"
            onClick={reportBugCtx.off}
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
            title="Submit your bug report"
          >
            Submit
          </Button>
        </footer>
      </form>
    </Modal>
  );
};

const BugReportContainer = () => {
  const reportBugCtx = useBugReportContext();

  return (
    <>
      <Button
        i={1}
        s={2}
        auto
        onClick={reportBugCtx.on}
        className="bg-gradient-to-r from-sky-200 via-pink-200 to-gray-300 dark:from-sky-800 dark:via-pink-800 dark:to-gray-900 animate-gradient-move bg-[length:200%_200%]"
        title="Report a bug"
      >
        <span className="hidden md:inline mr-1">
          It&apos;s A Beta! Report A Bug
        </span>
        <BiBug />
      </Button>
      {reportBugCtx.isOn && <BugReportModalContainer />}
    </>
  );
};

const ConnectedBugReportContainer = () => (
  <BugReportProvider>
    <BugReportContainer />
  </BugReportProvider>
);

export { ConnectedBugReportContainer as BugReportContainer };
