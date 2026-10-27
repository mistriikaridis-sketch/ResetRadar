export const MODEL_LABEL = {
  CODEX: 'Codex',
  CLAUDE_CODE: 'Claude Code',
  GROK: 'Grok',
} as const;

export type ModelKey = keyof typeof MODEL_LABEL;
