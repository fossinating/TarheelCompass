import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/server/auth';
import { eq, and } from 'drizzle-orm';
import { scheduleTable } from '@/server/db/schema';
import { Env } from '../../route';
import { db } from '@/server/db';

export const runtime = 'edge';

export interface DeleteScheduleParams {
    id: string;
}
 
export async function POST(req: NextRequest, env: Env) {
    const session = await auth()
    if (session && session?.user) {
        let data: DeleteScheduleParams = await req.json();

        if (session.user.id == null) {
            return NextResponse.json({
                errMessage: "User ID was null. Please report this issue."
            }, {status: 500})
        }

        const deleteSchedule = await db.delete(scheduleTable).where(and(eq(scheduleTable.id, data.id), eq(scheduleTable.ownerID, session.user.id)))

        if (deleteSchedule != null) {
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