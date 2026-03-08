import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
    const response = NextResponse.next()

    // Check if region cookie already exists
    const existingRegion = request.cookies.get("DERMA_REGION")?.value

    if (!existingRegion) {
        // Detect country from Vercel Edge geo
        // @ts-ignore - geo is available on Vercel Edge
        const country = request.geo?.country || "US"

        // Set region based on country
        const region = country === "IN" ? "IN" : "GLOBAL"

        // Set cookie that expires in 30 days
        response.cookies.set("DERMA_REGION", region, {
            httpOnly: false, // Accessible via JS for client-side reads
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 30, // 30 days
            path: "/",
        })
    }

    return response
}

export const config = {
    matcher: [
        // Match all paths except static files and api routes
        "/((?!_next/static|_next/image|favicon.ico|api).*)",
    ],
}
