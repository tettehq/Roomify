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
    <div className="min-h-screen bg-[#faf9f6] text-[#0f172a]">
      <Header />
      <main className="mx-auto grid min-h-[70vh] max-w-6xl items-center px-5 py-12 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:py-20">
        <div className="hidden lg:block">
          <p className="text-xs font-bold tracking-[0.18em] text-[#ba6548] uppercase">
            {eyebrow}
          </p>
          <h1 className="mt-4 max-w-md font-heading text-5xl font-bold tracking-[-0.05em] text-[#163e2e]">
            {title}
          </h1>
          <p className="mt-5 max-w-md text-base leading-7 text-[#64748b]">
            {description}
          </p>
          <div className="mt-8 h-1 w-16 rounded-full bg-[#ba6548]" />
        </div>
        <section className="mx-auto w-full max-w-lg rounded-2xl border border-[#e7e5e0] bg-white p-6 shadow-[0_12px_30px_rgba(27,67,50,0.08)] sm:p-8">
          <p className="text-xs font-bold tracking-[0.18em] text-[#ba6548] uppercase lg:hidden">
            {eyebrow}
          </p>
          <h2 className="mt-2 font-heading text-3xl font-bold tracking-[-0.04em] text-[#163e2e]">
            {title}
          </h2>
          <p className="mt-2 text-sm leading-6 text-[#64748b] lg:hidden">
            {description}
          </p>
          <div className="mt-7">{children}</div>
          <p className="mt-6 border-t border-[#f1f0ea] pt-5 text-center text-sm text-[#64748b]">
            {alternateText}{" "}
            <Link
              href={alternateHref}
              className="font-semibold text-[#2d6a4f] hover:text-[#1b4332] focus-visible:rounded focus-visible:ring-2 focus-visible:ring-[#1b4332]/30 focus-visible:outline-none"
            >
              {alternateLabel}
            </Link>
          </p>
        </section>
      </main>
      <Footer />
    </div>
  )
}
