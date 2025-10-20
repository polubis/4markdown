import React from "react";
import { Tabs2 } from "design-system/tabs-2";
import { VisibilityIcon } from "./visibility-icon";
import {
  RESOURCE_VISIBILITIES,
  ResourceVisibility,
} from "api-4markdown-contracts";

type ResourceVisibilityTabsProps = {
  className?: string;
  disabled: boolean;
  visibility: ResourceVisibility;
  title: (visibility: ResourceVisibility) => string;
  onChange: (visibility: ResourceVisibility) => void;
};

const ResourceVisibilityTabs = ({
  className,
  visibility,
  title,
  onChange,
  disabled,
}: ResourceVisibilityTabsProps) => {
  return (
    <Tabs2 className={className}>
      {RESOURCE_VISIBILITIES.map((type) => (
        <Tabs2.Item
          key={type}
          title={title(type)}
          className="capitalize"
          active={visibility === type}
          onClick={() => onChange(type)}
          disabled={disabled}
        >
          <VisibilityIcon className="size-6 shrink-0" visibility={type} />
          <Tabs2.ItemText>{type}</Tabs2.ItemText>
        </Tabs2.Item>
      ))}
    </Tabs2>
  );
};

export { ResourceVisibilityTabs };
