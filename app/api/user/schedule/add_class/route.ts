import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/backend_lib/auth';
import { createDB } from '@/backend_lib/db/drizzle';
import { eq, and } from 'drizzle-orm';
import { scheduledClasses } from '@/backend_lib/db/schema';
import { Env } from '../../route';

export const runtime = 'edge';

export interface AddClassParams {
    scheduleID: string,
    classNumber: number
}

export async function POST(req: NextRequest, env: Env) {
    const session = await auth()
    if (session && session?.user) {
        const db = createDB(env.DB);
        let data: AddClassParams = await req.json();
    
        const schedule = await db.query.schedules.findFirst({
            where: (schedules, {eq}) => and(eq(schedules.id, data.scheduleID), eq(schedules.ownerID, session.user.id as string))
        })

        if (schedule == null) {
            return NextResponse.json({
                errMessage: "Could not find the requested schedule. Either it doesn't exist on the server or your user does not have access to modifying it."
            }, {status: 400})
        }

        const addClass = await db.insert(scheduledClasses).values({
            scheduleID: data.scheduleID,
            classNumber: data.classNumber
        })
        
        if (addClass === null) {
            return NextResponse.json({
                errMessage: "Could not add class to schedule. Please try again later."
            }, {status: 500})
        }

        return NextResponse.json({ 
            
        }, {status: 200});
    } else {
        // Not Signed in
        return NextResponse.json({}, {status: 401});
    }
}