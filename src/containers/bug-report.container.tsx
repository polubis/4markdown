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

const [BugReportProvider, useBugReportContext] = context(useSimpleFeature);

const BugReportModalContainer = () => {
  const { off } = useBugReportContext();
  const [{ invalid, untouched }, { inject }] = useForm(
    {
      title: ``,
      description: ``,
    },
    {
      title: [minLength(10), maxLength(120)],
      description: [minLength(30), maxLength(500)],
    },
  );

  const confirmSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
  };

  return (
    <Modal onClose={off}>
      <Modal.Header
        title="Report A Bug"
        closeButtonTitle="Close bug reporting"
      />
      <form className="flex flex-col gap-3" onSubmit={confirmSubmit}>
        <Field
          label="Title*"
          hint={<Hint trigger={<>Title your reason for reporting a bug</>} />}
        >
          <Input
            placeholder={`I cannot add mindmap, ...etc`}
            {...inject(`title`)}
          />
        </Field>
        <Field
          label="Description*"
          hint={<Hint trigger={<>3-4 sentences that describe the bug</>} />}
        >
          <Textarea
            placeholder={`Detailed description of the bug`}
            {...inject(`description`)}
          />
        </Field>
        <footer className="flex space-x-3 mt-6">
          <Button
            type="button"
            i={1}
            className="flex-1"
            s={2}
            auto
            title="Cancel bug report"
            onClick={off}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={invalid || untouched}
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
  const { isOn, on } = useBugReportContext();

  return (
    <>
      <Button
        i={1}
        s={2}
        auto
        onClick={on}
        className="bg-gradient-to-r from-sky-200 via-pink-200 to-gray-300 dark:from-sky-800 dark:via-pink-800 dark:to-gray-900 animate-gradient-move bg-[length:200%_200%]"
        title="Report a bug"
      >
        <span className="hidden md:inline mr-1">
          It&apos;s A Beta! Report A Bug
        </span>
        <BiBug />
      </Button>
      {isOn && <BugReportModalContainer />}
    </>
  );
};

const ConnectedBugReportContainer = () => (
  <BugReportProvider>
    <BugReportContainer />
  </BugReportProvider>
);

export { ConnectedBugReportContainer as BugReportContainer };
