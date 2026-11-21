// gta6-trophy-guide-01 — build the submission dossier into the output dir.
//
// The grader mounts the output directory as a volume, so this program must
// never remove the directory itself: deleting a mounted volume fails with
// EBUSY. Instead we create it if needed and empty out whatever is inside it,
// then copy the app and screenshots in and write dossier.json alongside them.

import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot: string = fileURLToPath(new URL('.', import.meta.url));
const outDir: string = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

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

const appDir: string = join(repoRoot, 'app');
const shotsDir: string = join(repoRoot, 'screenshots');

if (!existsSync(appDir)) {
  fail('app/ directory is missing from the repository');
}
if (!existsSync(join(appDir, 'index.html'))) {
  fail('app/index.html is missing');
}
if (!existsSync(shotsDir)) {
  fail('screenshots/ directory is missing from the repository');
}

// Make sure the output directory exists, then wipe only its contents.
// The directory itself stays put — removing it would hit EBUSY on the
// grader's mounted volume.
mkdirSync(outDir, { recursive: true });
for (const entry of readdirSync(outDir)) {
  rmSync(join(outDir, entry), { recursive: true, force: true });
}

cpSync(appDir, join(outDir, 'app'), { recursive: true });
cpSync(shotsDir, join(outDir, 'screenshots'), { recursive: true });

const dossier: string = buildDossier(outDir, caps);
const dossierPath: string = join(outDir, 'dossier.json');
writeFileSync(dossierPath, dossier);
console.log('wrote ' + dossierPath + ' (' + dossier.length + ' bytes)');
