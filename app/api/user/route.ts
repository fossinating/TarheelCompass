import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"
import { prisma } from '@/lib/Prisma';

export const runtime = 'edge';
 
export async function GET() {
    const session = await getServerSession(authOptions)
    if (session) {
        if (session.user.id == null) {
            return NextResponse.json({
                errMessage: "User ID was null when trying to update user. Please report this issue."
            }, {status: 500})
        }
        
        const userSchedules = await prisma.schedule.findMany({
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