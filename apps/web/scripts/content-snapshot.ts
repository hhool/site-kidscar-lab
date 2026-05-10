import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import {
  defaultPhase3ContentSnapshot,
  type Phase3ContentSnapshot,
} from "../src/lib/phase3-content-defaults";
import {
  ensureContentTable,
  readStoredSnapshot,
  writeContentSnapshot,
} from "../src/lib/phase3-content-service";

const DEFAULT_FILE = path.resolve(process.cwd(), "data/site-content-snapshot.json");

type Command = "seed" | "update" | "export";

function cloneDefaultSnapshot(): Phase3ContentSnapshot {
  return JSON.parse(JSON.stringify(defaultPhase3ContentSnapshot)) as Phase3ContentSnapshot;
}

function isPhase3ContentSnapshot(value: unknown): value is Phase3ContentSnapshot {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<Phase3ContentSnapshot>;
  return Array.isArray(candidate.products)
    && Array.isArray(candidate.reviews)
    && Array.isArray(candidate.rankings)
    && Array.isArray(candidate.news)
    && Array.isArray(candidate.guides)
    && Array.isArray(candidate.brands)
    && Array.isArray(candidate.deals)
    && !!candidate.community
    && Array.isArray(candidate.community.qaPosts)
    && Array.isArray(candidate.community.polls)
    && Array.isArray(candidate.community.feedback);
}

async function fileExists(filePath: string) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function loadSnapshotFromFile(filePath: string): Promise<Phase3ContentSnapshot> {
  const raw = await readFile(filePath, "utf8");
  const parsed = JSON.parse(raw) as unknown;

  if (!isPhase3ContentSnapshot(parsed)) {
    throw new Error(`Snapshot file has invalid shape: ${filePath}`);
  }

  return parsed;
}

async function resolveInputSnapshot(filePath: string) {
  if (await fileExists(filePath)) {
    return loadSnapshotFromFile(filePath);
  }

  return cloneDefaultSnapshot();
}

async function writeSnapshotFile(filePath: string, snapshot: Phase3ContentSnapshot) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(snapshot, null, 2)}\n`, "utf8");
}

function getCommand(): Command {
  const command = process.argv[2];
  if (command === "seed" || command === "update" || command === "export") {
    return command;
  }

  throw new Error("Usage: tsx scripts/content-snapshot.ts <seed|update|export> [file]");
}

function getTargetFilePath() {
  const candidate = process.argv[3];
  return candidate ? path.resolve(process.cwd(), candidate) : DEFAULT_FILE;
}

async function seedSnapshot(filePath: string) {
  await ensureContentTable();

  const existing = await readStoredSnapshot();
  if (existing) {
    console.log(`Snapshot already exists in database. Nothing written. Export with: npm run content:snapshot:export -- ${filePath}`);
    return;
  }

  const snapshot = await resolveInputSnapshot(filePath);
  await writeContentSnapshot(snapshot);
  console.log(`Seeded content_snapshots from ${await fileExists(filePath) ? filePath : "default in-repo snapshot"}.`);
}

async function updateSnapshot(filePath: string) {
  await ensureContentTable();

  const snapshot = await resolveInputSnapshot(filePath);
  await writeContentSnapshot(snapshot);
  console.log(`Updated content_snapshots from ${await fileExists(filePath) ? filePath : "default in-repo snapshot"}.`);
}

async function exportSnapshot(filePath: string) {
  const snapshot = process.env.DATABASE_URL
    ? ((await readStoredSnapshot()) ?? cloneDefaultSnapshot())
    : cloneDefaultSnapshot();
  await writeSnapshotFile(filePath, snapshot);
  console.log(`Exported content snapshot to ${filePath}.`);
}

async function main() {
  const command = getCommand();

  if (!process.env.DATABASE_URL && command !== "export") {
    throw new Error("Missing DATABASE_URL. Seed/update commands only run against a configured database.");
  }

  const filePath = getTargetFilePath();

  if (command === "seed") {
    await seedSnapshot(filePath);
    return;
  }

  if (command === "update") {
    await updateSnapshot(filePath);
    return;
  }

  await exportSnapshot(filePath);
}

void main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
