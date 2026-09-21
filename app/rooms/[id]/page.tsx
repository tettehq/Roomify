import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, BedDouble, Users } from "lucide-react"
import { BookingSearch } from "@/components/home/BookingSearch"
import { Footer } from "@/components/home/Footer"
import { Header } from "@/components/home/Header"
import { RoomImage } from "@/components/home/RoomImage"
import { StaySummary } from "@/components/rooms/StaySummary"
import { getRoomById, isRoomAvailable } from "@/data/rooms"
import { displayMoney } from "@/lib/money"
import { getRoomImageFallback } from "@/lib/room-presentation"
import { parseRoomStayContext, roomSearchQuery } from "@/lib/room-search"
import { ROOM_TYPE_LABELS } from "@/lib/room-types"
import { isUuid } from "@/lib/uuid"
import { getCurrentUser } from "@/lib/auth/authorization"

type SearchParams = Record<string, string | string[] | undefined>

export default async function RoomDetailsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<SearchParams>
}) {
  const [{ id }, values] = await Promise.all([params, searchParams])
  if (!isUuid(id)) notFound()

  let room
  try {
    room = await getRoomById(id)
  } catch {
    console.error("Room details query failed.")
    return <RoomDetailsError />
  }
  if (!room) notFound()

  const context = parseRoomStayContext(values)
  const viewer = await getCurrentUser()
  let available: boolean | null = null
  if (context.state === "valid") {
    try {
      available = await isRoomAvailable(room.id, context.data)
    } catch {
      console.error("Specific room availability query failed.")
    }
  }

  const name = ROOM_TYPE_LABELS[room.type]
  const query = roomSearchQuery(context.input)

  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#0f172a]">
      <Header />
      <main className="mx-auto min-h-[70vh] max-w-7xl px-5 py-8 sm:px-8 lg:py-12">
        <Link
          href={`/rooms${query ? `?${query}` : ""}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-[#64748b] transition hover:text-[#1b4332] focus-visible:rounded focus-visible:ring-2 focus-visible:ring-[#1b4332]/30 focus-visible:outline-none"
        >
          <ArrowLeft size={16} /> Back to available rooms
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.75fr)] lg:items-start">
          <article className="min-w-0">
            <div className="group relative aspect-[16/10] overflow-hidden rounded-2xl bg-[#e8ebe8] sm:aspect-[16/9]">
              <RoomImage
                src={room.imageUrl}
                fallback={getRoomImageFallback(room.type)}
                alt={`${name} at Grand Azure Resort`}
                sizes="(max-width: 1024px) 100vw, 68vw"
              />
            </div>

            <div className="mt-7">
              <div className="flex flex-col gap-4 border-b border-[#e7e5e0] pb-6 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-bold tracking-[0.18em] text-[#ba6548] uppercase">
                    Room {room.roomNumber}
                  </p>
                  <h1 className="mt-2 font-heading text-3xl font-bold tracking-[-0.04em] text-[#163e2e] sm:text-4xl">
                    {name}
                  </h1>
                </div>
                <p className="shrink-0 text-sm text-[#64748b]">
                  From{" "}
                  <span className="font-heading text-2xl font-bold text-[#163e2e]">
                    ${displayMoney(room.baseRate)}
                  </span>{" "}
                  / night
                </p>
              </div>

              <p className="mt-6 max-w-3xl text-base leading-7 text-[#64748b]">
                {room.description}
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <Feature
                  icon={<Users size={20} />}
                  title={`Up to ${room.capacity} ${room.capacity === 1 ? "guest" : "guests"}`}
                  detail="Maximum room occupancy"
                />
                <Feature
                  icon={<BedDouble size={20} />}
                  title={name}
                  detail="Room category"
                />
              </div>
            </div>
          </article>

          <StaySummary
            room={room}
            context={context}
            available={available}
            viewerRole={viewer?.role ?? null}
          />
        </div>

        {context.state !== "valid" && (
          <section
            className="mt-10 border-t border-[#e7e5e0] pt-8"
            aria-labelledby="select-stay-heading"
          >
            <h2
              id="select-stay-heading"
              className="font-heading text-2xl font-semibold text-[#163e2e]"
            >
              Select dates for this room
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#64748b]">
              Search availability for your stay, then return to this room from
              the results.
            </p>
            <div className="mt-5">
              <BookingSearch
                values={{ ...context.input, roomType: room.type }}
                variant="results"
              />
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  )
}

function Feature({
  icon,
  title,
  detail,
}: {
  icon: React.ReactNode
  title: string
  detail: string
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-[#e7e5e0] bg-white p-4">
      <span
        aria-hidden="true"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eef4f0] text-[#2d6a4f]"
      >
        {icon}
      </span>
      <div>
        <p className="text-sm font-semibold text-[#163e2e]">{title}</p>
        <p className="mt-0.5 text-xs text-[#94a3b8]">{detail}</p>
      </div>
    </div>
  )
}

function RoomDetailsError() {
  return (
    <div className="min-h-screen bg-[#faf9f6]">
      <Header />
      <main className="mx-auto flex min-h-[70vh] max-w-3xl items-center px-5 py-16 sm:px-8">
        <div
          role="alert"
          className="w-full rounded-2xl border border-[#e7e5e0] bg-white p-8 text-center shadow-sm"
        >
          <h1 className="font-heading text-3xl font-bold text-[#163e2e]">
            We couldn&apos;t load this room.
          </h1>
          <p className="mt-3 text-sm leading-6 text-[#64748b]">
            Please try again, or return to the available rooms.
          </p>
          <Link
            href="/rooms"
            className="mt-6 inline-flex rounded-lg bg-[#1b4332] px-5 py-3 text-sm font-semibold text-white hover:bg-[#2d6a4f]"
          >
            View available rooms
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}
