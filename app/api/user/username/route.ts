import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/backend_lib/auth';
import { PrismaClient } from '@prisma/client'
import { db } from '@/backend_lib/db/drizzle';
import { users } from '@/backend_lib/db/schema';
import { eq } from 'drizzle-orm';

export const runtime = 'edge';

export interface ChangeUsernameParams {
    newUsername: string;
}
 
export async function POST(req: NextRequest) {
    const session = await auth()
    if (session && session?.user && session.user?.email) {

        let data: ChangeUsernameParams = await req.json();
        if (data?.newUsername && data.newUsername.length > 2 && data.newUsername.length <= 20 && data.newUsername.match("^[a-z0-9][a-z0-9\_.\-]+[a-z0-9]$") !== null) {
            const prisma = new PrismaClient()
            // use `prisma` in your application to read and write data in your DB
    
            const currentUser = await db.query.users.findFirst({
                where: (users, {eq}) => eq(users.name, data.newUsername)
            })

            if (currentUser !== null) {
                return NextResponse.json({
                    errMessage: "Username is unavailable. Try adding numbers, letters, underscores _ , or periods."
                }, {status: 400})
            }
    
            const updateUser = await db.update(users).set({name: data.newUsername}).where(eq(users.email, session.user.email))
            
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