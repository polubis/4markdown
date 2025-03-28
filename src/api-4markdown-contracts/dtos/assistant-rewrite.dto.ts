const ASSISTANT_PERSONAS = [`jelly`, `kate`, `josh`] as const;

type AssistantPersona = (typeof ASSISTANT_PERSONAS)[number];

type AssistantRewriteDto = {
  output: string;
};

export { ASSISTANT_PERSONAS };
export type { AssistantRewriteDto, AssistantPersona };
