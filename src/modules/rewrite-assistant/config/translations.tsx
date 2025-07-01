import { type RewriteAssistantPersona } from "api-4markdown-contracts";
import React, { type ReactNode } from "react";

const REWRITE_ASSISTANT_TRANSLATIONS = {
	cleany: {
		name: `Simplify`,
		title: (
			<>
				Let&apos;s <strong>Simplify</strong>
			</>
		),
		message: `Simplify selected fragment`,
	},
	grammy: {
		name: `Grammar++`,
		title: (
			<>
				Let&apos;s Improve <strong>Grammar</strong>
			</>
		),
		message: `Improve grammar of selected fragment`,
	},
	teacher: {
		name: `Explain`,
		title: (
			<>
				Let&apos;s <strong>Understand</strong> Concept
			</>
		),
		message: `Explain selected fragment`,
	},
} satisfies Record<
	RewriteAssistantPersona,
	{
		name: ReactNode;
		title: ReactNode;
		message: string;
	}
>;

export { REWRITE_ASSISTANT_TRANSLATIONS };
