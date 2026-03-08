import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Sparkles, Users, Target, Heart } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "About Us | DermaOS - Skincare is Biology, Not Marketing",
    description: "Learn about DermaOS mission to revolutionize skincare with AI-powered personalized product recommendations.",
    openGraph: {
        title: "About DermaOS - Skincare is Biology, Not Marketing",
        description: "Learn about DermaOS mission to revolutionize skincare with AI-powered personalized product recommendations.",
    },
}

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="pt-20">
                {/* Hero */}
                <section className="py-20 px-4 sm:px-6 lg:px-8 border-b border-[#E5E5E5]">
                    <div className="max-w-4xl mx-auto text-center">
                        <p className="font-mono text-sm text-muted-foreground mb-4">About Us</p>
                        <h1 className="font-serif text-4xl md:text-5xl font-normal text-foreground mb-6">
                            Skincare is Biology, Not Marketing
                        </h1>
                        <p className="font-mono text-lg text-muted-foreground max-w-2xl mx-auto">
                            We're building the future of personalized skincare — where products are matched to your unique skin biology, not celebrity endorsements.
                        </p>
                    </div>
                </section>

                {/* Mission */}
                <section className="py-20 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="font-serif text-3xl font-normal text-foreground mb-6">
                                Our Mission
                            </h2>
                            <p className="font-mono text-sm text-muted-foreground mb-4">
                                The skincare industry is broken. Billions are spent on marketing while consumers waste money on products that don't work for their skin type.
                            </p>
                            <p className="font-mono text-sm text-muted-foreground mb-4">
                                DermaOS changes this. We use AI and dermatologist-backed algorithms to analyze your skin and match you with products that actually work for YOU.
                            </p>
                            <p className="font-mono text-sm text-muted-foreground">
                                No more guessing. No more wasted money. Just science-backed recommendations tailored to your unique skin biology.
                            </p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-6 border border-[#E5E5E5] bg-white">
                                <Sparkles className="w-8 h-8 text-amber-500 mb-4" />
                                <p className="font-mono text-2xl font-bold">14,000+</p>
                                <p className="font-mono text-xs text-muted-foreground">Products Analyzed</p>
                            </div>
                            <div className="p-6 border border-[#E5E5E5] bg-white">
                                <Users className="w-8 h-8 text-blue-500 mb-4" />
                                <p className="font-mono text-2xl font-bold">50,000+</p>
                                <p className="font-mono text-xs text-muted-foreground">Happy Users</p>
                            </div>
                            <div className="p-6 border border-[#E5E5E5] bg-white">
                                <Target className="w-8 h-8 text-green-500 mb-4" />
                                <p className="font-mono text-2xl font-bold">95%</p>
                                <p className="font-mono text-xs text-muted-foreground">Match Accuracy</p>
                            </div>
                            <div className="p-6 border border-[#E5E5E5] bg-white">
                                <Heart className="w-8 h-8 text-red-500 mb-4" />
                                <p className="font-mono text-2xl font-bold">4.9★</p>
                                <p className="font-mono text-xs text-muted-foreground">User Rating</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Team */}
                <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#FAFAFA] border-t border-[#E5E5E5]">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="font-serif text-3xl font-normal text-foreground mb-6">
                            Built by Skin Enthusiasts
                        </h2>
                        <p className="font-mono text-sm text-muted-foreground max-w-2xl mx-auto mb-12">
                            Our team combines expertise in dermatology, AI, and product development to create the most accurate skincare matching platform.
                        </p>
                        <a
                            href="mailto:hello@dermaos.com"
                            className="font-mono text-sm text-foreground border border-foreground px-6 py-3 hover:bg-foreground hover:text-background transition-colors"
                        >
                            Get in Touch →
                        </a>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}
