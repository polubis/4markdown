import { getCache, setCache } from "api-4markdown";
import type { API4MarkdownDto } from "api-4markdown-contracts";
import { updateTokensAction } from "store/your-account/actions";

const updateTokensAct = async (
	tokens: API4MarkdownDto<"getYourAccount">["balance"]["tokens"],
): Promise<void> => {
	const cachedAccount = getCache(`getYourAccount`);

	if (cachedAccount !== null) {
		setCache(`getYourAccount`, {
			...cachedAccount,
			balance: {
				...cachedAccount.balance,
				tokens,
			},
		});
	}

	updateTokensAction(tokens);
};

export { updateTokensAct };
