import { context } from "@greenonsoftware/react-kit";
import React from "react";
import type {
  PermanentDocumentDto,
  PublicDocumentDto,
} from "api-4markdown-contracts";

type Doc = PublicDocumentDto | PermanentDocumentDto;

type State = {
  document: Doc;
};

type Props = {
  document: Doc;
};

export const [DocumentLayoutProvider, useDocumentLayoutContext] = context(
  ({ document }: Props) =>
    React.useState<State>(() => ({
      document,
    })),
);
