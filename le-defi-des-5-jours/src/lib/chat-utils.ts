import type { BriefData } from '@/types';

const STEP_TAG_REGEX = /\[STEP:(\d)\]/g;
const JSON_BLOCK_REGEX = /```json\s*([\s\S]*?)\s*```/;
// Incomplete JSON block: ```json without closing ``` (streaming in progress)
const INCOMPLETE_JSON_REGEX = /```json[\s\S]*/;

const BRIEF_REQUIRED_KEYS: (keyof BriefData)[] = [
  'company',
  'contact',
  'sector',
  'problem',
  'users',
  'current_solution',
  'desired_outcome',
  'five_day_scope',
  'suggested_deliverable',
  'notes',
];

function isValidBriefData(obj: unknown): obj is BriefData {
  if (!obj || typeof obj !== 'object') return false;
  return BRIEF_REQUIRED_KEYS.every((key) => key in (obj as Record<string, unknown>));
}

export function extractStep(content: string): { step: number | null; cleanContent: string } {
  let step: number | null = null;
  let match: RegExpExecArray | null;

  // Reset lastIndex before loop (regex is global)
  STEP_TAG_REGEX.lastIndex = 0;
  while ((match = STEP_TAG_REGEX.exec(content)) !== null) {
    step = parseInt(match[1], 10);
  }

  const cleanContent = content.replace(STEP_TAG_REGEX, '').trim();
  return { step, cleanContent };
}

export function extractBrief(content: string): BriefData | null {
  const match = JSON_BLOCK_REGEX.exec(content);
  if (!match || !match[1].trim()) return null;
  try {
    const parsed = JSON.parse(match[1]);
    if (!isValidBriefData(parsed)) {
      console.error('[chat-utils] Brief JSON invalide : champs manquants');
      return null;
    }
    return parsed;
  } catch {
    console.error('[chat-utils] Brief JSON malformé');
    return null;
  }
}

export function cleanContent(content: string): string {
  return content
    .replace(STEP_TAG_REGEX, '')
    .replace(JSON_BLOCK_REGEX, '')      // blocs complets d'abord
    .replace(INCOMPLETE_JSON_REGEX, '') // blocs incomplets (streaming en cours)
    .trim();
}
