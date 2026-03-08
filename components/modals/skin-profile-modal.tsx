"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useSkinProfile } from "@/context/skin-profile-context"
import { CheckCircle } from "lucide-react"

interface SkinProfileModalProps {
    children: React.ReactNode
}

const SKIN_TYPES = [
    { value: "Oily", description: "Shiny, enlarged pores, prone to acne" },
    { value: "Dry", description: "Tight, flaky, rough texture" },
    { value: "Combination", description: "Oily T-zone, dry cheeks" },
    { value: "Normal", description: "Balanced, few imperfections" },
]

const SENSITIVITY_LEVELS = [
    { value: "Sensitive", description: "Reacts easily, redness, irritation" },
    { value: "Moderate", description: "Occasional sensitivity" },
    { value: "Resistant", description: "Rarely reacts to products" },
]

const CONCERNS = [
    "Acne",
    "Aging",
    "Hyperpigmentation",
    "Texture",
    "Redness",
    "Dullness",
    "Dark Circles",
    "Dehydration",
]

export function SkinProfileModal({ children }: SkinProfileModalProps) {
    const { skinProfile, updateProfile, isLoading } = useSkinProfile()
    const [isOpen, setIsOpen] = useState(false)
    const [formData, setFormData] = useState({
        type: "",
        sensitivity: "",
        concerns: [] as string[],
    })

    // Sync form data when modal opens or profile changes
    useEffect(() => {
        if (isOpen && skinProfile) {
            setFormData({
                type: skinProfile.type || "",
                sensitivity: skinProfile.sensitivity || "",
                concerns: skinProfile.concerns || [],
            })
        }
    }, [isOpen, skinProfile])

    const toggleConcern = (concern: string) => {
        setFormData(prev => ({
            ...prev,
            concerns: prev.concerns.includes(concern)
                ? prev.concerns.filter(c => c !== concern)
                : [...prev.concerns, concern]
        }))
    }

    const handleSave = async () => {
        await updateProfile({
            type: formData.type,
            sensitivity: formData.sensitivity,
            concerns: formData.concerns,
            pigmentation: formData.concerns.includes("Hyperpigmentation") ? "Pigmented" : "Non-Pigmented",
        })
        setIsOpen(false)
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg bg-white border-[#E5E5E5] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="font-mono text-xl">My Skin Profile</DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Skin Type */}
                    <div className="space-y-3">
                        <Label className="font-mono text-sm font-medium">Skin Type</Label>
                        <div className="grid grid-cols-2 gap-2">
                            {SKIN_TYPES.map(type => (
                                <button
                                    key={type.value}
                                    onClick={() => setFormData(prev => ({ ...prev, type: type.value }))}
                                    className={`p-3 border text-left transition-all ${formData.type === type.value
                                        ? "border-foreground bg-foreground text-background"
                                        : "border-[#E5E5E5] hover:border-foreground"
                                        }`}
                                >
                                    <p className="font-mono text-sm font-medium">{type.value}</p>
                                    <p className={`text-xs mt-0.5 ${formData.type === type.value ? "text-background/70" : "text-muted-foreground"
                                        }`}>
                                        {type.description}
                                    </p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Sensitivity */}
                    <div className="space-y-3">
                        <Label className="font-mono text-sm font-medium">Sensitivity</Label>
                        <div className="space-y-2">
                            {SENSITIVITY_LEVELS.map(level => (
                                <button
                                    key={level.value}
                                    onClick={() => setFormData(prev => ({ ...prev, sensitivity: level.value }))}
                                    className={`w-full p-3 border text-left transition-all ${formData.sensitivity === level.value
                                        ? "border-foreground bg-foreground text-background"
                                        : "border-[#E5E5E5] hover:border-foreground"
                                        }`}
                                >
                                    <p className="font-mono text-sm font-medium">{level.value}</p>
                                    <p className={`text-xs mt-0.5 ${formData.sensitivity === level.value ? "text-background/70" : "text-muted-foreground"
                                        }`}>
                                        {level.description}
                                    </p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Concerns */}
                    <div className="space-y-3">
                        <Label className="font-mono text-sm font-medium">Skin Concerns</Label>
                        <div className="grid grid-cols-2 gap-2">
                            {CONCERNS.map(concern => (
                                <button
                                    key={concern}
                                    onClick={() => toggleConcern(concern)}
                                    className={`px-3 py-2 border font-mono text-sm transition-all flex items-center gap-2 ${formData.concerns.includes(concern)
                                            ? "border-foreground bg-foreground text-background"
                                            : "border-[#E5E5E5] hover:border-foreground"
                                        }`}
                                >
                                    {formData.concerns.includes(concern) && <CheckCircle className="w-4 h-4" />}
                                    <span>{concern}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <Button
                        onClick={handleSave}
                        disabled={isLoading || !formData.type}
                        className="w-full font-mono text-sm bg-foreground text-background hover:bg-foreground/90 rounded-none h-12"
                    >
                        {isLoading ? "Saving..." : "Save Profile"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
