import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Terms of Service | DermaOS",
    description: "DermaOS Terms of Service - Read our terms and conditions for using our personalized skincare platform.",
    openGraph: {
        title: "Terms of Service | DermaOS",
        description: "Read our terms and conditions for using our personalized skincare platform.",
    },
}

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="pt-20">
                <section className="py-20 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto">
                        <p className="font-mono text-sm text-muted-foreground mb-4">Legal</p>
                        <h1 className="font-serif text-4xl font-normal text-foreground mb-8">
                            Terms of Service
                        </h1>
                        <p className="font-mono text-sm text-muted-foreground mb-8">
                            Last updated: December 13, 2024
                        </p>

                        <div className="prose prose-sm max-w-none space-y-8">
                            <section>
                                <h2 className="font-serif text-xl font-normal text-foreground mb-4">
                                    1. Acceptance of Terms
                                </h2>
                                <div className="font-mono text-sm text-muted-foreground space-y-3">
                                    <p>
                                        By accessing or using DermaOS, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.
                                    </p>
                                </div>
                            </section>

                            <section>
                                <h2 className="font-serif text-xl font-normal text-foreground mb-4">
                                    2. Service Description
                                </h2>
                                <div className="font-mono text-sm text-muted-foreground space-y-3">
                                    <p>
                                        DermaOS provides personalized skincare product recommendations based on user-provided skin profile information. Our service includes:
                                    </p>
                                    <ul className="list-disc pl-6 space-y-2">
                                        <li>AI-powered skin analysis</li>
                                        <li>Personalized product grading (A-F scale)</li>
                                        <li>Curated marketplace of skincare products</li>
                                        <li>Educational skincare content</li>
                                    </ul>
                                </div>
                            </section>

                            <section>
                                <h2 className="font-serif text-xl font-normal text-foreground mb-4">
                                    3. Medical Disclaimer
                                </h2>
                                <div className="font-mono text-sm text-muted-foreground space-y-3">
                                    <p className="font-bold">
                                        DermaOS is NOT a substitute for professional medical advice.
                                    </p>
                                    <p>
                                        Our recommendations are based on general skincare principles and should not be considered medical diagnoses. For skin conditions or concerns, please consult a qualified dermatologist.
                                    </p>
                                </div>
                            </section>

                            <section>
                                <h2 className="font-serif text-xl font-normal text-foreground mb-4">
                                    4. Subscriptions & Payments
                                </h2>
                                <div className="font-mono text-sm text-muted-foreground space-y-3">
                                    <ul className="list-disc pl-6 space-y-2">
                                        <li>Subscription fees are billed in advance on a monthly or yearly basis</li>
                                        <li>You may cancel your subscription at any time</li>
                                        <li>Refunds are available within 7 days of purchase</li>
                                        <li>Prices may change with 30 days notice</li>
                                    </ul>
                                </div>
                            </section>

                            <section>
                                <h2 className="font-serif text-xl font-normal text-foreground mb-4">
                                    5. User Responsibilities
                                </h2>
                                <div className="font-mono text-sm text-muted-foreground space-y-3">
                                    <p>You agree to:</p>
                                    <ul className="list-disc pl-6 space-y-2">
                                        <li>Provide accurate information about your skin</li>
                                        <li>Use the service for personal, non-commercial purposes</li>
                                        <li>Not attempt to reverse-engineer our algorithms</li>
                                        <li>Not share your account credentials</li>
                                    </ul>
                                </div>
                            </section>

                            <section>
                                <h2 className="font-serif text-xl font-normal text-foreground mb-4">
                                    6. Limitation of Liability
                                </h2>
                                <div className="font-mono text-sm text-muted-foreground space-y-3">
                                    <p>
                                        DermaOS is provided "as is" without warranties of any kind. We are not liable for any adverse reactions to products recommended through our platform. Always patch test new products.
                                    </p>
                                </div>
                            </section>

                            <section>
                                <h2 className="font-serif text-xl font-normal text-foreground mb-4">
                                    7. Contact
                                </h2>
                                <div className="font-mono text-sm text-muted-foreground">
                                    <p>
                                        For questions about these terms, contact us at:{" "}
                                        <a href="mailto:legal@dermaos.com" className="underline">
                                            legal@dermaos.com
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
