const ASSISTANT_PERSONAS = [`jelly`, `kate`, `josh`] as const;

type AssistantPersona = (typeof ASSISTANT_PERSONAS)[number];

export type { AssistantPersona };
export { ASSISTANT_PERSONAS };
