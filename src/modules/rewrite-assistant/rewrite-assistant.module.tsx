import React from 'react';
import {
  RewriteAssistantProvider,
  useRewriteAssistantContext,
} from './providers/rewrite-assistant.provider';
import type { RewriteAssistantProps } from './models';
import { NoPersonaScreen } from './components/no-persona-screen';

const RewriteAssistantModule = () => {
  const {
    state: { activePersona },
  } = useRewriteAssistantContext();

  if (activePersona === `none`) {
    return <NoPersonaScreen />;
  }

  return <PersonaForm />;
};

const ConnectedRewriteAssistantModule = (props: RewriteAssistantProps) => {
  return (
    <RewriteAssistantProvider {...props}>
      <RewriteAssistantModule />
    </RewriteAssistantProvider>
  );
};

export { ConnectedRewriteAssistantModule as RewriteAssistantModule };
