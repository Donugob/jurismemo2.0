import "dotenv/config";
import { defineConfig, env } from "prisma/config";

// Prisma 7 requires connection URLs for migrations to be in this file.
// The provider is still defined in schema.prisma.
export default defineConfig({
  earlyAccess: true,
  schema: "prisma/schema.prisma",
  datasource: {
    url: env("DATABASE_URL") || "file:./dev.db",
  },
});
