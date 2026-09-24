import { Card } from "@/components/ui/card"
import Link from "next/link"
import { Footer } from "@/components/home/Footer"
import { Header } from "@/components/home/Header"

export function AuthShell({
  eyebrow,
  title,
  description,
  children,
  alternateText,
  alternateHref,
  alternateLabel,
}: {
  eyebrow: string
  title: string
  description: string
  children: React.ReactNode
  alternateText: string
  alternateHref: string
  alternateLabel: string
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main
        id="main-content"
        className="mx-auto grid min-h-[70vh] max-w-6xl items-center px-5 py-12 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:py-20"
      >
        <div className="hidden lg:block">
          <p className="text-xs font-bold tracking-[0.18em] text-muted-foreground uppercase">
            {eyebrow}
          </p>
          <h1 className="mt-4 max-w-md font-heading text-5xl font-bold tracking-[-0.05em] text-foreground">
            {title}
          </h1>
          <p className="mt-5 max-w-md text-base leading-7 text-muted-foreground">
            {description}
          </p>
          <div className="mt-8 h-1 w-16 rounded-full bg-muted-foreground" />
        </div>
        <Card className="mx-auto w-full max-w-lg gap-0 p-6 py-0 sm:p-8">
          <p className="text-xs font-bold tracking-[0.18em] text-muted-foreground uppercase lg:hidden">
            {eyebrow}
          </p>
          <h2 className="mt-2 font-heading text-3xl font-bold tracking-[-0.04em] text-foreground">
            {title}
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground lg:hidden">
            {description}
          </p>
          <div className="mt-7">{children}</div>
          <p className="mt-6 border-t border-border pt-5 text-center text-sm text-muted-foreground">
            {alternateText}{" "}
            <Link
              href={alternateHref}
              className="font-semibold text-primary hover:text-primary focus-visible:rounded focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:outline-none"
            >
              {alternateLabel}
            </Link>
          </p>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
