// Shared by the CLI and the dev server's publish route, which must not import
// the CLI module itself (it pulls in the Vite config that registers the route).
export const PUBLISHED_LABEL = '已上線：';

const PROJECT_RE = /^[a-z0-9]([a-z0-9._-]{0,98}[a-z0-9])?$/;

export function resolveProjectName(ids: string[], project?: string): string {
  const name = project ?? (ids.length === 1 ? ids[0].toLowerCase() : undefined);
  if (!name) {
    throw new Error('發布多份簡報時，請用 --project <名稱> 指定 Vercel 專案名稱。');
  }
  if (!PROJECT_RE.test(name) || name.includes('---')) {
    throw new Error(
      `Vercel 專案名稱「${name}」不合法：只能用小寫英文、數字、「.」「_」「-」，最多 100 字。`,
    );
  }
  return name;
}
