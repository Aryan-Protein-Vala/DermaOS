"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useRegion } from "@/context/region-context"
import { useAuth } from "@/context/auth-context"
import { Check, Sparkles, Zap, Shield, Star, Loader2 } from "lucide-react"

declare global {
    interface Window {
        Razorpay: any
    }
}

interface UpgradeModalProps {
    children: React.ReactNode
}

export function UpgradeModal({ children }: UpgradeModalProps) {
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const [selectedPlan, setSelectedPlan] = useState<"monthly" | "yearly">("monthly")
    const [isLoading, setIsLoading] = useState(false)
    const { region } = useRegion()
    const { user } = useAuth()

    const pricing = {
        monthly: region === "IN" ? "₹749" : "$9",
        yearly: region === "IN" ? "₹5,999" : "$79",
        yearlySavings: region === "IN" ? "₹2,989" : "$29",
    }

    const features = [
        { icon: Zap, text: "AI Skin Scanner - Unlimited scans" },
        { icon: Star, text: "Personalized A-F product grades" },
        { icon: Shield, text: "Ingredient safety alerts" },
        { icon: Sparkles, text: "Custom skincare routine builder" },
    ]

    // Load Razorpay script
    useEffect(() => {
        if (isOpen && !window.Razorpay) {
            const script = document.createElement('script')
            script.src = 'https://checkout.razorpay.com/v1/checkout.js'
            script.async = true
            document.body.appendChild(script)
        }
    }, [isOpen])

    const handleUpgrade = async () => {
        if (!user) {
            alert('Please login to upgrade')
            return
        }

        setIsLoading(true)

        try {
            // Create order
            const orderRes = await fetch('/api/payment/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ planId: selectedPlan, region }),
            })

            if (!orderRes.ok) {
                throw new Error('Failed to create order')
            }

            const { orderId, amount, currency, keyId } = await orderRes.json()

            // Open Razorpay checkout
            const options = {
                key: keyId,
                amount,
                currency,
                name: 'DermaOS',
                description: `Pro ${selectedPlan === 'monthly' ? 'Monthly' : 'Yearly'} Subscription`,
                order_id: orderId,
                handler: async (response: any) => {
                    // Verify payment
                    const verifyRes = await fetch('/api/payment/verify', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                        }),
                    })

                    if (verifyRes.ok) {
                        setIsOpen(false)
                        alert('🎉 Welcome to Pro! Your subscription is now active.')
                        router.refresh()
                        window.location.reload()
                    } else {
                        alert('Payment verification failed. Please contact support.')
                    }
                },
                prefill: {
                    email: user.email,
                    name: user.name || '',
                },
                theme: {
                    color: '#000000',
                },
                modal: {
                    ondismiss: () => {
                        setIsLoading(false)
                    },
                },
            }

            const razorpay = new window.Razorpay(options)
            razorpay.open()
        } catch (error) {
            console.error('Payment error:', error)
            alert('Something went wrong. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg bg-white border-[#E5E5E5]">
                <DialogHeader>
                    <DialogTitle className="font-mono text-xl flex items-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        Upgrade to Pro
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Plan Toggle */}
                    <div className="flex items-center justify-center gap-2 p-1 bg-[#F5F5F5] rounded-full">
                        <button
                            onClick={() => setSelectedPlan("monthly")}
                            className={`flex-1 px-4 py-2 font-mono text-sm rounded-full transition-colors ${selectedPlan === "monthly"
                                ? "bg-foreground text-background"
                                : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setSelectedPlan("yearly")}
                            className={`flex-1 px-4 py-2 font-mono text-sm rounded-full transition-colors flex items-center justify-center gap-2 ${selectedPlan === "yearly"
                                ? "bg-foreground text-background"
                                : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            Yearly
                            <span className="text-xs bg-green-500 text-white px-1.5 py-0.5 rounded-full">
                                Save {pricing.yearlySavings}
                            </span>
                        </button>
                    </div>

                    {/* Price Display */}
                    <div className="text-center py-6 border border-[#E5E5E5] bg-[#FAFAFA]">
                        <p className="font-mono text-4xl font-bold text-foreground">
                            {selectedPlan === "monthly" ? pricing.monthly : pricing.yearly}
                        </p>
                        <p className="font-mono text-sm text-muted-foreground mt-1">
                            {selectedPlan === "monthly" ? "per month" : "per year"}
                        </p>
                    </div>

                    {/* Features */}
                    <div className="space-y-3">
                        {features.map((feature, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                    <Check className="w-4 h-4 text-green-600" />
                                </div>
                                <span className="font-mono text-sm">{feature.text}</span>
                            </div>
                        ))}
                    </div>

                    {/* CTA */}
                    <Button
                        onClick={handleUpgrade}
                        disabled={isLoading}
                        className="w-full font-mono text-sm bg-foreground text-background hover:bg-foreground/90 rounded-none h-12"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4 mr-2" />
                                Upgrade Now
                            </>
                        )}
                    </Button>

                    <p className="font-mono text-xs text-center text-muted-foreground">
                        Cancel anytime. 7-day money-back guarantee.
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    )
}
