import { Card } from "@/components/ui/card"
import { LinkButton } from "@/components/ui/link-button"
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
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main
        id="main-content"
        className="mx-auto min-h-[70vh] max-w-7xl px-5 py-8 sm:px-8 lg:py-12"
      >
        <Link
          href={`/rooms${query ? `?${query}` : ""}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-primary focus-visible:rounded focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:outline-none"
        >
          <ArrowLeft size={16} /> Back to available rooms
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.75fr)] lg:items-start">
          <article className="min-w-0">
            <div className="group relative aspect-[16/10] overflow-hidden rounded-2xl bg-muted sm:aspect-[16/9]">
              <RoomImage
                src={room.imageUrl}
                fallback={getRoomImageFallback(room.type)}
                alt={`${name} at Grand Azure Resort`}
                sizes="(max-width: 1024px) 100vw, 68vw"
              />
            </div>

            <div className="mt-7">
              <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-bold tracking-[0.18em] text-muted-foreground uppercase">
                    Room {room.roomNumber}
                  </p>
                  <h1 className="mt-2 font-heading text-3xl font-bold tracking-[-0.04em] text-foreground sm:text-4xl">
                    {name}
                  </h1>
                </div>
                <p className="shrink-0 text-sm text-muted-foreground">
                  From{" "}
                  <span className="font-heading text-2xl font-bold text-foreground">
                    ${displayMoney(room.baseRate)}
                  </span>{" "}
                  / night
                </p>
              </div>

              <p className="mt-6 max-w-3xl text-base leading-7 text-muted-foreground">
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
            className="mt-10 border-t border-border pt-8"
            aria-labelledby="select-stay-heading"
          >
            <h2
              id="select-stay-heading"
              className="font-heading text-2xl font-semibold text-foreground"
            >
              Select dates for this room
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
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
    <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-4">
      <span
        aria-hidden="true"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-primary"
      >
        {icon}
      </span>
      <div>
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{detail}</p>
      </div>
    </div>
  )
}

function RoomDetailsError() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main
        id="main-content"
        className="mx-auto flex min-h-[70vh] max-w-3xl items-center px-5 py-16 sm:px-8"
      >
        <Card role="alert" className="w-full gap-0 p-8 py-0 text-center">
          <h1 className="font-heading text-3xl font-bold text-foreground">
            We couldn&apos;t load this room.
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Please try again, or return to the available rooms.
          </p>
          <LinkButton href="/rooms" variant="default" className="mt-6">
            View available rooms
          </LinkButton>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
