import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/backend_lib/auth';
import { schedules } from '@/backend_lib/db/schema';
import { and, eq } from 'drizzle-orm';
import { Env } from '@/api/test/route';
import { createDB } from '@/backend_lib/db/drizzle';

export const runtime = 'edge';

export interface RenameScheduleParams {
    id: string;
    newName: string;
};
 
export async function POST(req: NextRequest, env: Env) {
    const session = await auth()
    if (session && session?.user) {
        const db = createDB(env.DB);

        let data: RenameScheduleParams = await req.json();

        if (session.user.id == null) {
            return NextResponse.json({
                errMessage: "User ID was null. Please report this issue."
            }, {status: 500})
        }

        const updateSchedule = await db.update(schedules).set({name: data.newName}).where(and(eq(schedules.id, data.id), eq(schedules.ownerID, session.user.id)))

        
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