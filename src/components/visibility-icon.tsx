import React from "react";
import { ComponentType } from "react";
import { BiGroup, BiLowVision, BiShow, BiWorld } from "react-icons/bi";
import { IconBaseProps } from "react-icons";
import { Atoms } from "api-4markdown-contracts";

const ICONS_MAP = {
  private: BiLowVision,
  public: BiShow,
  permanent: BiWorld,
  manual: BiGroup,
} satisfies Record<Atoms["ResourceVisibility"], ComponentType>;

const VisibilityIcon = ({
  visibility,
  ...props
}: IconBaseProps & { visibility: Atoms["ResourceVisibility"] }) => {
  const Icon = ICONS_MAP[visibility];

  return <Icon {...props} />;
};

export { VisibilityIcon };
