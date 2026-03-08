"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/context/auth-context"
import { signOut } from "next-auth/react"
import { Trash2 } from "lucide-react"

interface SettingsModalProps {
    children: React.ReactNode
}

export function SettingsModal({ children }: SettingsModalProps) {
    const { user } = useAuth()
    const [isOpen, setIsOpen] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

    const handleDeleteAccount = async () => {
        // In production, this would call an API to delete the account
        await signOut({ callbackUrl: "/" })
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-white border-[#E5E5E5]">
                <DialogHeader>
                    <DialogTitle className="font-mono text-xl">Settings</DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Account Info */}
                    <div className="space-y-4">
                        <h3 className="font-mono text-sm font-medium">Account Information</h3>

                        <div className="space-y-2">
                            <Label className="font-mono text-xs text-muted-foreground">Email</Label>
                            <Input
                                value={user?.email || ""}
                                disabled
                                className="font-mono text-sm bg-[#F5F5F5] border-[#E5E5E5]"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="font-mono text-xs text-muted-foreground">Name</Label>
                            <Input
                                value={user?.name || ""}
                                disabled
                                className="font-mono text-sm bg-[#F5F5F5] border-[#E5E5E5]"
                            />
                        </div>
                    </div>

                    {/* Subscription Status */}
                    <div className="p-4 border border-[#E5E5E5] bg-[#FAFAFA]">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-mono text-sm font-medium">Subscription</p>
                                <p className="font-mono text-xs text-muted-foreground mt-1">
                                    {user?.subscriptionStatus === "active" ? "Pro Plan" :
                                        user?.subscriptionStatus === "trial" ? "Trial" : "Free Plan"}
                                </p>
                            </div>
                            {user?.subscriptionStatus !== "active" && (
                                <Button
                                    variant="outline"
                                    className="font-mono text-xs border-amber-500 text-amber-600 hover:bg-amber-50"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Upgrade
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="border border-red-200 p-4 bg-red-50/50">
                        <h3 className="font-mono text-sm font-medium text-red-600 mb-3">Danger Zone</h3>

                        {!showDeleteConfirm ? (
                            <Button
                                variant="outline"
                                className="font-mono text-xs border-red-300 text-red-600 hover:bg-red-100"
                                onClick={() => setShowDeleteConfirm(true)}
                            >
                                <Trash2 className="w-3 h-3 mr-2" />
                                Delete Account
                            </Button>
                        ) : (
                            <div className="space-y-3">
                                <p className="font-mono text-xs text-red-600">
                                    Are you sure? This action cannot be undone.
                                </p>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        className="font-mono text-xs"
                                        onClick={() => setShowDeleteConfirm(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        className="font-mono text-xs bg-red-600 hover:bg-red-700 text-white"
                                        onClick={handleDeleteAccount}
                                    >
                                        Yes, Delete
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
