import { createRequire } from 'node:module';

// Playwright is a devDependency of @open-slide/core and is not hoisted to the root.
const require = createRequire(new URL('../../packages/core/package.json', import.meta.url));

export const resolveFromCore = (id) => require.resolve(id);

export async function launch() {
  const playwright = await import(resolveFromCore('playwright'));
  return (playwright.chromium ?? playwright.default.chromium).launch();
}
