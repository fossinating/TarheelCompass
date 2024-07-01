// drizzle.config.ts

import { defineConfig } from "drizzle-kit";
import 'dotenv/config';
import fs from 'fs';
import path from "path";

function getLocalD1DB() {
	try {
		const basePath = path.resolve('.wrangler');
		const dbFile = fs
			.readdirSync(basePath, { encoding: 'utf-8' })
			.find((f) => f.endsWith('.sqlite'));

		if (!dbFile) {
			throw new Error(`.sqlite file not found in ${basePath}`);
		}

		const url = path.resolve(basePath, dbFile);
		return url;
	} catch (err: any) {
		console.log(`Error  ${err.message}`);
	}
}

export default defineConfig ({
  schema: './app/backend_lib/db/schema.ts',
  out: './app/backend_lib/db/migrations',
  dialect: 'sqlite',
  
	...(process.env.NODE_ENV === 'production'
		? {
				driver: 'd1-http',
				dbCredentials: {
					accountId: process.env.CLOUDFLARE_D1_ACCOUNT_ID,
					databaseId: 'dd85f584-590a-4b27-bce3-633ee97bc048',
					token: process.env.CLOUDFLARE_D1_API_TOKEN
				}
			}
		: {
				dbCredentials: {
					url: getLocalD1DB()
				}
			})
});