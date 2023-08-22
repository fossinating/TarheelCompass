import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import { PrismaClient } from '@prisma/client'
 
export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions)
    if (session && session?.user && session.user?.email) {
        let data = await req.json();
        if (data?.username && data.username.length > 2 && data.username.length <= 20 && data.username.match("^[a-z0-9][a-z0-9\_.\-]+[a-z0-9]$") !== null) {
            const prisma = new PrismaClient()
            // use `prisma` in your application to read and write data in your DB
    
            const currentUser = await prisma.user.findFirst({
                where: {
                    name: data.username
                }
            })

            if (currentUser !== null) {
                return NextResponse.json({
                    errMessage: "Username is unavailable. Try adding numbers, letters, underscores _ , or periods."
                }, {status: 400})
            }
    
            const updateUser = await prisma.user.update({
                where: {
                    email: session.user.email
                },
                data: {
                    name: data.username
                }
            })
            
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