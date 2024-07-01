import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/backend_lib/auth';
import { scheduledClasses, schedules } from '@/backend_lib/db/schema';
import { createDB } from '@/backend_lib/db/drizzle';
import { and, eq } from 'drizzle-orm';
import { Env } from '@/api/test/route';

export const runtime = 'edge';

export interface RemoveClassParams {
    classNumber: number;
    scheduleID: string;
}

export async function POST(req: NextRequest, env: Env) {
    const session = await auth()
    if (session && session?.user) {
        const db = createDB(env.DB);

        let data: RemoveClassParams = await req.json();
    
        const schedule = await db.query.schedules.findFirst({
           // where: (schedules, {eq, and}) => and(eq(schedules.id, data.scheduleID), eq(schedules.ownerID, session.user.id))
            where: (schedules, {eq, and}) => and(eq(schedules.id, data.scheduleID))
        })

        if (schedule == null) {
            return NextResponse.json({
                errMessage: "Could not find the requested schedule. Either it doesn't exist on the server or your user does not have access to modifying it."
            }, {status: 400})
        }

        const removeClass = await db.delete(scheduledClasses).where(and(eq(scheduledClasses.classNumber, data.classNumber), eq(scheduledClasses.scheduleID, data.scheduleID)))
        
        console.log("Remove Class:")
        console.log(removeClass)

        if (removeClass === null) {
            return NextResponse.json({
                errMessage: "Could not remove class from schedule. Please try again later."
            }, {status: 500})
        }

        return NextResponse.json({ 
            
        }, {status: 200});
    } else {
        // Not Signed in
        return NextResponse.json({}, {status: 401});
    }
}