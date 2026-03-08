"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useSkinProfile } from "@/context/skin-profile-context"
import { CheckCircle, ChevronRight, ChevronLeft, Sparkles } from "lucide-react"

interface OnboardingModalProps {
    isOpen: boolean
    onComplete: () => void
}

const AGE_RANGES = ["Under 18", "18-24", "25-34", "35-44", "45-54", "55+"]
const SKIN_TYPES = [
    { value: "Oily", description: "Shiny, enlarged pores, prone to acne" },
    { value: "Dry", description: "Tight, flaky, rough texture" },
    { value: "Combination", description: "Oily T-zone, dry cheeks" },
    { value: "Normal", description: "Balanced, few imperfections" },
]
const SENSITIVITY = [
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

export function OnboardingModal({ isOpen, onComplete }: OnboardingModalProps) {
    const { updateProfile } = useSkinProfile()
    const [step, setStep] = useState(1)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formData, setFormData] = useState({
        ageRange: "",
        type: "",
        sensitivity: "",
        concerns: [] as string[],
    })

    const totalSteps = 4

    const toggleConcern = (concern: string) => {
        setFormData(prev => ({
            ...prev,
            concerns: prev.concerns.includes(concern)
                ? prev.concerns.filter(c => c !== concern)
                : [...prev.concerns, concern]
        }))
    }

    const canProceed = () => {
        switch (step) {
            case 1: return !!formData.ageRange
            case 2: return !!formData.type
            case 3: return !!formData.sensitivity
            case 4: return formData.concerns.length > 0
            default: return false
        }
    }

    const handleNext = async () => {
        if (step < totalSteps) {
            setStep(step + 1)
        } else {
            // Submit profile
            setIsSubmitting(true)
            try {
                await updateProfile({
                    type: formData.type,
                    sensitivity: formData.sensitivity,
                    concerns: formData.concerns,
                    pigmentation: formData.concerns.includes("Hyperpigmentation") ? "Pigmented" : "Non-Pigmented",
                })
                onComplete()
            } catch (error) {
                console.error("Failed to save profile:", error)
            } finally {
                setIsSubmitting(false)
            }
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={() => { }}>
            <DialogContent className="sm:max-w-lg bg-white border-[#E5E5E5] [&>button]:hidden">
                <DialogHeader>
                    <DialogTitle className="font-mono text-xl text-center flex items-center justify-center gap-2">
                        <Sparkles className="w-5 h-5 text-amber-500" />
                        Let's Personalize Your Experience
                    </DialogTitle>
                </DialogHeader>

                {/* Progress Bar */}
                <div className="flex gap-2 mb-6">
                    {[1, 2, 3, 4].map(s => (
                        <div
                            key={s}
                            className={`flex-1 h-1.5 rounded-full transition-colors ${s <= step ? "bg-foreground" : "bg-[#E5E5E5]"
                                }`}
                        />
                    ))}
                </div>

                {/* Step 1: Age */}
                {step === 1 && (
                    <div className="space-y-4">
                        <p className="font-mono text-sm text-muted-foreground text-center">
                            What's your age range?
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                            {AGE_RANGES.map(age => (
                                <button
                                    key={age}
                                    onClick={() => setFormData(prev => ({ ...prev, ageRange: age }))}
                                    className={`px-3 py-3 border font-mono text-sm transition-all ${formData.ageRange === age
                                        ? "border-foreground bg-foreground text-background"
                                        : "border-[#E5E5E5] hover:border-foreground"
                                        }`}
                                >
                                    {age}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 2: Skin Type */}
                {step === 2 && (
                    <div className="space-y-4">
                        <p className="font-mono text-sm text-muted-foreground text-center">
                            What's your skin type?
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                            {SKIN_TYPES.map(type => (
                                <button
                                    key={type.value}
                                    onClick={() => setFormData(prev => ({ ...prev, type: type.value }))}
                                    className={`p-4 border text-left transition-all ${formData.type === type.value
                                        ? "border-foreground bg-foreground text-background"
                                        : "border-[#E5E5E5] hover:border-foreground"
                                        }`}
                                >
                                    <p className="font-mono text-sm font-medium">{type.value}</p>
                                    <p className={`text-xs mt-1 ${formData.type === type.value ? "text-background/70" : "text-muted-foreground"
                                        }`}>
                                        {type.description}
                                    </p>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 3: Sensitivity */}
                {step === 3 && (
                    <div className="space-y-4">
                        <p className="font-mono text-sm text-muted-foreground text-center">
                            How sensitive is your skin?
                        </p>
                        <div className="space-y-3">
                            {SENSITIVITY.map(level => (
                                <button
                                    key={level.value}
                                    onClick={() => setFormData(prev => ({ ...prev, sensitivity: level.value }))}
                                    className={`w-full p-4 border text-left transition-all ${formData.sensitivity === level.value
                                        ? "border-foreground bg-foreground text-background"
                                        : "border-[#E5E5E5] hover:border-foreground"
                                        }`}
                                >
                                    <p className="font-mono text-sm font-medium">{level.value}</p>
                                    <p className={`text-xs mt-1 ${formData.sensitivity === level.value ? "text-background/70" : "text-muted-foreground"
                                        }`}>
                                        {level.description}
                                    </p>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 4: Concerns */}
                {step === 4 && (
                    <div className="space-y-4">
                        <p className="font-mono text-sm text-muted-foreground text-center">
                            What are your main skin concerns? (Select all that apply)
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                            {CONCERNS.map(concern => (
                                <button
                                    key={concern}
                                    onClick={() => toggleConcern(concern)}
                                    className={`px-3 py-3 border font-mono text-sm transition-all flex items-center gap-2 ${formData.concerns.includes(concern)
                                            ? "border-foreground bg-foreground text-background"
                                            : "border-[#E5E5E5] hover:border-foreground"
                                        }`}
                                >
                                    {formData.concerns.includes(concern) && (
                                        <CheckCircle className="w-4 h-4" />
                                    )}
                                    <span>{concern}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Navigation */}
                <div className="flex gap-3 mt-6">
                    {step > 1 && (
                        <Button
                            variant="outline"
                            onClick={() => setStep(step - 1)}
                            className="font-mono text-sm border-[#E5E5E5]"
                        >
                            <ChevronLeft className="w-4 h-4 mr-1" />
                            Back
                        </Button>
                    )}
                    <Button
                        onClick={handleNext}
                        disabled={!canProceed() || isSubmitting}
                        className="flex-1 font-mono text-sm bg-foreground text-background hover:bg-foreground/90 h-12"
                    >
                        {isSubmitting ? (
                            "Saving..."
                        ) : step === totalSteps ? (
                            <>
                                <Sparkles className="w-4 h-4 mr-2" />
                                Get My Recommendations
                            </>
                        ) : (
                            <>
                                Next
                                <ChevronRight className="w-4 h-4 ml-1" />
                            </>
                        )}
                    </Button>
                </div>

                <p className="text-center font-mono text-xs text-muted-foreground mt-2">
                    Step {step} of {totalSteps}
                </p>
            </DialogContent>
        </Dialog>
    )
}
