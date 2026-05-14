import { context } from "@greenonsoftware/react-kit";
import React from "react";
import type {
  Atoms,
  PermanentDocumentDto,
  PublicDocumentDto,
} from "api-4markdown-contracts";

type Doc = PublicDocumentDto | PermanentDocumentDto;

type State = {
  document: Doc;
  yourRate: Atoms["RatingCategory"] | null;
};

type Props = {
  document: Doc;
};

export const [DocumentLayoutProvider, useDocumentLayoutContext] = context(
  ({ document }: Props) =>
    React.useState<State>(() => ({
      document,
      yourRate: null,
    })),
);
