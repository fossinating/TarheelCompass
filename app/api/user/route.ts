import { NextResponse } from 'next/server';
import { prismaEdge } from '@/lib/Prisma';
import { auth } from '@/backend_lib/auth';
import { db } from '@/backend_lib/db/drizzle';
import { eq } from 'drizzle-orm';
import { schedules } from '@/backend_lib/db/schema';

export const runtime = 'edge';

export async function GET() {
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