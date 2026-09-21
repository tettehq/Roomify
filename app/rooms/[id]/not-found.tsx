import Link from "next/link"
import { ArrowLeft, BedDouble } from "lucide-react"
import { Footer } from "@/components/home/Footer"
import { Header } from "@/components/home/Header"

export default function RoomNotFound() {
  return (
    <div className="min-h-screen bg-[#faf9f6]">
      <Header />
      <main className="mx-auto flex min-h-[70vh] max-w-3xl items-center px-5 py-16 sm:px-8">
        <div className="w-full rounded-2xl border border-[#e7e5e0] bg-white p-8 text-center shadow-sm">
          <BedDouble className="mx-auto text-[#ba6548]" size={34} />
          <p className="mt-5 text-xs font-bold tracking-[0.18em] text-[#ba6548] uppercase">
            Room not found
          </p>
          <h1 className="mt-3 font-heading text-3xl font-bold text-[#163e2e]">
            This room isn&apos;t available to view.
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-[#64748b]">
            The room link may be incorrect, or the room may no longer be listed.
          </p>
          <Link
            href="/rooms"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#1b4332] px-5 py-3 text-sm font-semibold text-white hover:bg-[#2d6a4f]"
          >
            <ArrowLeft size={16} /> View available rooms
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}
