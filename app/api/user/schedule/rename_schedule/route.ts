import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../auth/[...nextauth]/route"
import { prisma } from '@/lib/Prisma';
 
export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions)
    if (session && session?.user) {
        let data: {id: string, name: string} = await req.json();
        // use `prisma` in your application to read and write data in your DB

        if (session.user.id == null) {
            return NextResponse.json({
                errMessage: "User ID was null. Please report this issue."
            }, {status: 500})
        }

        const updateSchedule = await prisma.schedule.update({
            where: {
                id: data.id,
                ownerID: session.user.id
            },
            data: {
                name: data.name
            }
        })

        if (updateSchedule != null) {
            return NextResponse.json({
                errMessage: "Could not find the requested schedule. Either it doesn't exist on the server or your user does not have access to modifying it."
            }, {status: 400})
        }

        return NextResponse.json({ 
            
        }, {status: 200});
    } else {
        // Not Signed in
        return NextResponse.json({}, {status: 401});
    }
}