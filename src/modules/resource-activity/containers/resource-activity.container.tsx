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
  resourceParentId?: Atoms["MindmapId"];
  onClose(): void;
};

const ResourceActivityContainer = ({
  resourceId,
  resourceType,
  resourceCdate,
  resourceParentId,
  onClose,
}: ResourceActivityContainerProps) => {
  const state = useResourceActivityState();

  const handleRetry = React.useCallback(() => {
    loadResourceActivityAct(
      resourceId,
      resourceType,
      "replace",
      resourceCdate,
      resourceParentId,
    );
  }, [resourceId, resourceType, resourceCdate, resourceParentId]);

  const handleLoadMore = React.useCallback(() => {
    loadResourceActivityAct(
      resourceId,
      resourceType,
      "append",
      resourceCdate,
      resourceParentId,
    );
  }, [resourceId, resourceType, resourceCdate, resourceParentId]);

  React.useEffect(() => {
    loadResourceActivityAct(
      resourceId,
      resourceType,
      "replace",
      resourceCdate,
      resourceParentId,
    );

    return () => {
      useResourceActivityState.reset();
    };
  }, [resourceId, resourceType, resourceCdate, resourceParentId]);

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
