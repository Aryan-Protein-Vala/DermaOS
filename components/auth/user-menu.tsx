"use client"

import { signOut } from "next-auth/react"
import { useAuth } from "@/context/auth-context"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Settings, LogOut, Sparkles } from "lucide-react"
import { SkinProfileModal } from "@/components/modals/skin-profile-modal"
import { SettingsModal } from "@/components/modals/settings-modal"
import { UpgradeModal } from "@/components/modals/upgrade-modal"

export function UserMenu() {
    const { user } = useAuth()

    if (!user) return null

    const initials = user.name
        ? user.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
        : user.email?.[0].toUpperCase() || "U"

    const isPremium = user.subscriptionStatus === "active" || user.subscriptionStatus === "trial"

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none cursor-pointer">
                <div className="relative group">
                    {/* Premium animated gradient ring */}
                    {isPremium && (
                        <>
                            {/* Outer glow */}
                            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 opacity-75 blur-sm group-hover:opacity-100 transition-opacity" />
                            {/* Spinning gradient ring */}
                            <div
                                className="absolute -inset-[3px] rounded-full animate-spin-slow"
                                style={{
                                    background: 'conic-gradient(from 0deg, #fbbf24, #f59e0b, #d97706, #fbbf24)',
                                }}
                            />
                            {/* Inner mask to create ring effect */}
                            <div className="absolute inset-0 rounded-full bg-[#FAFAFA]" />
                        </>
                    )}
                    <Avatar className={`h-8 w-8 relative z-10 ${isPremium ? '' : 'border border-[#E5E5E5]'}`}>
                        <AvatarImage src={user.image || undefined} alt={user.name || ""} />
                        <AvatarFallback className="bg-foreground text-background font-mono text-xs">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white border-[#E5E5E5]">
                <div className="px-3 py-2 border-b border-[#E5E5E5]">
                    <p className="font-mono text-sm font-medium">{user.name || "User"}</p>
                    <p className="font-mono text-xs text-muted-foreground">{user.email}</p>
                </div>

                <SkinProfileModal>
                    <DropdownMenuItem className="font-mono text-sm cursor-pointer" onSelect={(e) => e.preventDefault()}>
                        <User className="w-4 h-4 mr-2" />
                        My Skin Profile
                    </DropdownMenuItem>
                </SkinProfileModal>

                <SettingsModal>
                    <DropdownMenuItem className="font-mono text-sm cursor-pointer" onSelect={(e) => e.preventDefault()}>
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                    </DropdownMenuItem>
                </SettingsModal>

                {!isPremium && (
                    <UpgradeModal>
                        <DropdownMenuItem className="font-mono text-sm cursor-pointer text-amber-600" onSelect={(e) => e.preventDefault()}>
                            <Sparkles className="w-4 h-4 mr-2" />
                            Upgrade to Pro
                        </DropdownMenuItem>
                    </UpgradeModal>
                )}

                <DropdownMenuSeparator className="bg-[#E5E5E5]" />
                <DropdownMenuItem
                    className="font-mono text-sm cursor-pointer text-red-600"
                    onClick={() => signOut()}
                >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
