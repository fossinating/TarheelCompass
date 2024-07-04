import { NextRequest, NextResponse } from 'next/server'; 
import { auth } from '@/server/auth';
import { eq } from 'drizzle-orm';
import { scheduleTable } from '@/server/db/schema';
import { db } from '@/server/db';

export interface Env {
  DB: D1Database;
}


export const runtime = 'edge';

export async function GET(request: NextRequest, env: Env) {
    const session = await auth()
    if (session) {
        if (session.user.id == null) {
            return NextResponse.json({
                errMessage: "User ID was null when trying to update user. Please report this issue."
            }, {status: 500})
        }
        
        const userSchedules = await db.query.scheduleTable.findMany({
            where: eq(scheduleTable.ownerID, session.user.id),
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