const REWRITE_ASSISTANT_PERSONAS = [`cleany`, `grammy`, `teacher`] as const;

type RewriteAssistantPersona = (typeof REWRITE_ASSISTANT_PERSONAS)[number];

export type { RewriteAssistantPersona };
export { REWRITE_ASSISTANT_PERSONAS };
