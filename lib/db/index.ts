import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

type Db = ReturnType<typeof drizzle<typeof schema>>;

let _db: Db | undefined;

function getDb(): Db {
  if (!_db) {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not set");
    }
    const client = postgres(process.env.DATABASE_URL, {
      prepare: false,
      max: 1,
    });
    _db = drizzle(client, { schema });
  }
  return _db;
}

export const db = new Proxy({} as Db, {
  get(_, prop: string) {
    return (getDb() as unknown as Record<string, unknown>)[prop];
  },
});

export * from "./schema";
