import { Card } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, BedDouble } from "lucide-react"
import { BookingSearch } from "@/components/home/BookingSearch"
import { Footer } from "@/components/home/Footer"
import { Header } from "@/components/home/Header"
import { RoomCard } from "@/components/home/RoomCard"
import { getAvailableRooms, getBrowseRooms } from "@/data/rooms"
import { parseRoomSearch } from "@/lib/room-search"
import { isRoomType, ROOM_TYPE_LABELS } from "@/lib/room-types"

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
  const values = await searchParams
  const parsed = parseRoomSearch(values)
  const hasCheckIn =
    typeof values.checkIn === "string" && values.checkIn.length > 0
  const hasCheckOut =
    typeof values.checkOut === "string" && values.checkOut.length > 0
  const hasAnyDate = hasCheckIn || hasCheckOut
  const browseGuests =
    typeof values.guests === "string" && /^\d+$/.test(values.guests)
      ? Number(values.guests)
      : undefined
  const browseRoomType =
    typeof values.roomType === "string" && isRoomType(values.roomType)
      ? values.roomType
      : undefined

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main
        id="main-content"
        className="mx-auto min-h-[70vh] max-w-7xl px-5 py-10 sm:px-8 lg:py-14"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary"
        >
          <ArrowLeft size={16} /> Back to home
        </Link>
        <div className="mt-6">
          <p className="text-xs font-bold tracking-[0.18em] text-muted-foreground uppercase">
            Find your stay
          </p>
          <h1 className="mt-2 font-heading text-3xl font-bold tracking-[-0.04em] text-foreground sm:text-4xl">
            Available rooms
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
            Choose dates and guests to see rooms that can accommodate your stay.
          </p>
        </div>

        <div id="search" className="mt-8">
          <BookingSearch
            key={JSON.stringify(parsed.input)}
            values={parsed.input}
            variant="results"
          />
        </div>

        {hasAnyDate && !hasCheckIn ? (
          <SearchMessage
            title="Add a check-in date"
            message="Choose both check-in and check-out dates to filter rooms by stay availability."
          />
        ) : hasAnyDate && !hasCheckOut ? (
          <SearchMessage
            title="Add a check-out date"
            message="Choose both check-in and check-out dates to filter rooms by stay availability."
          />
        ) : hasAnyDate && !parsed.success ? (
          <section
            className="mt-8 rounded-2xl border border-destructive/25 bg-destructive/5 p-6"
            aria-labelledby="search-errors"
          >
            <h2
              id="search-errors"
              className="font-heading text-lg font-semibold text-destructive"
            >
              Check your search details
            </h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-destructive">
              {parsed.errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </section>
        ) : hasAnyDate && parsed.success ? (
          <RoomResults criteria={parsed.data} />
        ) : (
          <BrowseResults guests={browseGuests} roomType={browseRoomType} />
        )}
      </main>
      <Footer />
    </div>
  )
}

function SearchMessage({ title, message }: { title: string; message: string }) {
  return (
    <section
      className="mt-8 rounded-2xl border border-destructive/25 bg-destructive/5 p-6"
      role="alert"
    >
      <h2 className="font-heading text-lg font-semibold text-destructive">
        {title}
      </h2>
      <p className="mt-2 text-sm leading-6 text-destructive">{message}</p>
    </section>
  )
}

async function BrowseResults({
  guests,
  roomType,
}: {
  guests?: number
  roomType?: Parameters<typeof getBrowseRooms>[0] extends infer T
    ? T extends { roomType?: infer R }
      ? R
      : never
    : never
}) {
  let rooms
  try {
    rooms = await getBrowseRooms({ guests, roomType })
  } catch {
    console.error("Room browsing query failed.")
    return (
      <SearchMessage
        title="Rooms are temporarily unavailable"
        message="Please try again in a moment."
      />
    )
  }
  return (
    <section className="mt-10" aria-labelledby="browse-heading">
      <div className="border-b border-border pb-6">
        <h2
          id="browse-heading"
          className="font-heading text-2xl font-semibold text-foreground"
        >
          {rooms.length} {rooms.length === 1 ? "room" : "rooms"} to explore
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Browse rooms now, then add dates when you are ready to check
          availability.
        </p>
      </div>
      {rooms.length ? (
        <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      ) : (
        <Card className="mt-8 gap-0 px-6 py-0 py-14 text-center">
          <BedDouble className="mx-auto text-muted-foreground" size={30} />
          <h3 className="mt-4 font-heading text-xl font-semibold text-foreground">
            No rooms match those filters.
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Try browsing all rooms or choosing a different room type.
          </p>
        </Card>
      )}
    </section>
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
        className="mt-8 rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground"
      >
        We couldn&apos;t check room availability right now. Please try again.
      </p>
    )
  }

  return (
    <section className="mt-10" aria-labelledby="results-heading">
      <div className="flex flex-col gap-5 border-b border-border pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2
            id="results-heading"
            className="font-heading text-2xl font-semibold text-foreground"
          >
            {availableRooms.length}{" "}
            {availableRooms.length === 1 ? "room" : "rooms"} available
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
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
        <Card className="mt-8 gap-0 px-6 py-0 py-14 text-center">
          <BedDouble className="mx-auto text-muted-foreground" size={30} />
          <h3 className="mt-4 font-heading text-xl font-semibold text-foreground">
            No rooms are available for your selected dates.
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            Try different dates, fewer guests, or another room type.
          </p>
          <a
            href="#search"
            className="mt-5 inline-flex rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary"
          >
            Change search
          </a>
        </Card>
      )}
    </section>
  )
}

function Criterion({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        {label}
      </dt>
      <dd className="mt-1 font-medium text-foreground">{value}</dd>
    </div>
  )
}
