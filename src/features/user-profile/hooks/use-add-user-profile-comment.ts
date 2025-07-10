import React from "react";
import { addUserProfileCommentAct } from "../acts/add-user-profile-comment.act";
import { AddUserProfileCommentFormValues } from "../models";
import { Transaction } from "development-kit/utility-types";

const useAddUserProfileComment = () => {
	const [state, setState] = React.useState<Transaction>({ is: `idle` });

	const actions = React.useMemo(
		() => ({
			add: async (values: AddUserProfileCommentFormValues) => {
				setState({ is: "busy" });

				const result = await addUserProfileCommentAct(values);

				setState(result);
			},
		}),
		[],
	);

	return [state, actions] as const;
};

export { useAddUserProfileComment };
