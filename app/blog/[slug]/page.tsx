import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { ArrowLeft, Clock, Calendar } from "lucide-react"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import ReactMarkdown from "react-markdown"

// Blog post data
const blogPosts: Record<string, {
    title: string
    excerpt: string
    content: string
    date: string
    category: string
    readTime: string
    author: string
}> = {
    "understanding-your-skin-type": {
        title: "Understanding Your Skin Type: A Complete Guide",
        excerpt: "Learn how to identify whether you have oily, dry, combination, or normal skin — and why it matters.",
        date: "Dec 10, 2024",
        category: "Education",
        readTime: "5 min read",
        author: "DermaOS Team",
        content: `
Your skin type is the foundation of any effective skincare routine. Without knowing your skin type, you're essentially guessing which products might work for you.

## The Four Main Skin Types

### 1. Oily Skin
**Signs:** Shiny appearance, visible pores, prone to blackheads and acne.

Oily skin produces excess sebum, which can lead to clogged pores and breakouts. However, oily skin also tends to age more slowly due to natural moisture.

**Best ingredients:** Salicylic acid, niacinamide, clay, hyaluronic acid.

### 2. Dry Skin
**Signs:** Tightness, flakiness, rough texture, visible fine lines.

Dry skin lacks natural oils and often struggles to retain moisture. This can lead to irritation and premature aging.

**Best ingredients:** Ceramides, hyaluronic acid, squalane, glycerin.

### 3. Combination Skin
**Signs:** Oily T-zone (forehead, nose, chin) with dry cheeks.

Combination skin is the most common type. It requires a balanced approach — targeting oil in some areas while hydrating others.

**Best ingredients:** Lightweight moisturizers, niacinamide, gentle cleansers.

### 4. Normal Skin
**Signs:** Balanced, few imperfections, small pores, no sensitivity.

Normal skin is well-balanced and doesn't experience extreme oiliness or dryness. The goal is maintenance.

**Best ingredients:** Antioxidants, SPF, gentle actives.

## How to Determine Your Skin Type

**The Bare Face Test:**
1. Wash your face with a gentle cleanser
2. Don't apply any products
3. Wait 2-3 hours
4. Observe your skin:
   - Shiny everywhere? → Oily
   - Tight and flaky? → Dry
   - Shiny T-zone only? → Combination
   - Comfortable and balanced? → Normal

## Why Skin Type Matters

Using products not suited for your skin type can:
- Cause breakouts
- Lead to irritation
- Waste money on ineffective products
- Damage your skin barrier

That's why DermaOS grades every product specifically for YOUR skin type — so you never have to guess again.
    `
    },
    "the-truth-about-retinol": {
        title: "The Truth About Retinol: What Science Says",
        excerpt: "Retinol is the gold standard for anti-aging, but it's not for everyone. Here's what you need to know.",
        date: "Dec 8, 2024",
        category: "Ingredients",
        readTime: "7 min read",
        author: "DermaOS Team",
        content: `
Retinol is one of the most studied and proven anti-aging ingredients in skincare. But with great power comes great responsibility — and potential side effects.

## What is Retinol?

Retinol is a form of Vitamin A that accelerates cell turnover and stimulates collagen production. It's been used in skincare since the 1970s.

## Benefits of Retinol

✅ **Reduces fine lines and wrinkles** — stimulates collagen production

✅ **Fades dark spots** — accelerates cell turnover

✅ **Treats acne** — unclogs pores and reduces inflammation

✅ **Improves texture** — smooths rough skin

## The Downsides

⚠️ **Irritation** — redness, peeling, dryness (especially when starting)

⚠️ **Sun sensitivity** — must use SPF daily

⚠️ **Not for everyone** — sensitive skin may not tolerate it

⚠️ **Purging** — temporary breakouts as skin adjusts

## How to Start Using Retinol

**Week 1-2:** Use once a week

**Week 3-4:** Use twice a week

**Week 5+:** Use every other night

**Eventually:** Can use nightly if tolerated

Always start with a low concentration (0.25-0.3%) and gradually increase.

## Who Should Avoid Retinol?

- Pregnant or breastfeeding women
- Those with eczema or rosacea (consult a dermatologist first)
- Extremely sensitive skin
- Anyone not committed to daily SPF use

## DermaOS Pro Tip

Check your DermaOS grade for retinol products — we'll tell you if it's right for YOUR specific skin profile.
    `
    },
    "skincare-routine-for-indian-skin": {
        title: "How to Build a Skincare Routine for Indian Skin",
        excerpt: "Indian skin has unique needs. Here's how to build a routine that works for our climate and skin tones.",
        date: "Dec 5, 2024",
        category: "Routines",
        readTime: "6 min read",
        author: "DermaOS Team",
        content: `
Indian skin is diverse — from fair Kashmiri skin to deep South Indian tones. But there are some common factors we all deal with: humidity, pollution, and hyperpigmentation.

## Understanding Indian Skin

**Fitzpatrick Type III-VI:** Most Indians fall in this range, meaning we tan easily but are also prone to post-inflammatory hyperpigmentation (PIH).

**Climate factors:** Humidity (especially during monsoons), pollution in cities, and intense sun exposure.

## The Basic Routine

### Morning
1. **Gentle Cleanser** — Remove overnight oil without stripping
2. **Vitamin C Serum** — Brightening and antioxidant protection
3. **Lightweight Moisturizer** — Hydration without heaviness
4. **Sunscreen SPF 50** — NON-NEGOTIABLE

### Evening
1. **Oil/Balm Cleanser** — Remove sunscreen and pollution
2. **Water-based Cleanser** — Deep clean
3. **Treatment** — Niacinamide, retinol, or exfoliating acids
4. **Moisturizer** — Repair overnight

## Key Concerns for Indian Skin

### Hyperpigmentation
Dark spots, melasma, and uneven skin tone are extremely common. Look for:
- Vitamin C
- Alpha Arbutin
- Niacinamide
- Kojic Acid

### Acne
Our humid climate + pollution = clogged pores. Combat with:
- Salicylic Acid
- Niacinamide
- Tea Tree Oil

### Sun Damage
Despite darker skin offering some protection, we STILL need sunscreen. UV damage leads to hyperpigmentation and premature aging.

## Budget-Friendly Brands for India

- Minimalist
- Dot & Key
- Plum
- The Ordinary (available on Nykaa)
- CeraVe

## Final Tip

Use DermaOS to get A-F grades for products based on YOUR specific skin profile — no more guessing what works for Indian skin!
    `
    },
    "niacinamide-vs-vitamin-c": {
        title: "Niacinamide vs Vitamin C: Which One Should You Use?",
        excerpt: "Both are powerhouse ingredients, but they work differently. We break down when to use each.",
        date: "Dec 1, 2024",
        category: "Ingredients",
        readTime: "4 min read",
        author: "DermaOS Team",
        content: `
Niacinamide and Vitamin C are two of the most popular skincare ingredients — and for good reason. But do you need both? Can you use them together?

## Niacinamide (Vitamin B3)

**Best for:** Oil control, pore minimizing, redness reduction, barrier repair

**Benefits:**
- Controls sebum production
- Minimizes pore appearance
- Reduces redness and inflammation
- Strengthens skin barrier
- Fades hyperpigmentation

**Who should use it:** Oily, acne-prone, sensitive skin

## Vitamin C (L-Ascorbic Acid)

**Best for:** Brightening, antioxidant protection, collagen boost

**Benefits:**
- Brightens dull skin
- Protects against sun damage and pollution
- Stimulates collagen production
- Fades dark spots
- Evens skin tone

**Who should use it:** Dull, aging, hyperpigmented skin

## Can You Use Both?

**Yes!** Despite old myths, niacinamide and Vitamin C can be used together. However:

- Use Vitamin C in the morning (antioxidant protection during the day)
- Use Niacinamide in the evening (repair and oil control)

Or use them in the same routine — just wait a few minutes between applications.

## The Verdict

| Your Concern | Choose |
|--------------|--------|
| Oily skin | Niacinamide |
| Dull skin | Vitamin C |
| Acne | Niacinamide |
| Anti-aging | Vitamin C |
| Dark spots | Both! |
| Sensitive | Niacinamide |

## Pro Tip

Not sure which products to pick? DermaOS grades both niacinamide and Vitamin C products specifically for YOUR skin profile.
    `
    }
}

type Props = {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params
    const post = blogPosts[slug]

    if (!post) {
        return { title: "Post Not Found | DermaOS Blog" }
    }

    return {
        title: `${post.title} | DermaOS Blog`,
        description: post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            type: "article",
            publishedTime: post.date,
            authors: [post.author],
        },
    }
}

export default async function BlogPostPage({ params }: Props) {
    const { slug } = await params
    const post = blogPosts[slug]

    if (!post) {
        notFound()
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="pt-20">
                <article className="py-20 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-3xl mx-auto">
                        {/* Back Link */}
                        <Link
                            href="/blog"
                            className="inline-flex items-center gap-2 font-mono text-sm text-muted-foreground hover:text-foreground mb-8"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to Blog
                        </Link>

                        {/* Header */}
                        <header className="mb-12">
                            <span className="font-mono text-xs px-2 py-1 bg-[#F5F5F5] mb-4 inline-block">
                                {post.category}
                            </span>
                            <h1 className="font-serif text-3xl md:text-4xl font-normal text-foreground mb-4">
                                {post.title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-4 font-mono text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    {post.date}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {post.readTime}
                                </span>
                                <span>By {post.author}</span>
                            </div>
                        </header>

                        {/* Content */}
                        <div className="prose prose-sm max-w-none prose-headings:font-serif prose-headings:font-normal prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3 prose-p:font-mono prose-p:text-sm prose-p:text-muted-foreground prose-p:leading-relaxed prose-strong:text-foreground prose-ul:font-mono prose-ul:text-sm prose-ul:text-muted-foreground prose-li:my-1 prose-table:font-mono prose-table:text-sm prose-th:text-left prose-th:p-2 prose-th:border prose-th:border-[#E5E5E5] prose-td:p-2 prose-td:border prose-td:border-[#E5E5E5]">
                            <ReactMarkdown>{post.content}</ReactMarkdown>
                        </div>

                        {/* CTA */}
                        <div className="mt-12 p-8 border border-[#E5E5E5] bg-[#FAFAFA] text-center">
                            <p className="font-mono text-sm text-muted-foreground mb-4">
                                Want personalized product recommendations based on YOUR skin?
                            </p>
                            <Link
                                href="/"
                                className="inline-block font-mono text-sm bg-foreground text-background px-6 py-3 hover:bg-foreground/90"
                            >
                                Try DermaOS Free →
                            </Link>
                        </div>
                    </div>
                </article>
            </main>

            <Footer />
        </div>
    )
}

export async function generateStaticParams() {
    return Object.keys(blogPosts).map((slug) => ({ slug }))
}
