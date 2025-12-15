import "dotenv/config";

import { defineConfig } from "drizzle-kit";

export default defineConfig({
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
    schema: "./db/schema.ts",
    out: "./drizzle",
    dialect: "postgresql",
});
