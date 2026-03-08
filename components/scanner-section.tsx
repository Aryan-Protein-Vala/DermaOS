"use client"

import { Shield, CheckCircle, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"
import { useSkinProfile } from "@/context/skin-profile-context"
import { useRegion } from "@/context/region-context"
import { LoginDialog } from "@/components/auth/login-dialog"
import { UpgradeModal } from "@/components/modals/upgrade-modal"
import { OneTimeScanModal } from "@/components/modals/one-time-scan-modal"
import { AnalysisResults } from "@/components/analysis-results"

export function ScannerSection() {
  const { isAuthenticated } = useAuth()
  const { hasPremium } = useSkinProfile()
  const { region } = useRegion()

  // Pricing based on region
  const monthlyPrice = region === "IN" ? "₹749" : "$9"
  const oneTimePrice = region === "IN" ? "₹399" : "$4.99"

  return (
    <>
      <section id="scanner" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#FAFAFA] border-t border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Scanner */}
            <div className="order-2 lg:order-1">
              <div className="relative aspect-[4/5] max-w-md mx-auto bg-white border border-[#E5E5E5] overflow-hidden">
                {/* Paywall Overlay for non-premium users */}
                {(!isAuthenticated || !hasPremium) && (
                  <div className="absolute inset-0 z-10 bg-white/95 flex flex-col items-center justify-center p-8">
                    <div className="w-16 h-16 rounded-full bg-[#F5F5F5] flex items-center justify-center mb-4">
                      <Lock className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-mono text-lg font-bold text-center mb-2">
                      Premium Feature
                    </h3>
                    <p className="font-mono text-sm text-muted-foreground text-center mb-6">
                      {isAuthenticated
                        ? "Upgrade to unlock the AI skin scanner and get personalized product grades."
                        : "Sign in and subscribe to unlock the AI skin scanner."}
                    </p>
                    {isAuthenticated ? (
                      <UpgradeModal>
                        <Button className="font-mono text-sm bg-foreground text-background hover:bg-foreground/90 rounded-none">
                          Upgrade to Pro
                        </Button>
                      </UpgradeModal>
                    ) : (
                      <LoginDialog>
                        <Button className="font-mono text-sm bg-foreground text-background hover:bg-foreground/90 rounded-none">
                          Sign In to Unlock
                        </Button>
                      </LoginDialog>
                    )}
                  </div>
                )}

                {/* Premium User Content */}
                {isAuthenticated && hasPremium && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                    <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-6">
                      <CheckCircle className="w-12 h-12 text-green-500" />
                    </div>
                    <p className="font-mono text-sm text-foreground text-center mb-2">
                      AI Scanner Ready
                    </p>
                    <p className="font-mono text-xs text-muted-foreground text-center">
                      Use the panel on the right to start or view your analysis
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right - Content */}
            <div className="order-1 lg:order-2 space-y-8">
              <div>
                <p className="font-mono text-sm text-muted-foreground mb-2">
                  {hasPremium ? "Pro Feature Unlocked" : "Premium Feature"}
                </p>
                <h2 className="font-serif text-3xl md:text-4xl font-normal text-foreground text-balance">
                  {hasPremium
                    ? "Your AI skin analysis is ready."
                    : "Unlock your personal A-F ratings for 14,000+ products."}
                </h2>
              </div>

              {/* Show blurred preview only for non-premium users */}
              {!hasPremium && (
                <div className="relative bg-white border border-[#E5E5E5] p-6 overflow-hidden">
                  <div className="blur-sm select-none">
                    <div className="space-y-4">
                      {/* Skin Analysis */}
                      <div className="space-y-2">
                        <p className="font-mono text-xs text-muted-foreground uppercase tracking-wide">Your Skin Profile</p>
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-sm">Skin Type:</span>
                          <span className="font-mono text-sm font-bold">Combination</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-sm">Sensitivity:</span>
                          <span className="font-mono text-sm font-bold">Medium</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-sm">Concerns:</span>
                          <span className="font-mono text-sm font-bold">Acne, Texture</span>
                        </div>
                      </div>

                      <hr className="border-[#E5E5E5]" />

                      {/* Daily Routine */}
                      <div className="space-y-2">
                        <p className="font-mono text-xs text-muted-foreground uppercase tracking-wide">Your AM Routine</p>
                        <div className="space-y-1">
                          <p className="font-mono text-xs">1. Gentle Cleanser</p>
                          <p className="font-mono text-xs">2. Vitamin C Serum</p>
                          <p className="font-mono text-xs">3. Moisturizer</p>
                          <p className="font-mono text-xs">4. Sunscreen SPF 50</p>
                        </div>
                      </div>

                      <hr className="border-[#E5E5E5]" />

                      {/* Diet Tips */}
                      <div className="space-y-2">
                        <p className="font-mono text-xs text-muted-foreground uppercase tracking-wide">Skin-Healthy Diet</p>
                        <div className="space-y-1">
                          <p className="font-mono text-xs">✓ Increase: Omega-3, Zinc, Vitamin E</p>
                          <p className="font-mono text-xs">✗ Avoid: Dairy, High Sugar</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center bg-white/70">
                    <p className="font-mono text-sm text-muted-foreground">Subscribe to Unlock Full Analysis</p>
                  </div>
                </div>
              )}

              {/* Show AnalysisResults for premium users */}
              {hasPremium && (
                <AnalysisResults />
              )}

              {/* Show pricing only for non-premium users */}
              {!hasPremium && (
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 border border-[#E5E5E5] bg-white p-6">
                    <p className="font-mono text-xs text-muted-foreground mb-1">Monthly</p>
                    <p className="font-mono text-2xl font-bold text-foreground">
                      {monthlyPrice}<span className="text-sm font-normal">/mo</span>
                    </p>
                    <p className="font-mono text-xs text-muted-foreground mt-2">Unlimited scans</p>
                    <UpgradeModal>
                      <Button className="w-full mt-4 font-mono text-xs bg-foreground text-background hover:bg-foreground/90 rounded-none">
                        Subscribe
                      </Button>
                    </UpgradeModal>
                  </div>
                  <div className="flex-1 border border-foreground bg-white p-6">
                    <p className="font-mono text-xs text-muted-foreground mb-1">One-time</p>
                    <p className="font-mono text-2xl font-bold text-foreground">{oneTimePrice}</p>
                    <p className="font-mono text-xs text-muted-foreground mt-2">Single scan</p>
                    <OneTimeScanModal>
                      <Button
                        variant="outline"
                        className="w-full mt-4 font-mono text-xs border-foreground rounded-none bg-transparent"
                      >
                        Buy Scan
                      </Button>
                    </OneTimeScanModal>
                  </div>
                </div>
              )}

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-muted-foreground" />
                  <span className="font-mono text-xs text-muted-foreground">Encrypted</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-muted-foreground" />
                  <span className="font-mono text-xs text-muted-foreground">Dermatologist Verified Logic</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
