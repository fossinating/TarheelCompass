import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../auth/[...nextauth]/route"
import { prisma } from '@/lib/Prisma';

export const runtime = 'edge';

export interface AddClassParams {
    scheduleID: string,
    classNumber: number
}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions)
    if (session && session?.user) {
        let data: AddClassParams = await req.json();
        // use `prisma` in your application to read and write data in your DB
    
        const schedule = await prisma.schedule.findFirst({
            where: {
                id: data.scheduleID,
                ownerID: session.user.id as string
            }
        })

        if (schedule == null) {
            return NextResponse.json({
                errMessage: "Could not find the requested schedule. Either it doesn't exist on the server or your user does not have access to modifying it."
            }, {status: 400})
        }

        const addClass = await prisma.scheduledClass.create({
            data: {
                scheduleID: data.scheduleID,
                classNumber: data.classNumber
            }
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