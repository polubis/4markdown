import { context } from "@greenonsoftware/react-kit";
import React from "react";
import { Configuration } from "../domain/models";
import { createMediator } from "../core/mediator";
import { useToastDisplay } from "./use-toast-display";

export const [Provider, useContext] = context((config: Configuration) => {
  const [facade] = React.useState(() => createMediator(config));

  useToastDisplay(facade);

  return facade;
});
