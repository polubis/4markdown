import React from "react";
import { Modal2 } from "design-system/modal2";
import { loadResourceActivityAct } from "../acts/load-resource-activity.act";
import { ChangeHistory } from "../components/change-history";
import { useResourceActivityState } from "../store";
import { Atoms } from "api-4markdown-contracts";

type ResourceActivityContainerProps = {
  resourceId: Atoms["ResourceId"];
  resourceType: Atoms["ResourceType"];
  onClose(): void;
};

const ResourceActivityContainer = ({
  resourceId,
  resourceType,
  onClose,
}: ResourceActivityContainerProps) => {
  const handleRetry = React.useCallback(() => {
    loadResourceActivityAct(resourceId, resourceType);
  }, [resourceId, resourceType]);

  React.useEffect(() => {
    loadResourceActivityAct(resourceId, resourceType);

    return () => {
      useResourceActivityState.reset();
    };
  }, [resourceId, resourceType]);

  return (
    <Modal2 onClose={onClose}>
      <Modal2.Header title="Change History" />
      <Modal2.Body className="p-0 overflow-y-auto flex-1">
        <ChangeHistory onRetry={handleRetry} />
      </Modal2.Body>
    </Modal2>
  );
};

export { ResourceActivityContainer };
