// Leonida Trophy Guide — entrypoint the grader runs (Node 22).
// Copies app/ and screenshots/ into the output directory and writes
// /output/dossier.json with make.fun's frontend dossier library.
// Deterministic: the same repository writes the same dossier bytes.
import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const caps = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 50331648,
};

function fail(message: string): never {
  console.error('main.ts: ' + message);
  process.exit(1);
}

const appDir = join(repoRoot, 'app');
const shotsDir = join(repoRoot, 'screenshots');
if (!existsSync(appDir)) fail('app/ directory is missing from the repository');
if (!existsSync(join(appDir, 'index.html'))) fail('app/index.html is missing');
if (!existsSync(shotsDir)) fail('screenshots/ directory is missing from the repository');

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });
cpSync(appDir, join(outDir, 'app'), { recursive: true });
cpSync(shotsDir, join(outDir, 'screenshots'), { recursive: true });

const dossier = buildDossier(outDir, caps);
writeFileSync(join(outDir, 'dossier.json'), dossier);
console.log('wrote ' + join(outDir, 'dossier.json') + ' (' + dossier.length + ' bytes)');
