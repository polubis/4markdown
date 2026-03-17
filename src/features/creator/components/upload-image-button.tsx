import React from "react";
import { Button, type ButtonProps } from "design-system/button";
import { BiImageAdd } from "react-icons/bi";

interface UploadImageButtonProps
  extends Omit<ButtonProps, "children" | "title"> {}

const UploadImageButton = (props: UploadImageButtonProps) => {
  const { i = 1, s = 2, ...rest } = props;

  return (
    <Button {...rest} i={i} s={s} title="Upload image">
      <BiImageAdd />
    </Button>
  );
};

export { UploadImageButton };
