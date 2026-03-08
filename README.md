<div align="center">

# 🧬 DermaOS

**AI-Powered Skin Analysis & Personalized Skincare Marketplace**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)](https://prisma.io)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

[Live Demo](https://dermaos.vercel.app) · [Report Bug](https://github.com/aryansharma/DermaOS/issues)

</div>

---

## 🧠 What is DermaOS?

DermaOS is a full-stack skincare platform that uses **AI-powered skin analysis** to provide personalized product recommendations. Upload a photo, answer a few questions, and get:

- 📊 **Skin metric scores** (oiliness, hydration, acne, texture, elasticity, pigmentation)
- 📈 **4-week prediction** showing potential improvement
- 🛍️ **RAG-powered product recommendations** matched to your skin profile
- 📄 **Downloadable PDF reports** with detailed analysis
- 💳 **Freemium model** with Razorpay payments

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| **AI Skin Scanner** | Upload a photo + describe your concerns → get instant AI analysis using GPT-4o-mini |
| **Metric Dashboard** | Visual bar charts showing current vs predicted scores for 6 skin metrics |
| **Smart Marketplace** | Product cards with ingredient lists, skin type tags, and personalized grades |
| **RAG Engine** | Matches products from 1,300+ items using skin type, concerns, and ingredient compatibility |
| **PDF Reports** | Download detailed analysis with routines, diet tips, and lifestyle recommendations |
| **Premium System** | Google OAuth + Razorpay subscription/one-time purchase for scan credits |
| **Region Support** | Auto-detects India vs Global for currency (₹/\$) and product availability |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **Language** | TypeScript |
| **Database** | PostgreSQL (Supabase) |
| **ORM** | Prisma |
| **Auth** | NextAuth.js (Google OAuth) |
| **AI** | OpenRouter API (GPT-4o-mini, multimodal) |
| **Payments** | Razorpay |
| **Styling** | Tailwind CSS + shadcn/ui |
| **Deployment** | Vercel |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (or [Supabase](https://supabase.com) free tier)
- Google OAuth credentials
- OpenRouter API key
- Razorpay account (test mode)

### Installation

```bash
# Clone the repo
git clone https://github.com/aryansharma/DermaOS.git
cd DermaOS

# Install dependencies
npm install

# Set up environment variables
cp .env.setup .env
# Edit .env with your actual credentials

# Push database schema
npx prisma db push

# Generate Prisma client
npx prisma generate

# Seed products (optional)
npm run db:seed-products

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## 📁 Project Structure

```
DermaOS/
├── app/                    # Next.js App Router
│   ├── api/                # API routes
│   │   ├── ai/             # AI analysis endpoints
│   │   ├── auth/           # NextAuth handlers
│   │   ├── payment/        # Razorpay integration
│   │   ├── products/       # Product CRUD
│   │   ├── recommendations/# RAG-powered recommendations
│   │   └── user/           # User profile management
│   ├── blog/               # Blog pages (SSG)
│   ├── about/              # About page
│   ├── privacy/            # Privacy policy
│   └── terms/              # Terms of service
├── components/             # React components
│   ├── modals/             # Modal dialogs
│   ├── auth/               # Auth components
│   └── ui/                 # shadcn/ui primitives
├── context/                # React contexts
├── lib/                    # Utilities & business logic
│   ├── rag-engine.ts       # Product matching algorithm
│   ├── product-data.ts     # CSV data parsers
│   ├── grading-engine.ts   # Product grading logic
│   ├── openrouter.ts       # AI prompt & API client
│   └── db.ts               # Prisma client singleton
├── prisma/                 # Database schema & seeds
├── public/                 # Static assets
└── styles/                 # Global styles
```

---

## 🔑 Environment Variables

Create a `.env` file based on `.env.setup`:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `NEXTAUTH_SECRET` | Random string for session encryption |
| `NEXTAUTH_URL` | App URL (`http://localhost:3000` for dev) |
| `RAZORPAY_KEY_ID` | Razorpay API key |
| `RAZORPAY_KEY_SECRET` | Razorpay secret key |
| `OPENROUTER_API_KEY` | OpenRouter API key |
| `OPENROUTER_MODEL` | AI model to use (default: `openai/gpt-4o-mini`) |

---

## 📊 Datasets

The RAG engine uses these datasets for product matching:

| File | Products | Fields |
|------|----------|--------|
| `global-skincare.csv` | 1,141 | Name, URL, type, ingredients, price |
| `indian-skincare.csv` | 217 | Skin type, concerns, URL, image |

---

## 🧪 Scripts

```bash
npm run dev              # Start dev server
npm run build            # Production build
npm run db:push          # Push schema to database
npm run db:generate      # Regenerate Prisma client
npm run db:seed-products # Seed products from CSVs
```

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Built with ❤️ by **Aryan Sharma**

</div>
