import React from "react";
import { context } from "@greenonsoftware/react-kit";
import { API4MarkdownDto } from "api-4markdown-contracts";
import { Transaction } from "development-kit/utility-types";

type UserProfileState = Transaction<{
	data: API4MarkdownDto<"getUserProfile">;
}>;

const [UserProfileProvider, useUserProfileContext] = context(() => {
	const [state, setState] = React.useState<UserProfileState>({
		is: `idle`,
	});

	return [state, setState] as const;
});

export { UserProfileProvider, useUserProfileContext };
