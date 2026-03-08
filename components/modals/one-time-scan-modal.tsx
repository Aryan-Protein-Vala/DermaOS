"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useRegion } from "@/context/region-context"
import { useAuth } from "@/context/auth-context"
import { Camera, Loader2, Check } from "lucide-react"

declare global {
    interface Window {
        Razorpay: any
    }
}

interface OneTimeScanModalProps {
    children: React.ReactNode
}

export function OneTimeScanModal({ children }: OneTimeScanModalProps) {
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const { region } = useRegion()
    const { user } = useAuth()

    const price = region === "IN" ? "₹399" : "$4.99"
    const priceValue = region === "IN" ? 399 : 4.99

    // Load Razorpay script
    useEffect(() => {
        if (isOpen && !window.Razorpay) {
            const script = document.createElement('script')
            script.src = 'https://checkout.razorpay.com/v1/checkout.js'
            script.async = true
            document.body.appendChild(script)
        }
    }, [isOpen])

    const handlePurchase = async () => {
        if (!user) {
            alert('Please login to purchase')
            return
        }

        setIsLoading(true)

        try {
            // Create order for one-time scan
            const orderRes = await fetch('/api/payment/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ planId: 'one-time', region }),
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
                description: 'Single Skin Scan',
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
                            planType: 'one-time',
                        }),
                    })

                    if (verifyRes.ok) {
                        setIsOpen(false)
                        alert('🎉 Scan purchased! You can now scan your skin once.')
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
            <DialogContent className="sm:max-w-md bg-white border-[#E5E5E5]">
                <DialogHeader>
                    <DialogTitle className="font-mono text-xl flex items-center gap-2">
                        <Camera className="w-5 h-5" />
                        Buy Single Scan
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Price Display */}
                    <div className="text-center py-8 border border-foreground bg-white">
                        <p className="font-mono text-4xl font-bold text-foreground">
                            {price}
                        </p>
                        <p className="font-mono text-sm text-muted-foreground mt-2">
                            One-time purchase
                        </p>
                    </div>

                    {/* What's included */}
                    <div className="space-y-3">
                        <p className="font-mono text-xs text-muted-foreground uppercase tracking-wide">
                            What you get:
                        </p>
                        <div className="space-y-2">
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-[#F5F5F5] flex items-center justify-center">
                                    <Check className="w-3 h-3 text-foreground" />
                                </div>
                                <span className="font-mono text-sm">1 AI skin analysis scan</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-[#F5F5F5] flex items-center justify-center">
                                    <Check className="w-3 h-3 text-foreground" />
                                </div>
                                <span className="font-mono text-sm">Personalized product grades</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-[#F5F5F5] flex items-center justify-center">
                                    <Check className="w-3 h-3 text-foreground" />
                                </div>
                                <span className="font-mono text-sm">Skin type analysis</span>
                            </div>
                        </div>
                    </div>

                    {/* CTA */}
                    <Button
                        onClick={handlePurchase}
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
                                <Camera className="w-4 h-4 mr-2" />
                                Buy Scan for {price}
                            </>
                        )}
                    </Button>

                    <p className="font-mono text-xs text-center text-muted-foreground">
                        No subscription required. Pay once, scan once.
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    )
}
