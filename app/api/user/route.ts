import { NextResponse } from 'next/server';
import { prismaEdge } from '@/lib/Prisma';
import { auth } from '@/lib/auth';

export const runtime = 'edge';

export async function GET() {
    const session = await auth()
    if (session) {
        if (session.user.id == null) {
            return NextResponse.json({
                errMessage: "User ID was null when trying to update user. Please report this issue."
            }, {status: 500})
        }
        
        const userSchedules = await prismaEdge.schedule.findMany({
            where: {
                ownerID: session.user.id as string
            },
            include: {
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