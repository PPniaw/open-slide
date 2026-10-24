import { spawn } from 'node:child_process';
import type { AgentAuth, AgentProviderId } from './types.ts';

const STATUS_TIMEOUT_MS = 8000;
// Asking a CLI takes ~0.5–1.5 s, and the panel polls /status, so answers are
// reused for a while; a login in progress or a logout asks again.
const AUTH_TTL_MS = 30_000;
const authCache = new Map<string, { at: number; value: Promise<AgentAuth> }>();

export function forgetAuth(id: AgentProviderId): void {
  for (const key of authCache.keys()) if (key.startsWith(`${id}:`)) authCache.delete(key);
}

// How each CLI reports, starts and ends its own sign-in. The panel drives
// these so nobody needs a terminal to log in.
type AuthCommands = {
  status: string[];
  login: string[];
  logout: string[];
  read(code: number, output: string): AgentAuth;
  // The address the CLI opens (or asks to be opened) to sign in.
  loginUrl(output: string): string | null;
};

// `codex login status` exits 0 once signed in ("Logged in using ChatGPT").
export function readCodexAuth(code: number, output: string): AgentAuth {
  if (code === 0) return 'loggedIn';
  return /not logged in/i.test(output) ? 'loggedOut' : 'unknown';
}

// `claude auth status` prints JSON with a `loggedIn` flag.
export function readClaudeAuth(_code: number, output: string): AgentAuth {
  const start = output.indexOf('{');
  const end = output.lastIndexOf('}');
  if (start < 0 || end < start) return 'unknown';
  try {
    const parsed = JSON.parse(output.slice(start, end + 1)) as { loggedIn?: unknown };
    if (typeof parsed.loggedIn !== 'boolean') return 'unknown';
    return parsed.loggedIn ? 'loggedIn' : 'loggedOut';
  } catch {
    return 'unknown';
  }
}

export function firstHttpsUrl(output: string, host: RegExp): string | null {
  for (const match of output.matchAll(/https:\/\/[^\s"'<>]+/g)) {
    try {
      if (host.test(new URL(match[0]).hostname)) return match[0];
    } catch {}
  }
  return null;
}

export const AUTH_COMMANDS: Record<AgentProviderId, AuthCommands> = {
  codex: {
    status: ['login', 'status'],
    login: ['login'],
    logout: ['logout'],
    read: readCodexAuth,
    loginUrl: (output) => firstHttpsUrl(output, /(^|\.)openai\.com$/),
  },
  claude: {
    status: ['auth', 'status'],
    login: ['auth', 'login', '--claudeai'],
    logout: ['auth', 'logout'],
    read: readClaudeAuth,
    loginUrl: (output) => firstHttpsUrl(output, /(^|\.)(claude\.com|claude\.ai|anthropic\.com)$/),
  },
};

export function readAuth(cliPath: string, id: AgentProviderId): Promise<AgentAuth> {
  const key = `${id}:${cliPath}`;
  const cached = authCache.get(key);
  if (cached && Date.now() - cached.at < AUTH_TTL_MS) return cached.value;
  const value = askAuth(cliPath, id);
  authCache.set(key, { at: Date.now(), value });
  return value;
}

function askAuth(cliPath: string, id: AgentProviderId): Promise<AgentAuth> {
  const commands = AUTH_COMMANDS[id];
  return new Promise((resolve) => {
    let output = '';
    let child: ReturnType<typeof spawn>;
    try {
      child = spawn(cliPath, commands.status, {
        stdio: ['ignore', 'pipe', 'pipe'],
        shell: process.platform === 'win32',
        windowsHide: true,
      });
    } catch {
      resolve('unknown');
      return;
    }
    const timer = setTimeout(() => {
      child.kill();
      resolve('unknown');
    }, STATUS_TIMEOUT_MS);
    child.stdout?.on('data', (c: Buffer) => {
      output += c.toString('utf8');
    });
    child.stderr?.on('data', (c: Buffer) => {
      output += c.toString('utf8');
    });
    child.on('error', () => {
      clearTimeout(timer);
      resolve('unknown');
    });
    child.on('close', (code) => {
      clearTimeout(timer);
      resolve(commands.read(code ?? 1, output));
    });
  });
}
