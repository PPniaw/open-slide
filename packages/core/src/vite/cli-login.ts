import { type ChildProcess, spawn } from 'node:child_process';

// A CLI login (`vercel login`, `codex login`, `claude auth login`) opens the
// browser itself and waits for the sign-in to land. The child keeps running
// after its prompt is returned; callers poll the CLI's own status command to
// see when it finished.
export type CliLoginJob<T> = {
  child: ChildProcess;
  prompt: Promise<T>;
  // Resolves when the CLI exits, with what it printed.
  done: Promise<{ code: number; output: string }>;
  // Some flows ask for a code pasted back from the browser.
  send(text: string): void;
};

export type CliLoginOptions<T> = {
  cmd: string;
  args: string[];
  cwd: string;
  env?: NodeJS.ProcessEnv;
  parse(output: string): T | null;
  timeoutMs: number;
  promptTimeoutMs: number;
  messages: { missing: string; silent: string; ended: string };
};

export function tail(output: string): string {
  return output.trim().split('\n').slice(-12).join('\n');
}

export function startCliLogin<T>(opts: CliLoginOptions<T>): CliLoginJob<T> {
  const child = spawn(opts.cmd, opts.args, {
    cwd: opts.cwd,
    env: opts.env ?? process.env,
    stdio: ['pipe', 'pipe', 'pipe'],
    shell: process.platform === 'win32',
    windowsHide: true,
  });
  // An unread stdin pipe must not crash the server when the child exits.
  child.stdin?.on('error', () => {});
  const killTimer = setTimeout(() => child.kill(), opts.timeoutMs);
  let output = '';
  const onData = (c: Buffer) => {
    output += c.toString('utf8');
  };
  child.stdout?.on('data', onData);
  child.stderr?.on('data', onData);

  const done = new Promise<{ code: number; output: string }>((resolve) => {
    child.on('error', () => {
      clearTimeout(killTimer);
      resolve({ code: 1, output });
    });
    child.on('close', (code) => {
      clearTimeout(killTimer);
      resolve({ code: code ?? 1, output });
    });
  });

  const prompt = new Promise<T>((resolve, reject) => {
    const promptTimer = setTimeout(() => {
      child.kill();
      reject(new Error(`${opts.messages.silent}\n${tail(output)}`));
    }, opts.promptTimeoutMs);
    const check = () => {
      const found = opts.parse(output);
      if (found === null) return;
      clearTimeout(promptTimer);
      resolve(found);
    };
    child.stdout?.on('data', check);
    child.stderr?.on('data', check);
    child.on('error', (err) => {
      clearTimeout(promptTimer);
      reject(
        (err as NodeJS.ErrnoException).code === 'ENOENT' ? new Error(opts.messages.missing) : err,
      );
    });
    child.on('close', () => {
      clearTimeout(promptTimer);
      reject(new Error(`${opts.messages.ended}\n${tail(output)}`));
    });
  });
  // Callers that only watch `done` must not see an unhandled rejection.
  prompt.catch(() => {});

  return {
    child,
    prompt,
    done,
    send(text) {
      child.stdin?.write(`${text}\n`);
    },
  };
}
