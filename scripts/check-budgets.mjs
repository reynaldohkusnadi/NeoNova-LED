#!/usr/bin/env node
import { spawn } from "node:child_process";
import { createReadStream, promises as fs } from "node:fs";
import { resolve } from "node:path";
import zlib from "node:zlib";

const APP_SHELL_BUDGET_KB = 140;
const THREE_D_PAYLOAD_BUDGET_BYTES = 1_200_000; // 1.2 MB

function run(cmd, args = []) {
  return new Promise((resolveCmd, reject) => {
    const child = spawn(cmd, args, { stdio: ["ignore", "pipe", "pipe"], env: process.env });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (d) => (stdout += d.toString()));
    child.stderr.on("data", (d) => (stderr += d.toString()));
    child.on("exit", (code) => {
      if (code === 0) resolveCmd({ stdout, stderr });
      else reject(new Error(`Command failed (${cmd}): ${code}\n${stderr}`));
    });
  });
}

function extractNumbersFromNextBuild(output) {
  const lines = output.split(/\r?\n/);
  let sharedKb = NaN;
  let routeKb = NaN;
  for (const line of lines) {
    if (Number.isNaN(sharedKb)) {
      const m = line.match(/First Load JS shared by all\s+([0-9.]+)\s*kB/);
      if (m) sharedKb = parseFloat(m[1]);
    }
    if (line.includes("/ ")) {
      // Example: "┌ ○ /                                      412 B         100 kB"
      const m = line.match(/([0-9.]+)\s*kB\s*$/);
      if (m) routeKb = parseFloat(m[1]);
    }
  }
  return { sharedKb, routeKb };
}

async function gzipSizeOfFile(path) {
  const buf = await fs.readFile(path);
  return new Promise((resolveSize, reject) => {
    zlib.gzip(buf, (err, gz) => (err ? reject(err) : resolveSize(gz.length)));
  });
}

async function computeThreeDPayloadBytes() {
  const candidateDirs = [
    "public/models",
    "public/3d",
    "app/(sections)/Hero3D/assets",
  ];
  let total = 0;
  for (const dir of candidateDirs) {
    const abs = resolve(process.cwd(), dir);
    try {
      const entries = await fs.readdir(abs, { withFileTypes: true });
      for (const e of entries) {
        if (e.isFile()) {
          const file = resolve(abs, e.name);
          const stat = await fs.stat(file);
          total += stat.size;
        }
      }
    } catch {
      // ignore missing
    }
  }
  return total;
}

async function main() {
  console.log("[budget] Running next build to capture bundle metrics…");
  const { stdout } = await run("pnpm", ["-s", "next", "build"]).catch(async (e) => {
    // Fallback to next build on PATH
    const res = await run("next", ["build"]);
    return res;
  });
  process.stdout.write(stdout);

  const { sharedKb, routeKb } = extractNumbersFromNextBuild(stdout);
  if (!Number.isFinite(sharedKb) || !Number.isFinite(routeKb)) {
    console.log("[budget] Could not parse Next.js build output; skipping JS budget check.");
  } else {
    console.log(`[budget] App shell (shared) First Load JS: ${sharedKb.toFixed(1)} kB`);
    console.log(`[budget] Route '/' First Load JS: ${routeKb.toFixed(1)} kB`);
    if (sharedKb > APP_SHELL_BUDGET_KB || routeKb > APP_SHELL_BUDGET_KB) {
      console.error(
        `[budget] FAIL: App shell JS exceeds ${APP_SHELL_BUDGET_KB} kB (shared=${sharedKb.toFixed(
          1
        )}, route=${routeKb.toFixed(1)})`
      );
      process.exit(1);
    }
    console.log("[budget] PASS: App shell JS within budget.");
  }

  const threeDBytes = await computeThreeDPayloadBytes();
  console.log(
    `[budget] 3D payload total: ${(threeDBytes / 1_000_000).toFixed(2)} MB (budget ${(THREE_D_PAYLOAD_BUDGET_BYTES /
      1_000_000).toFixed(2)} MB)`
  );
  if (threeDBytes > THREE_D_PAYLOAD_BUDGET_BYTES) {
    console.error("[budget] FAIL: 3D payload exceeds budget.");
    process.exit(1);
  }
  console.log("[budget] PASS: 3D payload within budget.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});


