import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Privacy Policy | DermaOS",
    description: "DermaOS Privacy Policy - Learn how we collect, use, and protect your personal data and skin profile information.",
    openGraph: {
        title: "Privacy Policy | DermaOS",
        description: "Learn how we collect, use, and protect your personal data and skin profile information.",
    },
}

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="pt-20">
                <section className="py-20 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto">
                        <p className="font-mono text-sm text-muted-foreground mb-4">Legal</p>
                        <h1 className="font-serif text-4xl font-normal text-foreground mb-8">
                            Privacy Policy
                        </h1>
                        <p className="font-mono text-sm text-muted-foreground mb-8">
                            Last updated: December 13, 2024
                        </p>

                        <div className="prose prose-sm max-w-none space-y-8">
                            <section>
                                <h2 className="font-serif text-xl font-normal text-foreground mb-4">
                                    1. Information We Collect
                                </h2>
                                <div className="font-mono text-sm text-muted-foreground space-y-3">
                                    <p>We collect information you provide directly:</p>
                                    <ul className="list-disc pl-6 space-y-2">
                                        <li>Account information (email, name)</li>
                                        <li>Skin profile data (skin type, concerns, sensitivities)</li>
                                        <li>Uploaded images for skin analysis</li>
                                        <li>Payment information (processed securely via Razorpay)</li>
                                    </ul>
                                </div>
                            </section>

                            <section>
                                <h2 className="font-serif text-xl font-normal text-foreground mb-4">
                                    2. How We Use Your Information
                                </h2>
                                <div className="font-mono text-sm text-muted-foreground space-y-3">
                                    <ul className="list-disc pl-6 space-y-2">
                                        <li>To provide personalized product recommendations</li>
                                        <li>To analyze your skin and generate grades</li>
                                        <li>To process payments and manage subscriptions</li>
                                        <li>To send important updates about our service</li>
                                        <li>To improve our algorithms and user experience</li>
                                    </ul>
                                </div>
                            </section>

                            <section>
                                <h2 className="font-serif text-xl font-normal text-foreground mb-4">
                                    3. Data Security
                                </h2>
                                <div className="font-mono text-sm text-muted-foreground space-y-3">
                                    <p>
                                        We implement industry-standard security measures to protect your data:
                                    </p>
                                    <ul className="list-disc pl-6 space-y-2">
                                        <li>All data is encrypted in transit (HTTPS) and at rest</li>
                                        <li>Uploaded images are processed and deleted within 24 hours</li>
                                        <li>We never sell your personal data to third parties</li>
                                        <li>Access to user data is restricted to essential personnel only</li>
                                    </ul>
                                </div>
                            </section>

                            <section>
                                <h2 className="font-serif text-xl font-normal text-foreground mb-4">
                                    4. Your Rights
                                </h2>
                                <div className="font-mono text-sm text-muted-foreground space-y-3">
                                    <p>You have the right to:</p>
                                    <ul className="list-disc pl-6 space-y-2">
                                        <li>Access your personal data</li>
                                        <li>Request correction of inaccurate data</li>
                                        <li>Request deletion of your account and data</li>
                                        <li>Export your data in a portable format</li>
                                        <li>Opt-out of marketing communications</li>
                                    </ul>
                                </div>
                            </section>

                            <section>
                                <h2 className="font-serif text-xl font-normal text-foreground mb-4">
                                    5. Contact Us
                                </h2>
                                <div className="font-mono text-sm text-muted-foreground">
                                    <p>
                                        For privacy-related inquiries, contact us at:{" "}
                                        <a href="mailto:privacy@dermaos.com" className="underline">
                                            privacy@dermaos.com
                                        </a>
                                    </p>
                                </div>
                            </section>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}
