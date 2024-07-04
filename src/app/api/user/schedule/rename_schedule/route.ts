import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/server/auth';
import { scheduleTable } from '@/server/db/schema';
import { and, eq } from 'drizzle-orm';
import { Env } from 'src/app/api/test/route';
import { db } from '@/server/db';

export const runtime = 'edge';

export interface RenameScheduleParams {
    id: string;
    newName: string;
};
 
export async function POST(req: NextRequest) {
    const session = await auth()
    if (session && session?.user) {
        let data: RenameScheduleParams = await req.json();

        if (session.user.id == null) {
            return NextResponse.json({
                errMessage: "User ID was null. Please report this issue."
            }, {status: 500})
        }

        const updateSchedule = await db.update(scheduleTable).set({name: data.newName}).where(and(eq(scheduleTable.id, data.id), eq(scheduleTable.ownerID, session.user.id)))

        
        console.log("updateSchedule:")
        console.log(updateSchedule)

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