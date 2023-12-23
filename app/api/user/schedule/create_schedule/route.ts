import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/backend_lib/auth';
import { db } from '@/backend_lib/db/drizzle';
import { schedules } from '@/backend_lib/db/schema';

export const runtime = 'edge';

export interface CreateScheduleParams {
    id: string;
    name: string;
    term: string;
}
 
export async function POST(req: NextRequest) {
    const session = await auth()
    if (session && session?.user) {

        let data: CreateScheduleParams = await req.json();

        if (data.id.length != 36) {
            return NextResponse.json({
                errMessage: "Invalid schedule id. Please don't try manipulating this api outside of normal use of the program."
            }, {status: 400})
        }

        if (session.user.id == null) {
            return NextResponse.json({
                errMessage: "User ID was null. Please report this issue."
            }, {status: 500})
        }

        const checkSchedule = await db.query.schedules.findFirst({
            where: (schedules, {eq}) => eq(schedules.id, data.id)
        })

        if (checkSchedule != null) {
            return NextResponse.json({
                errMessage: "This schedule ID is already taken. Please try again."
            }, {status: 400})
        }

        const createSchedule = await db.insert(schedules).values({
            id: data.id,
            name: data.name,
            term: data.term,
            ownerID: session.user.id as string
        })
        
        if (createSchedule === null) {
            return NextResponse.json({
                errMessage: "Could not create schedule. Please try again later."
            }, {status: 500})
        }

        return NextResponse.json({ 
            
        }, {status: 200});
    } else {
        // Not Signed in
        return NextResponse.json({}, {status: 401});
    }
}