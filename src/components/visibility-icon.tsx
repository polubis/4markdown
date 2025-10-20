import React from "react";
import { ResourceVisibility } from "api-4markdown-contracts";
import { ComponentType } from "react";
import { BiGroup, BiLowVision, BiShow, BiWorld } from "react-icons/bi";
import { IconBaseProps } from "react-icons";

const ICONS_MAP = {
  private: BiLowVision,
  public: BiShow,
  permanent: BiWorld,
  manual: BiGroup,
} satisfies Record<ResourceVisibility, ComponentType>;

const VisibilityIcon = ({
  visibility,
  ...props
}: IconBaseProps & { visibility: ResourceVisibility }) => {
  const Icon = ICONS_MAP[visibility];

  return <Icon {...props} />;
};

export { VisibilityIcon };
