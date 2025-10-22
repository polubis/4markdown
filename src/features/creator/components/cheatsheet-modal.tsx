import React from "react";
import { Modal2 } from "design-system/modal2";
import { Loader } from "design-system/loader";
import { Markdown } from "components/markdown";
import { useQuery } from "core/use-query";

type CheatSheetModalProps = {
  onClose(): void;
};

const CheatSheetModal = ({ onClose }: CheatSheetModalProps) => {
  const cheatsheet = useQuery<string>({
    handler: async (signal) => {
      const response = await fetch(`/intro.md`, { signal });
      return response.text();
    },
  });

  return (
    <Modal2
      data-testid="[cheatsheet-modal]:container"
      className="[&>*]:w-[100%] [&>*]:max-w-prose"
      onClose={onClose}
    >
      <Modal2.Header
        title="Markdown Cheatsheet"
        closeButtonTitle="Close markdown cheatsheet"
      />
      <Modal2.Body>
        {(cheatsheet.is === `idle` || cheatsheet.is === `busy`) && (
          <Loader className="my-6 mx-auto" size="xl" />
        )}
        {cheatsheet.is === `ok` && <Markdown>{cheatsheet.data}</Markdown>}
        {cheatsheet.is === `fail` && (
          <p className="text-xl text-red-600 dark:text-red-400 text-center mb-4">
            Something went wrong... Close and try again
          </p>
        )}
      </Modal2.Body>
    </Modal2>
  );
};

export { CheatSheetModal };
