import { Modal2 } from "design-system/modal2";
import React, { type FormEventHandler } from "react";
import { Field } from "design-system/field";
import { Textarea } from "design-system/textarea";
import { useForm } from "development-kit/use-form";
import { Hint } from "design-system/hint";
import { Input } from "design-system/input";
import { Button } from "design-system/button";
import { maxLength, minLength } from "development-kit/form";
import { BiBug, BiError } from "react-icons/bi";
import { Err } from "design-system/err";
import { useSimpleFeature, context } from "@greenonsoftware/react-kit";
import type { Transaction } from "development-kit/utility-types";
import { reportBugAct } from "acts/report-bug.act";
import type { API4MarkdownPayload, Atoms } from "api-4markdown-contracts";

const [BugReportProvider, useBugReportContext] = context(() =>
  useSimpleFeature(),
);

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

type FormValues = Pick<
  API4MarkdownPayload<`reportBug`>,
  `title` | `description`
>;

const BugReportModalContainer = () => {
  const [operation, setOperation] = React.useState<Transaction>({ is: `idle` });
  const reportBugCtx = useBugReportContext();
  const [{ invalid, untouched, values }, { inject }] = useForm<FormValues>(
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
      url: window.location.href as Atoms["Url"],
    });

    if (result.is === `ok`) {
      reportBugCtx.off();
      return;
    }

    setOperation(result);
  };

  const busy = operation.is === `busy`;

  return (
    <Modal2 disabled={busy} onClose={reportBugCtx.off}>
      <Modal2.Header
        title="Report A Bug"
        closeButtonTitle="Close bug reporting"
      />
      <Modal2.Body>
        <form
          id="bug-report-form"
          className="flex flex-col gap-3"
          onSubmit={confirmSubmit}
        >
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
            <Err className="py-2">
              <Err.Icon>
                <BiError size={80} />
              </Err.Icon>
              <Err.Title>Something went wrong</Err.Title>
              <Err.Description className="mb-0">
                {operation.error.message}
              </Err.Description>
            </Err>
          )}
        </form>
      </Modal2.Body>
      <Modal2.Footer className="flex gap-3">
        <Button
          type="button"
          i={1}
          s={2}
          disabled={busy}
          auto
          className="flex-1"
          title="Cancel bug report"
          onClick={reportBugCtx.off}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          form="bug-report-form"
          className="flex-1"
          disabled={invalid || untouched || busy}
          i={2}
          s={2}
          auto
          title="Submit your bug report"
        >
          Submit
        </Button>
      </Modal2.Footer>
    </Modal2>
  );
};

const BugReportContainer = () => {
  const reportBugCtx = useBugReportContext();

  return (
    <>
      <Button
        i={1}
        s={2}
        onClick={reportBugCtx.on}
        title="It's beta! Report a bug"
      >
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
