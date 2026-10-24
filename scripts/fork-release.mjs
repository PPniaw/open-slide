#!/usr/bin/env node
// Pack or publish the workshop fork under its own npm names.
//
//   node scripts/fork-release.mjs pack [outDir]
//   node scripts/fork-release.mjs publish [--tag next] [--dry-run] [--registry <url>]
//
// The repo keeps the upstream names (@open-slide/core, @open-slide/cli) so
// rebasing onto upstream stays clean. Names change only for the duration of
// this script and every package.json is restored afterwards. `publish` skips a
// package whose version is already on the registry, so CI can run it on every
// push and only new versions go out.
import { spawnSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REPO = 'https://github.com/PPniaw/slidez';
// Keep in sync with packages/core/src/fork.ts.
const PACKAGES = [
  { dir: 'packages/core', name: '@pik-singular/slidez-core' },
  { dir: 'packages/cli', name: '@pik-singular/slidez' },
];

const [mode, ...rest] = process.argv.slice(2);
if (mode !== 'pack' && mode !== 'publish') {
  console.error(
    'usage: fork-release.mjs pack [outDir] | publish [--tag <tag>] [--dry-run] [--registry <url>]',
  );
  process.exit(2);
}
const flag = (name) => {
  const i = rest.indexOf(name);
  return i === -1 ? undefined : rest[i + 1];
};
const registryArgs = flag('--registry') ? ['--registry', flag('--registry')] : [];

function run(cmd, args, cwd, capture = false) {
  const r = spawnSync(cmd, args, { cwd, stdio: capture ? 'pipe' : 'inherit', encoding: 'utf8' });
  if (!capture && r.status !== 0) throw new Error(`${cmd} ${args.join(' ')} failed in ${cwd}`);
  return r;
}

function isPublished(name, version) {
  const r = run('npm', ['view', `${name}@${version}`, 'version', ...registryArgs], ROOT, true);
  return r.status === 0 && r.stdout.trim() === version;
}

// Shipped src/ files are served to the browser as-is, so every import they make
// must be in the tarball too. Stop before anything is packed if one isn't.
run('node', ['scripts/check-pack.mjs'], path.join(ROOT, 'packages/core'));

const outDir = mode === 'pack' ? path.resolve(rest[0] ?? path.join(ROOT, 'dist-fork')) : null;
if (outDir) mkdirSync(outDir, { recursive: true });

for (const pkg of PACKAGES) {
  const cwd = path.join(ROOT, pkg.dir);
  const file = path.join(cwd, 'package.json');
  const original = readFileSync(file, 'utf8');
  const manifest = JSON.parse(original);

  if (mode === 'publish' && isPublished(pkg.name, manifest.version)) {
    console.log(`= ${pkg.name}@${manifest.version} is already published, skipping`);
    continue;
  }

  const forked = {
    ...manifest,
    name: pkg.name,
    homepage: REPO,
    repository: { type: 'git', url: `git+${REPO}.git`, directory: pkg.dir },
    bugs: { url: `${REPO}/issues` },
    publishConfig: { ...manifest.publishConfig, access: 'public' },
  };
  writeFileSync(file, `${JSON.stringify(forked, null, 2)}\n`);
  try {
    if (mode === 'pack') {
      run('npm', ['pack', '--pack-destination', outDir], cwd);
    } else {
      const args = ['publish', '--access', 'public', ...registryArgs];
      if (flag('--tag')) args.push('--tag', flag('--tag'));
      if (rest.includes('--dry-run')) args.push('--dry-run');
      run('npm', args, cwd);
    }
    console.log(`✔ ${pkg.name}@${manifest.version}`);
  } finally {
    writeFileSync(file, original);
  }
}
