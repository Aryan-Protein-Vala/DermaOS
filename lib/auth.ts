import { AuthOptions } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"

export const authOptions: AuthOptions = {
    adapter: PrismaAdapter(db) as any,
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Invalid credentials")
                }

                const user = await db.user.findUnique({
                    where: { email: credentials.email },
                })

                if (!user || !user.passwordHash) {
                    throw new Error("Invalid credentials")
                }

                const isValid = await bcrypt.compare(credentials.password, user.passwordHash)

                if (!isValid) {
                    throw new Error("Invalid credentials")
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    image: user.image,
                }
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user, account }) {
            // Initial sign in - user object is available
            if (user) {
                token.id = user.id
                token.email = user.email
                token.name = user.name
                token.picture = user.image
            }

            // For Google OAuth, fetch user from DB if id not set
            if (account?.provider === "google" && token.email && !token.id) {
                const dbUser = await db.user.findUnique({
                    where: { email: token.email as string },
                })
                if (dbUser) {
                    token.id = dbUser.id
                }
            }

            return token
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.id || token.sub

                // Fetch subscription and skin profile
                if (token.id || token.sub) {
                    try {
                        const dbUser = await db.user.findUnique({
                            where: { id: (token.id || token.sub) as string },
                            select: { subscriptionStatus: true, skinProfile: true, image: true, name: true },
                        })

                        if (dbUser) {
                            (session.user as any).subscriptionStatus = dbUser.subscriptionStatus;
                            (session.user as any).skinProfile = dbUser.skinProfile;
                            if (dbUser.image) session.user.image = dbUser.image;
                            if (dbUser.name) session.user.name = dbUser.name;
                        }
                    } catch (error) {
                        console.error("Session callback error:", error)
                    }
                }
            }
            return session
        },
    },
    pages: {
        signIn: "/", // Use custom modal
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === "development",
}
