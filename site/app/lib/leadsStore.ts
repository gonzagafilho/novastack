import { promises as fs } from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const FILE = path.join(DATA_DIR, "leads.json");
const LOCK = path.join(DATA_DIR, ".leads.lock");
const BACKUP_DIR = path.join(DATA_DIR, "backups");

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function acquireLock(retries = 25, delayMs = 80) {
  for (let i = 0; i < retries; i++) {
    try {
      const fh = await fs.open(LOCK, "wx"); // falha se já existe
      await fh.close();
      return;
    } catch {
      await sleep(delayMs);
    }
  }
  throw new Error("Não consegui obter lock do leads.json");
}

async function releaseLock() {
  try {
    await fs.unlink(LOCK);
  } catch {}
}

export async function readLeads(): Promise<any[]> {
  try {
    const raw = await fs.readFile(FILE, "utf-8");
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : data?.leads ?? [];
  } catch {
    return [];
  }
}

export async function writeLeads(leads: any[]) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.mkdir(BACKUP_DIR, { recursive: true });

  await acquireLock();
  try {
    // backup diário (sempre sobrescreve o do dia)
    const day = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const backupFile = path.join(BACKUP_DIR, `leads-${day}.json`);
    const exists = await fs.stat(FILE).then(() => true).catch(() => false);
    if (exists) await fs.copyFile(FILE, backupFile);

    // escrita atômica
    const tmp = FILE + ".tmp";
    await fs.writeFile(tmp, JSON.stringify(leads, null, 2), "utf-8");
    await fs.rename(tmp, FILE);
  } finally {
    await releaseLock();
  }
}
