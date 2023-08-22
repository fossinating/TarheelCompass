import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"
 
export async function GET() {
    const session = await getServerSession(authOptions)
    if (session) {
        // Signed in
        console.log("Session", JSON.stringify(session, null, 2))
  
 
        return NextResponse.json({ 
            
        }, {status: 200});
    } else {
        // Not Signed in
        return NextResponse.json({}, {status: 401});
    }
}