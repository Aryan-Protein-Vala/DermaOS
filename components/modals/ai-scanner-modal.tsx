"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useRegion } from "@/context/region-context"
import { Loader2, Sparkles, Check, AlertCircle, Upload, ArrowRight, ArrowLeft, Sun, Droplets, X } from "lucide-react"

interface SkinAnalysisResult {
    skinType: string
    sensitivity: string
    concerns: string[]
    hydrationLevel: string
    oilLevel: string
    amRoutine: { step: number; product: string; purpose: string }[]
    pmRoutine: { step: number; product: string; purpose: string }[]
    diet: { increase: string[]; avoid: string[] }
    lifestyleTips: string[]
    summary: string
}

interface AIScannerModalProps {
    isOpen: boolean
    onClose: () => void
    onAnalysisComplete?: (result: SkinAnalysisResult) => void
}

const CONCERN_OPTIONS = [
    "Acne",
    "Texture",
    "Hyperpigmentation",
    "Fine Lines",
    "Dehydration",
    "Redness",
    "Large Pores",
    "Dark Circles",
    "Dullness",
]

const PHOTO_TIPS = [
    { icon: Sun, text: "Take photo in natural daylight" },
    { icon: Droplets, text: "Clean face, no makeup or filters" },
    { icon: Check, text: "Face the camera directly" },
    { icon: Check, text: "Ensure good lighting, no shadows" },
]

export function AIScannerModal({ isOpen, onClose, onAnalysisComplete }: AIScannerModalProps) {
    const [step, setStep] = useState<"upload" | "describe" | "analyzing" | "result">("upload")
    const [uploadedImage, setUploadedImage] = useState<string | null>(null)
    const [skinDescription, setSkinDescription] = useState("")
    const [selectedConcerns, setSelectedConcerns] = useState<string[]>([])
    const [result, setResult] = useState<SkinAnalysisResult | null>(null)
    const [error, setError] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const { region } = useRegion()

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setUploadedImage(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const removeImage = () => {
        setUploadedImage(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    const toggleConcern = (concern: string) => {
        setSelectedConcerns(prev =>
            prev.includes(concern)
                ? prev.filter(c => c !== concern)
                : [...prev, concern]
        )
    }

    const handleAnalyze = async () => {
        if (!skinDescription.trim()) {
            setError("Please describe your skin")
            return
        }

        setError(null)
        setStep("analyzing")

        try {
            const response = await fetch("/api/ai/analyze-skin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    skinDescription,
                    concerns: selectedConcerns,
                    climate: region === "IN" ? "India - Humid/Tropical" : "Moderate",
                    image: uploadedImage, // Send the base64 image
                }),
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error || "Analysis failed")
            }

            const data = await response.json()
            setResult(data.analysis)
            setStep("result")
            onAnalysisComplete?.(data.analysis)
        } catch (err: any) {
            setError(err.message || "Analysis failed. Please try again.")
            setStep("describe")
        }
    }

    const handleClose = () => {
        setStep("upload")
        setUploadedImage(null)
        setSkinDescription("")
        setSelectedConcerns([])
        setResult(null)
        setError(null)
        onClose()
    }

    const goToDescribe = () => {
        setStep("describe")
    }

    const goBackToUpload = () => {
        setStep("upload")
    }

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-2xl bg-white border-[#E5E5E5] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="font-mono text-xl flex items-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        AI Skin Analysis
                        {step !== "result" && step !== "analyzing" && (
                            <span className="ml-auto font-mono text-xs text-muted-foreground">
                                Step {step === "upload" ? "1" : "2"} of 2
                            </span>
                        )}
                    </DialogTitle>
                </DialogHeader>

                {/* Step 1: Upload Photo */}
                {step === "upload" && (
                    <div className="space-y-6 py-4">
                        {/* Photo Tips */}
                        <div className="p-4 bg-amber-50 border border-amber-200 rounded-none">
                            <p className="font-mono text-sm font-bold text-amber-800 mb-3">
                                📸 Tips for Best Results
                            </p>
                            <div className="grid grid-cols-2 gap-3">
                                {PHOTO_TIPS.map((tip, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <tip.icon className="w-4 h-4 text-amber-600" />
                                        <span className="font-mono text-xs text-amber-700">{tip.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Upload Area */}
                        <div className="space-y-3">
                            <label className="font-mono text-sm font-medium">
                                Upload Your Selfie (Optional)
                            </label>

                            {uploadedImage ? (
                                <div className="relative">
                                    <div className="relative aspect-square max-w-[200px] mx-auto border border-[#E5E5E5] overflow-hidden">
                                        <Image
                                            src={uploadedImage}
                                            alt="Uploaded selfie"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <button
                                        onClick={removeImage}
                                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                    <p className="font-mono text-xs text-green-600 text-center mt-2 flex items-center justify-center gap-1">
                                        <Check className="w-3 h-3" /> Photo uploaded successfully
                                    </p>
                                </div>
                            ) : (
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-2 border-dashed border-[#E5E5E5] p-8 text-center cursor-pointer hover:border-foreground transition-colors"
                                >
                                    <Upload className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                                    <p className="font-mono text-sm text-foreground mb-1">
                                        Click to upload your photo
                                    </p>
                                    <p className="font-mono text-xs text-muted-foreground">
                                        JPG, PNG up to 10MB
                                    </p>
                                </div>
                            )}

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                            />

                            <p className="font-mono text-xs text-muted-foreground text-center">
                                Your photo helps us understand your skin better, but it's optional.
                            </p>
                        </div>

                        <Button
                            onClick={goToDescribe}
                            className="w-full font-mono text-sm bg-foreground text-background hover:bg-foreground/90 rounded-none h-12"
                        >
                            Continue
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                )}

                {/* Step 2: Describe Skin */}
                {step === "describe" && (
                    <div className="space-y-6 py-4">
                        {error && (
                            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 text-red-700 font-mono text-sm">
                                <AlertCircle className="w-4 h-4" />
                                {error}
                            </div>
                        )}

                        {/* Show uploaded image thumbnail */}
                        {uploadedImage && (
                            <div className="flex items-center gap-3 p-3 bg-[#FAFAFA] border border-[#E5E5E5]">
                                <div className="relative w-12 h-12 border border-[#E5E5E5] overflow-hidden flex-shrink-0">
                                    <Image src={uploadedImage} alt="Your photo" fill className="object-cover" />
                                </div>
                                <div>
                                    <p className="font-mono text-xs text-green-600 flex items-center gap-1">
                                        <Check className="w-3 h-3" /> Photo uploaded
                                    </p>
                                    <p className="font-mono text-xs text-muted-foreground">
                                        Now describe your skin below
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="font-mono text-sm font-medium">
                                Describe your skin *
                            </label>
                            <Textarea
                                placeholder="E.g., My skin gets oily by afternoon, especially on my forehead and nose. I have some acne on my cheeks and occasional breakouts around my chin. My skin feels tight after washing..."
                                value={skinDescription}
                                onChange={(e) => setSkinDescription(e.target.value)}
                                className="min-h-[120px] font-mono text-sm resize-none border-[#E5E5E5]"
                            />
                            <p className="font-mono text-xs text-muted-foreground">
                                The more details you provide, the better your analysis will be.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <label className="font-mono text-sm font-medium">
                                Select your main concerns
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {CONCERN_OPTIONS.map((concern) => (
                                    <button
                                        key={concern}
                                        onClick={() => toggleConcern(concern)}
                                        className={`px-3 py-1.5 font-mono text-xs border transition-colors ${selectedConcerns.includes(concern)
                                            ? "bg-foreground text-background border-foreground"
                                            : "bg-white text-foreground border-[#E5E5E5] hover:border-foreground"
                                            }`}
                                    >
                                        {concern}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                onClick={goBackToUpload}
                                className="font-mono text-sm rounded-none border-[#E5E5E5]"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back
                            </Button>
                            <Button
                                onClick={handleAnalyze}
                                disabled={!skinDescription.trim()}
                                className="flex-1 font-mono text-sm bg-foreground text-background hover:bg-foreground/90 rounded-none h-12 disabled:opacity-50"
                            >
                                <Sparkles className="w-4 h-4 mr-2" />
                                Confirm & Analyze
                            </Button>
                        </div>
                    </div>
                )}

                {/* Analyzing */}
                {step === "analyzing" && (
                    <div className="py-12 flex flex-col items-center justify-center">
                        <Loader2 className="w-12 h-12 animate-spin mb-4" />
                        <p className="font-mono text-sm text-muted-foreground">
                            Analyzing your skin profile...
                        </p>
                        <p className="font-mono text-xs text-muted-foreground mt-2">
                            This may take a few seconds
                        </p>
                    </div>
                )}

                {/* Results */}
                {step === "result" && result && (
                    <div className="space-y-6 py-4">
                        {/* Summary */}
                        <div className="p-4 bg-[#FAFAFA] border border-[#E5E5E5]">
                            <p className="font-mono text-sm">{result.summary}</p>
                        </div>

                        {/* Skin Profile */}
                        <div className="space-y-3">
                            <h3 className="font-mono text-sm font-bold uppercase tracking-wide">
                                Your Skin Profile
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 border border-[#E5E5E5]">
                                    <p className="font-mono text-xs text-muted-foreground">Skin Type</p>
                                    <p className="font-mono text-sm font-bold">{result.skinType}</p>
                                </div>
                                <div className="p-3 border border-[#E5E5E5]">
                                    <p className="font-mono text-xs text-muted-foreground">Sensitivity</p>
                                    <p className="font-mono text-sm font-bold">{result.sensitivity}</p>
                                </div>
                                <div className="p-3 border border-[#E5E5E5]">
                                    <p className="font-mono text-xs text-muted-foreground">Hydration</p>
                                    <p className="font-mono text-sm font-bold">{result.hydrationLevel}</p>
                                </div>
                                <div className="p-3 border border-[#E5E5E5]">
                                    <p className="font-mono text-xs text-muted-foreground">Oil Level</p>
                                    <p className="font-mono text-sm font-bold">{result.oilLevel}</p>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {result.concerns.map((concern, i) => (
                                    <span key={i} className="px-2 py-1 font-mono text-xs bg-[#F5F5F5]">
                                        {concern}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* AM Routine */}
                        <div className="space-y-3">
                            <h3 className="font-mono text-sm font-bold uppercase tracking-wide">
                                ☀️ Morning Routine
                            </h3>
                            <div className="space-y-2">
                                {result.amRoutine.map((s) => (
                                    <div key={s.step} className="flex items-start gap-3 p-3 border border-[#E5E5E5]">
                                        <span className="font-mono text-xs bg-foreground text-background w-6 h-6 flex items-center justify-center">
                                            {s.step}
                                        </span>
                                        <div>
                                            <p className="font-mono text-sm font-bold">{s.product}</p>
                                            <p className="font-mono text-xs text-muted-foreground">{s.purpose}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* PM Routine */}
                        <div className="space-y-3">
                            <h3 className="font-mono text-sm font-bold uppercase tracking-wide">
                                🌙 Evening Routine
                            </h3>
                            <div className="space-y-2">
                                {result.pmRoutine.map((s) => (
                                    <div key={s.step} className="flex items-start gap-3 p-3 border border-[#E5E5E5]">
                                        <span className="font-mono text-xs bg-foreground text-background w-6 h-6 flex items-center justify-center">
                                            {s.step}
                                        </span>
                                        <div>
                                            <p className="font-mono text-sm font-bold">{s.product}</p>
                                            <p className="font-mono text-xs text-muted-foreground">{s.purpose}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Diet */}
                        <div className="space-y-3">
                            <h3 className="font-mono text-sm font-bold uppercase tracking-wide">
                                🥗 Diet Recommendations
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 border border-green-200 bg-green-50">
                                    <p className="font-mono text-xs text-green-700 font-bold mb-2">✓ Increase</p>
                                    <ul className="space-y-1">
                                        {result.diet.increase.map((item, i) => (
                                            <li key={i} className="font-mono text-xs text-green-700">{item}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="p-3 border border-red-200 bg-red-50">
                                    <p className="font-mono text-xs text-red-700 font-bold mb-2">✗ Avoid</p>
                                    <ul className="space-y-1">
                                        {result.diet.avoid.map((item, i) => (
                                            <li key={i} className="font-mono text-xs text-red-700">{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Lifestyle */}
                        <div className="space-y-3">
                            <h3 className="font-mono text-sm font-bold uppercase tracking-wide">
                                💡 Lifestyle Tips
                            </h3>
                            <div className="space-y-2">
                                {result.lifestyleTips.map((tip, i) => (
                                    <div key={i} className="flex items-center gap-2 p-2 bg-[#FAFAFA]">
                                        <Check className="w-4 h-4 text-green-500" />
                                        <span className="font-mono text-xs">{tip}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Button
                            onClick={handleClose}
                            className="w-full font-mono text-sm bg-foreground text-background hover:bg-foreground/90 rounded-none"
                        >
                            Done
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
