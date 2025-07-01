import React from "react";
import { NoPersonaScreen } from "./components/no-persona-screen";
import { PersonaScreen } from "./components/persona-screen";
import type { RewriteAssistantProps } from "./models";
import {
	RewriteAssistantProvider,
	useRewriteAssistantContext,
} from "./providers/rewrite-assistant.provider";

const RewriteAssistantModule = () => {
	const {
		state: { activePersona },
	} = useRewriteAssistantContext();

	if (activePersona === `none`) {
		return <NoPersonaScreen />;
	}

	return <PersonaScreen />;
};

const ConnectedRewriteAssistantModule = (props: RewriteAssistantProps) => {
	return (
		<RewriteAssistantProvider {...props}>
			<RewriteAssistantModule />
		</RewriteAssistantProvider>
	);
};

export { ConnectedRewriteAssistantModule as RewriteAssistantModule };
