import { context } from "@greenonsoftware/react-kit";
import React from "react";
import { JudgementConfiguration } from "../domain/models";
import { createMediator } from "../core/mediator";
import { useToastDisplay } from "./use-toast-display";

export const [Provider, useContext] = context(
  (config: JudgementConfiguration) => {
    const [facade] = React.useState(() => createMediator(config));

    useToastDisplay(facade);

    return facade;
  },
);
