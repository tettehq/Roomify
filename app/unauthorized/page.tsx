import Link from "next/link"
import { ShieldX } from "lucide-react"
import { Footer } from "@/components/home/Footer"
import { Header } from "@/components/home/Header"

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-[#faf9f6]">
      <Header />
      <main className="mx-auto flex min-h-[70vh] max-w-3xl items-center px-5 py-16 sm:px-8">
        <div className="w-full rounded-2xl border border-[#e7e5e0] bg-white p-8 text-center shadow-sm">
          <ShieldX className="mx-auto text-[#ba6548]" size={36} />
          <h1 className="mt-5 font-heading text-3xl font-bold text-[#163e2e]">
            This area isn&apos;t available for your role.
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-[#64748b]">
            Your account is signed in, but it does not have permission to use
            this part of Roomify.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex rounded-lg bg-[#1b4332] px-5 py-3 text-sm font-semibold text-white hover:bg-[#2d6a4f]"
          >
            Return home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}
