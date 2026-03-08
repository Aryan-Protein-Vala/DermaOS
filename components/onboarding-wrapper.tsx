"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/context/auth-context"
import { useSkinProfile } from "@/context/skin-profile-context"
import { OnboardingModal } from "@/components/modals/onboarding-modal"

const ONBOARDING_COMPLETED_KEY = "dermaos_onboarding_completed"

export function OnboardingWrapper({ children }: { children: React.ReactNode }) {
    const { isAuthenticated, isLoading: authLoading, user } = useAuth()
    const { skinProfile, isLoading: profileLoading } = useSkinProfile()
    const [showOnboarding, setShowOnboarding] = useState(false)

    useEffect(() => {
        // Wait for both auth and profile to load
        if (authLoading || profileLoading) return

        // Check if user has already completed onboarding (stored in localStorage)
        const onboardingKey = user?.email ? `${ONBOARDING_COMPLETED_KEY}_${user.email}` : ONBOARDING_COMPLETED_KEY
        const hasCompletedOnboarding = localStorage.getItem(onboardingKey) === "true"

        if (hasCompletedOnboarding) {
            setShowOnboarding(false)
            return
        }

        // Check if user has any skin profile data (from onboarding OR AI analysis)
        const profile = skinProfile as any
        const hasSkinData = profile && (
            profile.type ||        // From onboarding
            profile.skinType ||    // From AI analysis
            Object.keys(profile).length > 0
        )

        // Only show onboarding for authenticated users without any profile data
        if (isAuthenticated && !hasSkinData) {
            const timer = setTimeout(() => {
                setShowOnboarding(true)
            }, 500)
            return () => clearTimeout(timer)
        }
    }, [isAuthenticated, skinProfile, authLoading, profileLoading, user])

    const handleOnboardingComplete = () => {
        setShowOnboarding(false)

        // Mark onboarding as completed in localStorage
        const onboardingKey = user?.email ? `${ONBOARDING_COMPLETED_KEY}_${user.email}` : ONBOARDING_COMPLETED_KEY
        localStorage.setItem(onboardingKey, "true")

        // Refresh the page to update product grades
        window.location.reload()
    }

    return (
        <>
            {children}
            <OnboardingModal
                isOpen={showOnboarding}
                onComplete={handleOnboardingComplete}
            />
        </>
    )
}

