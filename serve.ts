// Leonida Trophy Guide — local preview server.
//
// Serves app/ on http://localhost:8080 so the guide can be tried in a
// desktop browser exactly as the static files stand. Node standard
// library only; no network calls, no build step.

import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const appDir = join(dirname(fileURLToPath(import.meta.url)), "app");
const PORT = 8080;

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
};

const server = createServer(async (req, res) => {
  try {
    const path = decodeURIComponent(new URL(req.url || "/", "http://localhost").pathname);
    const rel = path === "/" ? "index.html" : path.replace(/^\/+/, "");
    const file = normalize(join(appDir, rel));
    if (!file.startsWith(appDir + sep) && file !== appDir) {
      res.writeHead(403);
      res.end("Forbidden");
      return;
    }
    const body = await readFile(file);
    res.writeHead(200, { "content-type": TYPES[extname(file)] || "application/octet-stream" });
    res.end(body);
  } catch (err) {
    res.writeHead(404);
    res.end("Not found");
  }
});

server.listen(PORT, () => {
  console.log(`Leonida Trophy Guide at http://localhost:${PORT}`);
});
