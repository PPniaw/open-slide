import { describe, expect, it } from 'vitest';
import { AUTH_COMMANDS, firstHttpsUrl, readClaudeAuth, readCodexAuth } from './auth.ts';
import { parseInstallProgress } from './status.ts';

describe('readCodexAuth', () => {
  it('reads `codex login status`', () => {
    expect(readCodexAuth(0, 'Logged in using ChatGPT\n')).toBe('loggedIn');
    expect(readCodexAuth(1, 'Not logged in\n')).toBe('loggedOut');
    expect(readCodexAuth(1, 'error: something else')).toBe('unknown');
  });
});

describe('readClaudeAuth', () => {
  it('reads the JSON from `claude auth status`', () => {
    expect(readClaudeAuth(1, '{\n  "loggedIn": false,\n  "authMethod": "none"\n}\n')).toBe(
      'loggedOut',
    );
    expect(readClaudeAuth(0, '{"loggedIn": true, "authMethod": "claude.ai"}')).toBe('loggedIn');
    expect(readClaudeAuth(1, 'command not found')).toBe('unknown');
  });
});

describe('login urls', () => {
  it('picks the sign-in page each CLI prints', () => {
    const claude =
      "Opening browser to sign in…\nIf the browser didn't open, visit: https://claude.com/cai/oauth/authorize?code=true&client_id=x\nPaste code here if prompted > ";
    expect(AUTH_COMMANDS.claude.loginUrl(claude)).toBe(
      'https://claude.com/cai/oauth/authorize?code=true&client_id=x',
    );
    const codex =
      'Starting local login server on http://localhost:1455.\nIf your browser did not open, navigate to this URL to authenticate:\n\nhttps://auth.openai.com/oauth/authorize?response_type=code&client_id=app_x\n';
    expect(AUTH_COMMANDS.codex.loginUrl(codex)).toBe(
      'https://auth.openai.com/oauth/authorize?response_type=code&client_id=app_x',
    );
  });

  it('ignores addresses on other hosts', () => {
    expect(firstHttpsUrl('see https://evil.example/claude.com', /(^|\.)claude\.com$/)).toBeNull();
  });
});

describe('parseInstallProgress', () => {
  it('reads progress lines and clamps them', () => {
    expect(parseInstallProgress('progress 0.42')).toBe(0.42);
    expect(parseInstallProgress('progress 1.5')).toBe(1);
    expect(parseInstallProgress('downloading…')).toBeNull();
  });
});
