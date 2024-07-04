import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/server/auth';
import { eq, and } from 'drizzle-orm';
import { scheduledClassTable, scheduleTable } from '@/server/db/schema';
import { Env } from '../../route';
import { db } from '@/server/db';

export const runtime = 'edge';

export interface AddClassParams {
    scheduleID: string,
    classNumber: number
}

export async function POST(req: NextRequest, env: Env) {
    const session = await auth()
    if (session && session?.user) {
        let data: AddClassParams = await req.json();
    
        const schedule = await db.query.scheduleTable.findFirst({
            where: (scheduleTable, {eq}) => and(eq(scheduleTable.id, data.scheduleID), eq(scheduleTable.ownerID, session.user.id as string))
        })

        if (schedule == null) {
            return NextResponse.json({
                errMessage: "Could not find the requested schedule. Either it doesn't exist on the server or your user does not have access to modifying it."
            }, {status: 400})
        }

        const addClass = await db.insert(scheduledClassTable).values({
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