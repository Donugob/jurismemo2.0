import { defineConfig } from "prisma/config";

// Note: DATABASE_URL should be available in the environment from Render/Railway
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL || "file:./dev.db",
  },
});
