"use client"

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react"
import { useAuth } from "./auth-context"

interface SkinProfile {
    type?: string // Oily, Dry, Combination, Normal
    sensitivity?: string // Sensitive, Resistant
    concerns?: string[] // Acne, Texture, Hyperpigmentation, etc.
    pigmentation?: string // Pigmented, Non-Pigmented
}

interface SkinProfileContextType {
    skinProfile: SkinProfile | null
    hasPremium: boolean
    isLoading: boolean
    updateProfile: (profile: SkinProfile) => Promise<void>
    refreshProfile: () => Promise<void>
}

const SkinProfileContext = createContext<SkinProfileContextType | undefined>(undefined)

export function SkinProfileProvider({ children }: { children: ReactNode }) {
    const { user, isAuthenticated } = useAuth()
    const [skinProfile, setSkinProfile] = useState<SkinProfile | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const hasPremium = user?.subscriptionStatus === "active" || user?.subscriptionStatus === "trial"

    const refreshProfile = useCallback(async () => {
        if (!isAuthenticated) {
            setSkinProfile(null)
            return
        }

        setIsLoading(true)
        try {
            const res = await fetch("/api/user/profile")
            if (res.ok) {
                const data = await res.json()
                setSkinProfile(data.skinProfile || null)
            }
        } catch (error) {
            console.error("Failed to fetch skin profile:", error)
        } finally {
            setIsLoading(false)
        }
    }, [isAuthenticated])

    const updateProfile = async (profile: SkinProfile) => {
        setIsLoading(true)
        try {
            const res = await fetch("/api/user/profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ skinProfile: profile }),
            })
            if (res.ok) {
                setSkinProfile(profile)
            }
        } catch (error) {
            console.error("Failed to update skin profile:", error)
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (isAuthenticated && user?.skinProfile) {
            setSkinProfile(user.skinProfile)
        } else if (isAuthenticated) {
            refreshProfile()
        } else {
            setSkinProfile(null)
        }
    }, [isAuthenticated, user?.skinProfile, refreshProfile])

    const value: SkinProfileContextType = {
        skinProfile,
        hasPremium,
        isLoading,
        updateProfile,
        refreshProfile,
    }

    return <SkinProfileContext.Provider value={value}>{children}</SkinProfileContext.Provider>
}

export function useSkinProfile() {
    const context = useContext(SkinProfileContext)
    if (context === undefined) {
        throw new Error("useSkinProfile must be used within a SkinProfileProvider")
    }
    return context
}
