import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db"

export async function GET() {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const user = await db.user.findUnique({
            where: { id: (session.user as any).id },
            select: {
                skinProfile: true,
                subscriptionStatus: true,
            },
        })

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 })
        }

        return NextResponse.json({
            skinProfile: user.skinProfile,
            subscriptionStatus: user.subscriptionStatus,
        })
    } catch (error) {
        console.error("Profile GET error:", error)
        return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }

        const { skinProfile } = await req.json()

        const user = await db.user.update({
            where: { id: (session.user as any).id },
            data: { skinProfile },
            select: {
                skinProfile: true,
                subscriptionStatus: true,
            },
        })

        return NextResponse.json({
            skinProfile: user.skinProfile,
            subscriptionStatus: user.subscriptionStatus,
        })
    } catch (error) {
        console.error("Profile POST error:", error)
        return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
    }
}
