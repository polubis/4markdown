import { Button } from 'design-system/button';
import { BiBug } from 'react-icons/bi';
import React from 'react';
import {
  useBugReportContext,
  BugReportProvider,
} from './providers/bug-report.provider';
import { BugReportModalContainer } from './containers/bug-report-modal.container';

const BugReportView = () => {
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

BugReportView.Provider = BugReportProvider;

export { BugReportView };
