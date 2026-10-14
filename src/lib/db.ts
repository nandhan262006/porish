import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "../../drizzle/schema";

const url = process.env.TURSO_DATABASE_URL ?? "file:./data/cms.db";
const authToken = process.env.TURSO_AUTH_TOKEN || undefined;

// Single shared client (Next dev HMR-safe via globalThis)
const globalForDb = globalThis as unknown as {
  __cmsClient?: ReturnType<typeof createClient>;
  __cmsDb?: ReturnType<typeof drizzle>;
};

function isTransient(error: unknown): boolean {
  const text = error instanceof Error ? `${error.message} ${error.cause ?? ""}` : String(error);
  return /timeout|fetch failed|ECONNRESET|EAI_AGAIN|UND_ERR|network/i.test(text);
}

function withRetry<T extends { execute: (...args: never[]) => Promise<unknown> }>(client: T): T {
  const execute = client.execute.bind(client);
  client.execute = (async (...args: never[]) => {
    let last: unknown;
    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        return await execute(...args);
      } catch (error) {
        last = error;
        if (!isTransient(error) || attempt === 2) throw error;
        await new Promise((resolve) => setTimeout(resolve, 400 * (attempt + 1)));
      }
    }
    throw last;
  }) as T["execute"];
  return client;
}

function getClient() {
  if (!globalForDb.__cmsClient) {
    globalForDb.__cmsClient = withRetry(createClient({ url, authToken }));
  }
  return globalForDb.__cmsClient;
}

export function getDb() {
  if (!globalForDb.__cmsDb) {
    globalForDb.__cmsDb = drizzle(getClient(), { schema });
  }
  return globalForDb.__cmsDb;
}

export { schema };
