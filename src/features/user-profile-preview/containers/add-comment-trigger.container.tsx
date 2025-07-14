import { useSimpleFeature } from "@greenonsoftware/react-kit";
import { logIn } from "actions/log-in.action";
import { Button } from "design-system/button";
import React, { useEffect } from "react";
import { BiPlusCircle } from "react-icons/bi";
import { useAuthStore } from "store/auth/auth.store";

const AddCommentWidgetContainer = React.lazy(() =>
  import(`./add-comment-widget.container`).then((m) => ({
    default: m.AddCommentWidgetContainer,
  })),
);

const AddCommentTriggerContainer = () => {
  const widget = useSimpleFeature();
  const auth = useAuthStore();
  const showWidgetAfterLogIn = React.useRef(false);

  const startCommentAdd = () => {
    if (auth.is === `authorized`) {
      widget.on();
      return;
    }

    showWidgetAfterLogIn.current = true;
    logIn();
  };

  useEffect(() => {
    if (auth.is === `authorized` && showWidgetAfterLogIn.current) {
      widget.on();
      showWidgetAfterLogIn.current = false;
    }
  }, [auth]);

  return (
    <>
      <Button
        i={2}
        s={2}
        auto
        title="Add a comment"
        className="mx-auto"
        onClick={startCommentAdd}
      >
        Add Comment
        <BiPlusCircle size={24} />
      </Button>
      {widget.isOn && (
        <React.Suspense>
          <AddCommentWidgetContainer onClose={widget.off} />
        </React.Suspense>
      )}
    </>
  );
};

export { AddCommentTriggerContainer };
