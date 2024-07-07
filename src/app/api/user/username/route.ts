import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/server/auth';
import { userTable } from '@/server/db/schema';
import { eq } from 'drizzle-orm';
import { db } from '@/server/db';

export const runtime = 'edge';

export interface ChangeUsernameParams {
    newUsername: string;
}
 
export async function POST(req: NextRequest) {
    const session = await auth()
    if (session && session?.user && session.user?.email) {
        let data: ChangeUsernameParams = await req.json();
        if (data?.newUsername && data.newUsername.length > 2 && data.newUsername.length <= 20 && data.newUsername.match("^[a-z0-9][a-z0-9\_.\-]+[a-z0-9]$") !== null) {
    
            const currentUser = await db.query.userTable.findFirst({
                where: (userTable, {eq}) => eq(userTable.name, data.newUsername)
            })

            if (currentUser !== null) {
                return NextResponse.json({
                    errMessage: "Username is unavailable. Try adding numbers, letters, underscores _ , or periods."
                }, {status: 400})
            }
    
            const updateUser = await db.update(userTable).set({name: data.newUsername}).where(eq(userTable.email, session.user.email))
            
            if (updateUser === null) {
                return NextResponse.json({
                    errMessage: "Could not update your username. Please try again later."
                }, {status: 400})
            }

            console.log(updateUser);

            return NextResponse.json({ 
                
            }, {status: 200});
        } else {
            return NextResponse.json({
                errMessage: "Invalid username. Username must be 3-20 characters, characters a-Z, 0-9, `.`, `-`, or `_`, and must start and end with a-Z or 0-9."
            }, {status: 400})
        }
    } else {
        // Not Signed in
        return NextResponse.json({}, {status: 401});
    }
}