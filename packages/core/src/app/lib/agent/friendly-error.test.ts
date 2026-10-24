import { describe, expect, it } from 'vitest';
import { classifyAgentError } from './friendly-error';

describe('classifyAgentError', () => {
  it('names a missing sign-in', () => {
    expect(
      classifyAgentError(
        'unexpected status 401 Unauthorized: Missing bearer or basic authentication in header',
      ),
    ).toBe('auth');
    expect(classifyAgentError('Invalid API key · Please run /login')).toBe('auth');
    expect(classifyAgentError('Not logged in')).toBe('auth');
  });

  it('names a used-up allowance', () => {
    expect(classifyAgentError("Usage limit reached. You've reached your usage limit.")).toBe(
      'quota',
    );
    expect(classifyAgentError('Claude AI usage limit reached|1760000000')).toBe('quota');
    expect(classifyAgentError('unexpected status 429 Too Many Requests')).toBe('quota');
  });

  it('names a dropped connection', () => {
    expect(classifyAgentError('stream disconnected before completion')).toBe('network');
    expect(classifyAgentError('getaddrinfo ENOTFOUND api.openai.com')).toBe('network');
  });

  it('treats notices as warnings, not failures', () => {
    expect(
      classifyAgentError(
        'This session was recorded with model `gpt-6-sol` but is resuming with `gpt-6-luna`.',
      ),
    ).toBe('warning');
  });

  it('leaves anything else as is', () => {
    expect(classifyAgentError('The model produced an invalid tool call')).toBe('other');
  });
});
