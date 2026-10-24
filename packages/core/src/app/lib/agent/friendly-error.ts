// Raw agent errors ("unexpected status 401 Unauthorized: Missing bearer…")
// mean nothing to a first-time user, so the panel names the few that have a
// clear fix and keeps the original text behind a disclosure.
export type AgentErrorKind = 'auth' | 'quota' | 'network' | 'warning' | 'other';

const PATTERNS: [AgentErrorKind, RegExp][] = [
  // Notices the CLI prints while it keeps working; not failures.
  ['warning', /^\s*(warning\b|this session was recorded with model)/i],
  [
    'quota',
    /usage limit|rate limit|\b429\b|quota|out of credits|credit balance|hit your limit|limit reached/i,
  ],
  [
    'auth',
    /\b401\b|unauthori[sz]ed|not logged in|missing bearer|invalid api key|please run \/?login|oauth token|token (has )?expired|authentication/i,
  ],
  [
    'network',
    /ENOTFOUND|ECONNRESET|ECONNREFUSED|ETIMEDOUT|EAI_AGAIN|fetch failed|network|stream disconnected|socket hang up/i,
  ],
];

export function classifyAgentError(text: string): AgentErrorKind {
  for (const [kind, pattern] of PATTERNS) {
    if (pattern.test(text)) return kind;
  }
  return 'other';
}
