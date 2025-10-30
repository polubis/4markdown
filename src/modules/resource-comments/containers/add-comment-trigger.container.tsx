import { logIn } from "actions/log-in.action";
import { Button } from "design-system/button";
import React, { useEffect } from "react";
import { BiPlus } from "react-icons/bi";
import { useAuthStore } from "store/auth/auth.store";
import { setAction } from "../store/actions";

const AddCommentTriggerContainer = () => {
  const auth = useAuthStore();
  const showWidgetAfterLogIn = React.useRef(false);

  const startCommentAdd = () => {
    if (auth.is === `authorized`) {
      setAction("commentFormData", { type: "add" });
      return;
    }

    showWidgetAfterLogIn.current = true;
    logIn();
  };

  useEffect(() => {
    if (auth.is === `authorized` && showWidgetAfterLogIn.current) {
      setAction("commentFormData", { type: "add" });
      showWidgetAfterLogIn.current = false;
    }
  }, [auth]);

  return (
    <Button i={2} s={1} title="Add comment" onClick={startCommentAdd}>
      <BiPlus />
    </Button>
  );
};

export { AddCommentTriggerContainer };
