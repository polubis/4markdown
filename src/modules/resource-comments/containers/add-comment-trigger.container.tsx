import { logIn } from "actions/log-in.action";
import { ResourceId, ResourceType } from "api-4markdown-contracts";
import { Button } from "design-system/button";
import React, { useEffect } from "react";
import { BiPlus } from "react-icons/bi";
import { useAuthStore } from "store/auth/auth.store";
import { AddCommentWidgetContainer } from "./add-comment-widget.container";
import { useResourceCommentsContext } from "../providers/resource-comments.provider";

type AddCommentTriggerContainerProps = {
  resourceId: ResourceId;
  resourceType: ResourceType;
};

const AddCommentTriggerContainer = ({
  resourceId,
  resourceType,
}: AddCommentTriggerContainerProps) => {
  const { addCommentWidget, commentsQuery } = useResourceCommentsContext();
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
      <Button
        i={2}
        s={1}
        title="Add comment"
        disabled={commentsQuery.is !== "ok"}
        onClick={startCommentAdd}
      >
        <BiPlus />
      </Button>
      {addCommentWidget.isOn && (
        <AddCommentWidgetContainer
          onClose={addCommentWidget.off}
          resourceId={resourceId}
          resourceType={resourceType}
        />
      )}
    </>
  );
};

export { AddCommentTriggerContainer };
