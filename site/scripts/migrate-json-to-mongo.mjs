import fs from "fs";
import path from "path";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://novastack:Marilene0310@127.0.0.1:27017/novastack?authSource=novastack";

const client = new MongoClient(uri);

async function run() {
  const file = path.join(process.cwd(), "data", "leads.json");

  if (!fs.existsSync(file)) {
    console.log("Arquivo leads.json não encontrado.");
    process.exit(0);
  }

  const raw = fs.readFileSync(file, "utf8");
  const leads = JSON.parse(raw);

  if (!Array.isArray(leads) || leads.length === 0) {
    console.log("Nenhum lead para migrar.");
    process.exit(0);
  }

  await client.connect();
  const db = client.db("novastack");
  const collection = db.collection("leads");

  let inserted = 0;

  for (const lead of leads) {
    const exists = await collection.findOne({ id: lead.id });
    if (!exists) {
      await collection.insertOne(lead);
      inserted++;
    }
  }

  console.log(`Migração finalizada. ${inserted} leads inseridos.`);

  await client.close();
}

run().catch(err => {
  console.error("Erro na migração:", err);
  process.exit(1);
});
