import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"

export async function POST(req: Request) {
    try {
        const { email, password, name } = await req.json()

        if (!email || !password) {
            return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
        }

        // Check if user already exists
        const existingUser = await db.user.findUnique({
            where: { email },
        })

        if (existingUser) {
            return NextResponse.json({ error: "Email already registered" }, { status: 400 })
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 12)

        // Create user
        const user = await db.user.create({
            data: {
                email,
                name,
                passwordHash,
                subscriptionStatus: "free",
            },
        })

        return NextResponse.json({
            id: user.id,
            email: user.email,
            name: user.name,
        })
    } catch (error) {
        console.error("Registration error:", error)
        return NextResponse.json({ error: "Failed to create account" }, { status: 500 })
    }
}
