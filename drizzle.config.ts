import type { Config } from "drizzle-kit";

export default {
  schema: "./drizzle/schema.ts",
  out: "./drizzle/migrations",
  dialect: "turso",
  dbCredentials: {
    // Local file by default; CI/prod pass TURSO_DATABASE_URL + TURSO_AUTH_TOKEN
    url: process.env.TURSO_DATABASE_URL ?? "file:./data/cms.db",
    authToken: process.env.TURSO_AUTH_TOKEN,
  },
} satisfies Config;
