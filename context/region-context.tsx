"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

type Region = "IN" | "GLOBAL"

interface RegionContextType {
    region: Region
    currencySymbol: string
    currencyCode: string
    toggleRegion: () => void
    setRegion: (region: Region) => void
}

const RegionContext = createContext<RegionContextType | undefined>(undefined)

function getCookie(name: string): string | null {
    if (typeof document === "undefined") return null
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop()?.split(";").shift() || null
    return null
}

function setCookie(name: string, value: string, days: number = 30) {
    if (typeof document === "undefined") return
    const expires = new Date(Date.now() + days * 864e5).toUTCString()
    document.cookie = `${name}=${value}; expires=${expires}; path=/`
}

export function RegionProvider({ children }: { children: ReactNode }) {
    const [region, setRegionState] = useState<Region>("GLOBAL")

    useEffect(() => {
        // Read region from cookie on mount
        const savedRegion = getCookie("DERMA_REGION") as Region | null
        if (savedRegion && (savedRegion === "IN" || savedRegion === "GLOBAL")) {
            setRegionState(savedRegion)
        }
    }, [])

    const setRegion = (newRegion: Region) => {
        setRegionState(newRegion)
        setCookie("DERMA_REGION", newRegion)
    }

    const toggleRegion = () => {
        const newRegion = region === "IN" ? "GLOBAL" : "IN"
        setRegion(newRegion)
    }

    const value: RegionContextType = {
        region,
        currencySymbol: region === "IN" ? "₹" : "$",
        currencyCode: region === "IN" ? "INR" : "USD",
        toggleRegion,
        setRegion,
    }

    return <RegionContext.Provider value={value}>{children}</RegionContext.Provider>
}

export function useRegion() {
    const context = useContext(RegionContext)
    if (context === undefined) {
        throw new Error("useRegion must be used within a RegionProvider")
    }
    return context
}
