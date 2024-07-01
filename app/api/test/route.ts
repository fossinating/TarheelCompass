import type { DrizzleD1Database } from 'drizzle-orm/d1';
import { drizzle } from 'drizzle-orm/d1';
import { NextRequest, NextResponse } from 'next/server';
import { users } from '@/backend_lib/db/schema';
import { eq } from 'drizzle-orm';

export const runtime = 'edge';

export interface Env {
	DB: D1Database;
}

interface Request extends NextRequest {
	db: DrizzleD1Database;
}
 
export async function GET(req: Request, env: Env ) {
    const db = drizzle(env.DB);
    req.db = db;

    const currentUser = await req.db.select().from(users).execute();

    if (currentUser !== null) {
        return NextResponse.json({
            errMessage: "Username is unavailable. Try adding numbers, letters, underscores _ , or periods."
        }, {status: 400})
    }
}