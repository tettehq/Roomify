import Link from "next/link"
import { ArrowLeft, BedDouble } from "lucide-react"
import { BookingSearch } from "@/components/home/BookingSearch"
import { Footer } from "@/components/home/Footer"
import { Header } from "@/components/home/Header"
import { RoomCard } from "@/components/home/RoomCard"
import { getAvailableRooms } from "@/data/rooms"
import { parseRoomSearch } from "@/lib/room-search"
import { ROOM_TYPE_LABELS } from "@/lib/room-types"

type SearchParams = Promise<Record<string, string | string[] | undefined>>

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00.000Z`))
}

export default async function RoomsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const parsed = parseRoomSearch(await searchParams)

  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#0f172a]">
      <Header />
      <main className="mx-auto min-h-[70vh] max-w-7xl px-5 py-10 sm:px-8 lg:py-14">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#64748b] hover:text-[#1b4332]"
        >
          <ArrowLeft size={16} /> Back to home
        </Link>
        <div className="mt-6">
          <p className="text-xs font-bold tracking-[0.18em] text-[#ba6548] uppercase">
            Find your stay
          </p>
          <h1 className="mt-2 font-heading text-3xl font-bold tracking-[-0.04em] text-[#163e2e] sm:text-4xl">
            Available rooms
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#64748b]">
            Choose dates and guests to see rooms that can accommodate your stay.
          </p>
        </div>

        <div id="search" className="mt-8">
          <BookingSearch values={parsed.input} variant="results" />
        </div>

        {!parsed.success ? (
          <section
            className="mt-8 rounded-2xl border border-[#f0c9ba] bg-[#fff8f5] p-6"
            aria-labelledby="search-errors"
          >
            <h2
              id="search-errors"
              className="font-heading text-lg font-semibold text-[#7a321d]"
            >
              Check your search details
            </h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-[#8b4b38]">
              {parsed.errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </section>
        ) : (
          <RoomResults criteria={parsed.data} />
        )}
      </main>
      <Footer />
    </div>
  )
}

async function RoomResults({
  criteria,
}: {
  criteria: Extract<
    ReturnType<typeof parseRoomSearch>,
    { success: true }
  >["data"]
}) {
  let availableRooms
  try {
    availableRooms = await getAvailableRooms(criteria)
  } catch {
    console.error("Room availability query failed.")
    return (
      <p
        role="alert"
        className="mt-8 rounded-2xl border border-[#e7e5e0] bg-white p-8 text-center text-sm text-[#64748b]"
      >
        We couldn&apos;t check room availability right now. Please try again.
      </p>
    )
  }

  return (
    <section className="mt-10" aria-labelledby="results-heading">
      <div className="flex flex-col gap-5 border-b border-[#e7e5e0] pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2
            id="results-heading"
            className="font-heading text-2xl font-semibold text-[#163e2e]"
          >
            {availableRooms.length}{" "}
            {availableRooms.length === 1 ? "room" : "rooms"} available
          </h2>
          <p className="mt-2 text-sm text-[#64748b]">
            {criteria.nights} {criteria.nights === 1 ? "night" : "nights"} ·
            Rates shown before taxes and fees
          </p>
        </div>
        <dl className="grid grid-cols-2 gap-x-7 gap-y-3 text-sm sm:grid-cols-4">
          <Criterion label="Check-in" value={formatDate(criteria.checkIn)} />
          <Criterion label="Check-out" value={formatDate(criteria.checkOut)} />
          <Criterion label="Guests" value={String(criteria.guests)} />
          <Criterion
            label="Room type"
            value={
              criteria.roomType
                ? ROOM_TYPE_LABELS[criteria.roomType]
                : "Any room"
            }
          />
        </dl>
      </div>

      {availableRooms.length ? (
        <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {availableRooms.map((room) => (
            <RoomCard key={room.id} room={room} stay={criteria} />
          ))}
        </div>
      ) : (
        <div className="mt-8 rounded-2xl border border-[#e7e5e0] bg-white px-6 py-14 text-center">
          <BedDouble className="mx-auto text-[#ba6548]" size={30} />
          <h3 className="mt-4 font-heading text-xl font-semibold text-[#163e2e]">
            No rooms are available for your selected dates.
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#64748b]">
            Try different dates, fewer guests, or another room type.
          </p>
          <a
            href="#search"
            className="mt-5 inline-flex rounded-lg bg-[#1b4332] px-5 py-3 text-sm font-semibold text-white hover:bg-[#2d6a4f]"
          >
            Change search
          </a>
        </div>
      )}
    </section>
  )
}

function Criterion({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold tracking-wide text-[#94a3b8] uppercase">
        {label}
      </dt>
      <dd className="mt-1 font-medium text-[#334155]">{value}</dd>
    </div>
  )
}
