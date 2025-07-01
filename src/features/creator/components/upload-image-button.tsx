import { Button, type ButtonProps } from "design-system/button";
import React from "react";
import { BiImageAdd } from "react-icons/bi";

interface UploadImageButtonProps
	extends Omit<ButtonProps, "title" | "children" | "i" | "s"> {}

const UploadImageButton = (props: UploadImageButtonProps) => {
	return (
		<Button {...props} i={1} s={2} title="Upload image">
			<BiImageAdd />
		</Button>
	);
};

export { UploadImageButton };
