import React from "react";
import { Modal2 } from "design-system/modal2";
import { loadResourceActivityAct } from "../acts/load-resource-activity.act";
import { ChangeHistory } from "../components/change-history";
import { useResourceActivityState } from "../store";
import { Atoms } from "api-4markdown-contracts";

type ResourceActivityContainerProps = {
  resourceId: Atoms["ResourceId"];
  resourceType: Atoms["ResourceType"];
  resourceCdate?: Atoms["UTCDate"];
  onClose(): void;
};

const ResourceActivityContainer = ({
  resourceId,
  resourceType,
  resourceCdate,
  onClose,
}: ResourceActivityContainerProps) => {
  const state = useResourceActivityState();

  const handleRetry = React.useCallback(() => {
    loadResourceActivityAct(resourceId, resourceType, "replace", resourceCdate);
  }, [resourceId, resourceType, resourceCdate]);

  const handleLoadMore = React.useCallback(() => {
    loadResourceActivityAct(resourceId, resourceType, "append", resourceCdate);
  }, [resourceId, resourceType, resourceCdate]);

  React.useEffect(() => {
    loadResourceActivityAct(resourceId, resourceType, "replace", resourceCdate);

    return () => {
      useResourceActivityState.reset();
    };
  }, [resourceId, resourceType, resourceCdate]);

  return (
    <Modal2 onClose={onClose}>
      <Modal2.Header title="Change History" />
      <Modal2.Body className="p-0 overflow-y-auto flex-1">
        <ChangeHistory
          onRetry={handleRetry}
          onLoadMore={handleLoadMore}
          hasMore={state.is === "ok" ? state.hasMore : false}
          isLoadingMore={state.is === "ok" ? state.isLoadingMore : false}
        />
      </Modal2.Body>
    </Modal2>
  );
};

export { ResourceActivityContainer };
