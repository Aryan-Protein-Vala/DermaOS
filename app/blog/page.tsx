import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Blog | DermaOS - Skincare Science Simplified",
    description: "Evidence-based skincare articles to help you understand your skin and make better product choices.",
    openGraph: {
        title: "DermaOS Blog - Skincare Science Simplified",
        description: "Evidence-based skincare articles to help you understand your skin and make better product choices.",
    },
}

const blogPosts = [
    {
        slug: "understanding-your-skin-type",
        title: "Understanding Your Skin Type: A Complete Guide",
        excerpt: "Learn how to identify whether you have oily, dry, combination, or normal skin — and why it matters.",
        date: "Dec 10, 2024",
        category: "Education",
        readTime: "5 min read",
    },
    {
        slug: "the-truth-about-retinol",
        title: "The Truth About Retinol: What Science Says",
        excerpt: "Retinol is the gold standard for anti-aging, but it's not for everyone. Here's what you need to know.",
        date: "Dec 8, 2024",
        category: "Ingredients",
        readTime: "7 min read",
    },
    {
        slug: "skincare-routine-for-indian-skin",
        title: "How to Build a Skincare Routine for Indian Skin",
        excerpt: "Indian skin has unique needs. Here's how to build a routine that works for our climate and skin tones.",
        date: "Dec 5, 2024",
        category: "Routines",
        readTime: "6 min read",
    },
    {
        slug: "niacinamide-vs-vitamin-c",
        title: "Niacinamide vs Vitamin C: Which One Should You Use?",
        excerpt: "Both are powerhouse ingredients, but they work differently. We break down when to use each.",
        date: "Dec 1, 2024",
        category: "Ingredients",
        readTime: "4 min read",
    },
]

export default function BlogPage() {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="pt-20">
                {/* Hero */}
                <section className="py-20 px-4 sm:px-6 lg:px-8 border-b border-[#E5E5E5]">
                    <div className="max-w-4xl mx-auto text-center">
                        <p className="font-mono text-sm text-muted-foreground mb-4">Blog</p>
                        <h1 className="font-serif text-4xl md:text-5xl font-normal text-foreground mb-6">
                            Skincare Science, Simplified
                        </h1>
                        <p className="font-mono text-lg text-muted-foreground max-w-2xl mx-auto">
                            Evidence-based articles to help you make better skincare decisions.
                        </p>
                    </div>
                </section>

                {/* Blog Posts */}
                <section className="py-20 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="space-y-8">
                            {blogPosts.map((post) => (
                                <Link
                                    key={post.slug}
                                    href={`/blog/${post.slug}`}
                                    className="block"
                                >
                                    <article className="group border border-[#E5E5E5] bg-white p-6 hover:shadow-lg transition-shadow">
                                        <div className="flex items-center gap-4 mb-4">
                                            <span className="font-mono text-xs text-muted-foreground">{post.date}</span>
                                            <span className="font-mono text-xs px-2 py-1 bg-[#F5F5F5]">{post.category}</span>
                                            <span className="font-mono text-xs text-muted-foreground">{post.readTime}</span>
                                        </div>
                                        <h2 className="font-serif text-xl font-normal text-foreground mb-3 group-hover:underline">
                                            {post.title}
                                        </h2>
                                        <p className="font-mono text-sm text-muted-foreground mb-4">
                                            {post.excerpt}
                                        </p>
                                        <div className="flex items-center gap-2 font-mono text-sm text-foreground">
                                            Read More <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </article>
                                </Link>
                            ))}
                        </div>

                        <div className="text-center mt-12">
                            <p className="font-mono text-sm text-muted-foreground">
                                More articles coming soon...
                            </p>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}
