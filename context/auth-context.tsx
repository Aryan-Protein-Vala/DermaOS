"use client"

import { createContext, useContext, ReactNode } from "react"
import { useSession, signIn, signOut } from "next-auth/react"

interface User {
    id: string
    email: string
    name?: string | null
    image?: string | null
    subscriptionStatus: string
    skinProfile?: {
        type?: string
        sensitivity?: string
        concerns?: string[]
        pigmentation?: string
    } | null
}

interface AuthContextType {
    user: User | null
    isLoading: boolean
    isAuthenticated: boolean
    signIn: typeof signIn
    signOut: typeof signOut
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
    const { data: session, status } = useSession()

    const user: User | null = session?.user
        ? {
            id: (session.user as any).id || "",
            email: session.user.email || "",
            name: session.user.name,
            image: session.user.image,
            subscriptionStatus: (session.user as any).subscriptionStatus || "free",
            skinProfile: (session.user as any).skinProfile || null,
        }
        : null

    const value: AuthContextType = {
        user,
        isLoading: status === "loading",
        isAuthenticated: status === "authenticated",
        signIn,
        signOut,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}
