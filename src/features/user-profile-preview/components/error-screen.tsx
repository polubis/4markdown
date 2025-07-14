import React, { type ReactNode } from "react";
import { Button } from "design-system/button";
import { navigate } from "gatsby";
import { meta } from "../../../../meta";

type ErrorScreenProps = {
  title: ReactNode;
};

const ErrorScreen = ({ title }: ErrorScreenProps) => {
  return (
    <section className="flex flex-col items-center max-w-md">
      <h6 className="text-xl text-center">{title}</h6>
      <Button
        title="Go back to education zone"
        className="mt-4"
        auto
        s={2}
        i={2}
        onClick={() => navigate(meta.routes.education.zone)}
      >
        Go Back To Education Zone
      </Button>
    </section>
  );
};

export { ErrorScreen };
