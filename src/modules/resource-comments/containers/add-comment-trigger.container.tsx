import { logIn } from "actions/log-in.action";
import { Button } from "design-system/button";
import React, { useEffect } from "react";
import { BiPlus } from "react-icons/bi";
import { useAuthStore } from "store/auth/auth.store";
import { AddCommentWidgetContainer } from "./add-comment-widget.container";
import { useResourceCommentsContext } from "../providers/resource-comments.provider";

const AddCommentTriggerContainer = () => {
  const { addCommentWidget } = useResourceCommentsContext();
  const auth = useAuthStore();
  const showWidgetAfterLogIn = React.useRef(false);

  const startCommentAdd = () => {
    if (auth.is === `authorized`) {
      addCommentWidget.on();
      return;
    }

    showWidgetAfterLogIn.current = true;
    logIn();
  };

  useEffect(() => {
    if (auth.is === `authorized` && showWidgetAfterLogIn.current) {
      addCommentWidget.on();
      showWidgetAfterLogIn.current = false;
    }
  }, [auth]);

  return (
    <>
      <Button i={2} s={1} title="Add comment" onClick={startCommentAdd}>
        <BiPlus />
      </Button>
      {addCommentWidget.isOn && <AddCommentWidgetContainer />}
    </>
  );
};

export { AddCommentTriggerContainer };
