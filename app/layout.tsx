import { Geist_Mono, Inter, Plus_Jakarta_Sans } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { Metadata } from "next";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

const siteURL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
const description = "Roomify is a hotel operations service. It works to address inefficiencies by providing a unified, real-time hotel services management platform. The application bridges the gap between guests and hotel administration by streamlining customer operations (booking, digital payments, in-room orders) and empowering managers with central tools for staff oversight and inventory tracking. The goal is to maximize operational efficiency for hotels while delivering a smooth, self-service experience for guests."

export const metadata: Metadata = {
  title: {
    default: "Roomify",
    template: "%s | Roomify"
  },
  description,
  openGraph: {
    type: "website",
    siteName: "Roomify",
    title: "Roomify",
    url: "/",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Roomify: hotel operations platform",
      },
    ],
  },
  icons: {
      icon: "/favicon.ico",
  },
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        jakarta.variable,
        "font-sans",
        inter.variable
      )}
    >
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
