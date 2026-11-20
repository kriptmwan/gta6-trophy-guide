// Hand-in entrypoint for the gta6-trophy-guide-01 entry (Node 22, standard library only).
//
// What it does: it takes the guide that lives next to this file — the static app/
// folder plus the screenshots/ folder — stages both into the output directory, and
// writes the dossier.json summary there through the vendored make.fun library. The
// grader runs this file twice and requires byte-identical output both times, so each
// step below is a plain deterministic copy: no timestamps, no random values, no
// network access.
//
// Run it locally with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// and preview the guide itself in a browser with:
//   node serve.ts        (then visit http://localhost:8080)

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

// The repository root is the directory that holds this file.
const repoRoot = fileURLToPath(new URL('.', import.meta.url));

// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output.
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// The caps the scorer enforces on the handed-in app (the same numbers the starter
// used): the judge-view text is capped at 160 KiB, at most 4 screenshots of at most
// 256 KiB each, and app/ holds at most 993 files and directories and 48 MiB in all.
const dossierCaps = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 50331648,
};

function stageGuide(output: string): void {
  mkdirSync(output, { recursive: true });
  cpSync(join(repoRoot, 'app'), join(output, 'app'), { recursive: true });
  mkdirSync(join(output, 'screenshots'), { recursive: true });
  const shots = join(repoRoot, 'screenshots');
  if (existsSync(shots)) {
    cpSync(shots, join(output, 'screenshots'), { recursive: true });
  }
}

function emitDossier(output: string): void {
  const dossier = buildDossier(output, dossierCaps);
  writeFileSync(join(output, 'dossier.json'), dossier);
}

stageGuide(outputDir);
emitDossier(outputDir);
