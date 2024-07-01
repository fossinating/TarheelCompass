import { NextRequest, NextResponse } from 'next/server'; 
import { auth } from '@/backend_lib/auth';
import { eq } from 'drizzle-orm';
import { schedules } from '@/backend_lib/db/schema';
import { createDB } from '@/backend_lib/db/drizzle';
import { DrizzleD1Database } from 'drizzle-orm/d1';

export interface Env {
  DB: DrizzleD1Database;
}


export const runtime = 'edge';

export async function GET(request: NextRequest, env: Env) {
    const db = createDB(env.DB);
    const session = await auth()
    if (session) {
        if (session.user.id == null) {
            return NextResponse.json({
                errMessage: "User ID was null when trying to update user. Please report this issue."
            }, {status: 500})
        }
        
        const userSchedules = await db.query.schedules.findMany({
            where: eq(schedules.ownerID, session.user.id),
            with: {
                classes: true
            }
        })

        let expanded = userSchedules.map((oldSchedule) => {return {...oldSchedule, classNumbers: oldSchedule.classes.map((classObj) => classObj.classNumber)}})

        let retract = expanded.map(({classes, ...oldSchedule}) => oldSchedule)
         
        return NextResponse.json({ 
            schedules: retract
        }, {status: 200});
    } else {
        // Not Signed in
        return NextResponse.json({}, {status: 401});
    }
}