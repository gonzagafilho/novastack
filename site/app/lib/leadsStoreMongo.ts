import clientPromise from "@/app/lib/mongo";

type LeadAny = any;

async function col() {
  const client = await clientPromise;
  const db = client.db(); // pega do URI
  return db.collection<LeadAny>("leads");
}

export async function readLeadsMongo(): Promise<LeadAny[]> {
  const c = await col();
  return await c.find({}).sort({ createdAt: -1 }).toArray();
}

export async function findLeadMongo(id: string): Promise<LeadAny | null> {
  const c = await col();
  return await c.findOne({ id });
}

export async function upsertLeadMongo(lead: LeadAny) {
  const c = await col();
  await c.updateOne({ id: lead.id }, { $set: lead }, { upsert: true });
}

export async function updateLeadMongo(id: string, patch: Partial<LeadAny>) {
  const c = await col();
  await c.updateOne({ id }, { $set: patch });
}
