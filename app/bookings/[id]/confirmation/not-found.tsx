import Link from "next/link"
import { Footer } from "@/components/home/Footer"
import { Header } from "@/components/home/Header"

export default function BookingConfirmationNotFound() {
  return (
    <div className="min-h-screen bg-[#faf9f6]">
      <Header />
      <main className="mx-auto flex min-h-[70vh] max-w-3xl items-center px-5 py-16 sm:px-8">
        <div className="w-full rounded-2xl border border-[#e7e5e0] bg-white p-8 text-center shadow-sm">
          <h1 className="font-heading text-3xl font-bold text-[#163e2e]">
            Reservation not found
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-[#64748b]">
            This reservation does not exist or is not associated with your guest
            account.
          </p>
          <Link
            href="/rooms"
            className="mt-6 inline-flex rounded-lg bg-[#1b4332] px-5 py-3 text-sm font-semibold text-white hover:bg-[#2d6a4f]"
          >
            Browse rooms
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}
