import type React from "react"
import type { Metadata } from "next"
import { Geist_Mono, Inter, Playfair_Display } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Providers } from "@/components/providers"
import "./globals.css"

const _inter = Inter({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })
const _playfair = Playfair_Display({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "DermaOS | Skincare is Biology, Not Marketing",
    template: "%s | DermaOS",
  },
  description: "The first skincare marketplace that filters by YOUR DNA. Get personalized A-F ratings for 14,000+ products based on your unique skin profile.",
  keywords: ["skincare", "personalized skincare", "skin type", "product recommendations", "skin analysis", "dermatology", "skincare routine", "Indian skincare"],
  authors: [{ name: "DermaOS" }],
  creator: "DermaOS",
  publisher: "DermaOS",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://dermaos.com",
    siteName: "DermaOS",
    title: "DermaOS | Skincare is Biology, Not Marketing",
    description: "The first skincare marketplace that filters by YOUR DNA. Get personalized A-F ratings for 14,000+ products.",
  },
  twitter: {
    card: "summary_large_image",
    title: "DermaOS | Skincare is Biology, Not Marketing",
    description: "The first skincare marketplace that filters by YOUR DNA. Get personalized A-F ratings for 14,000+ products.",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <Providers>
          {children}
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
