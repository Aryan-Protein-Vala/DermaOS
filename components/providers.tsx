"use client"

import { SessionProvider } from "next-auth/react"
import { RegionProvider } from "@/context/region-context"
import { AuthProvider } from "@/context/auth-context"
import { SkinProfileProvider } from "@/context/skin-profile-context"
import { OnboardingWrapper } from "@/components/onboarding-wrapper"

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <RegionProvider>
                <AuthProvider>
                    <SkinProfileProvider>
                        <OnboardingWrapper>
                            {children}
                        </OnboardingWrapper>
                    </SkinProfileProvider>
                </AuthProvider>
            </RegionProvider>
        </SessionProvider>
    )
}
