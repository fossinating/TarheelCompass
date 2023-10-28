// drizzle.config.ts

import type { Config } from 'drizzle-kit';
import 'dotenv/config';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is missing');
}

export default {
  schema: './app/backend_lib/db/schema.ts',
  out: './app/backend_lib/db/migrations',
  driver: 'mysql2',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL,
  },
} satisfies Config;