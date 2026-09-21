import Link from "next/link"
import { ArrowLeft, CalendarDays, ShieldCheck, Users } from "lucide-react"
import { ConfirmBookingForm } from "@/components/bookings/ConfirmBookingForm"
import { Footer } from "@/components/home/Footer"
import { Header } from "@/components/home/Header"
import { RoomImage } from "@/components/home/RoomImage"
import { getRoomById, isRoomAvailable } from "@/data/rooms"
import { requireRole } from "@/lib/auth/authorization"
import { displayMoney, multiplyMoney } from "@/lib/money"
import { getRoomImageFallback } from "@/lib/room-presentation"
import { parseRoomStayContext, roomSearchQuery } from "@/lib/room-search"
import { ROOM_TYPE_LABELS } from "@/lib/room-types"
import { isUuid } from "@/lib/uuid"

type SearchParams = Record<string, string | string[] | undefined>

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00.000Z`))
}

export default async function BookingReviewPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const values = await searchParams
  const roomId = typeof values.roomId === "string" ? values.roomId : ""
  const context = parseRoomStayContext(values)
  const reviewQuery = new URLSearchParams({
    ...(roomId ? { roomId } : {}),
    ...(context.input.checkIn ? { checkIn: context.input.checkIn } : {}),
    ...(context.input.checkOut ? { checkOut: context.input.checkOut } : {}),
    ...(context.input.guests ? { guests: context.input.guests } : {}),
    ...(context.input.roomType ? { roomType: context.input.roomType } : {}),
  }).toString()
  const user = await requireRole(
    ["GUEST"],
    `/bookings/new${reviewQuery ? `?${reviewQuery}` : ""}`
  )

  if (!roomId || !isUuid(roomId)) {
    return (
      <ReviewIssue
        title="Choose a valid room"
        messages={["Return to room search and select a room for your stay."]}
      />
    )
  }
  if (context.state !== "valid") {
    return (
      <ReviewIssue
        title="Check your stay details"
        messages={
          context.state === "invalid"
            ? context.errors
            : ["Select dates and guests before reviewing a booking."]
        }
      />
    )
  }

  let room
  try {
    room = await getRoomById(roomId)
  } catch {
    console.error("Booking review room lookup failed.")
    return (
      <ReviewIssue
        title="We couldn't load this booking review"
        messages={["Please try again or return to room search."]}
      />
    )
  }
  if (!room) {
    return (
      <ReviewIssue
        title="This room is no longer listed"
        messages={["Choose another room to continue."]}
      />
    )
  }
  if (context.data.guests > room.capacity) {
    return (
      <ReviewIssue
        title="This room is too small for your party"
        messages={[`This room accommodates up to ${room.capacity} guests.`]}
      />
    )
  }

  let available = false
  try {
    available = await isRoomAvailable(room.id, context.data)
  } catch {
    console.error("Booking review availability query failed.")
    return (
      <ReviewIssue
        title="We couldn't confirm availability"
        messages={["Please try again before confirming your reservation."]}
      />
    )
  }
  if (!available) {
    return (
      <ReviewIssue
        title="This room is no longer available"
        messages={["Search other rooms or select different dates."]}
        searchQuery={roomSearchQuery(context.input)}
      />
    )
  }

  const roomName = ROOM_TYPE_LABELS[room.type]
  const roomQuery = roomSearchQuery(context.input)
  const roomHref = `/rooms/${room.id}?${roomQuery}`
  const searchHref = `/rooms?${roomQuery}`

  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#0f172a]">
      <Header />
      <main className="mx-auto min-h-[70vh] max-w-6xl px-5 py-8 sm:px-8 lg:py-12">
        <Link
          href={roomHref}
          className="inline-flex items-center gap-2 text-sm font-medium text-[#64748b] hover:text-[#1b4332] focus-visible:rounded focus-visible:ring-2 focus-visible:ring-[#1b4332]/30 focus-visible:outline-none"
        >
          <ArrowLeft size={16} /> Back to room
        </Link>
        <div className="mt-6">
          <p className="text-xs font-bold tracking-[0.18em] text-[#ba6548] uppercase">
            Final review
          </p>
          <h1 className="mt-2 font-heading text-3xl font-bold tracking-[-0.04em] text-[#163e2e] sm:text-4xl">
            Review your reservation
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#64748b]">
            Confirm the room, stay, and guest details below. Availability and
            pricing will be checked once more when you confirm.
          </p>
        </div>

        <div className="mt-8 grid gap-7 lg:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.75fr)] lg:items-start">
          <section
            className="overflow-hidden rounded-2xl border border-[#e7e5e0] bg-white shadow-sm"
            aria-labelledby="room-review-heading"
          >
            <div className="grid sm:grid-cols-[minmax(220px,0.8fr)_1.2fr]">
              <div className="group relative aspect-[16/10] min-h-56 overflow-hidden bg-[#e8ebe8] sm:aspect-auto">
                <RoomImage
                  src={room.imageUrl}
                  fallback={getRoomImageFallback(room.type)}
                  alt={`${roomName} at Grand Azure Resort`}
                  sizes="(max-width: 640px) 100vw, 38vw"
                />
              </div>
              <div className="p-6 sm:p-7">
                <p className="text-xs font-bold tracking-[0.16em] text-[#ba6548] uppercase">
                  Room {room.roomNumber}
                </p>
                <h2
                  id="room-review-heading"
                  className="mt-2 font-heading text-2xl font-semibold text-[#163e2e]"
                >
                  {roomName}
                </h2>
                <p className="mt-3 text-sm leading-6 text-[#64748b]">
                  {room.description}
                </p>
                <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
                  <Detail
                    label="Capacity"
                    value={`Up to ${room.capacity} guests`}
                    icon={<Users size={17} />}
                  />
                  <Detail
                    label="Nightly rate"
                    value={`$${displayMoney(room.baseRate)}`}
                  />
                </dl>
              </div>
            </div>
          </section>

          <aside className="rounded-2xl border border-[#e7e5e0] bg-white p-6 shadow-[0_12px_30px_rgba(27,67,50,0.08)] lg:sticky lg:top-6">
            <h2 className="font-heading text-xl font-semibold text-[#163e2e]">
              Booking summary
            </h2>
            <dl className="mt-5 grid grid-cols-2 gap-5 border-b border-[#f1f0ea] pb-5 text-sm">
              <Detail
                label="Check-in"
                value={formatDate(context.data.checkIn)}
                icon={<CalendarDays size={17} />}
              />
              <Detail
                label="Check-out"
                value={formatDate(context.data.checkOut)}
                icon={<CalendarDays size={17} />}
              />
              <Detail
                label="Guests"
                value={String(context.data.guests)}
                icon={<Users size={17} />}
              />
              <Detail
                label="Length"
                value={`${context.data.nights} ${context.data.nights === 1 ? "night" : "nights"}`}
              />
            </dl>
            <div className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between gap-4 text-[#64748b]">
                <span>
                  ${displayMoney(room.baseRate)} × {context.data.nights} nights
                </span>
                <span className="font-medium text-[#334155]">
                  ${multiplyMoney(room.baseRate, context.data.nights)}
                </span>
              </div>
              <div className="flex justify-between gap-4 border-t border-[#f1f0ea] pt-3 font-semibold text-[#163e2e]">
                <span>Room total</span>
                <span>
                  ${multiplyMoney(room.baseRate, context.data.nights)}
                </span>
              </div>
            </div>
            <div className="mt-5 rounded-xl bg-[#f4f3ee] p-4 text-sm">
              <p className="font-semibold text-[#163e2e]">Guest</p>
              <p className="mt-1 text-[#334155]">{user.name}</p>
              <p className="mt-0.5 break-all text-[#64748b]">{user.email}</p>
            </div>
            <div className="mt-4 flex items-start gap-2 text-xs leading-5 text-[#64748b]">
              <ShieldCheck
                size={17}
                className="mt-0.5 shrink-0 text-[#2d6a4f]"
              />
              <p>
                Room rate, capacity, dates, availability, and total are
                recalculated on the server.
              </p>
            </div>
            <ConfirmBookingForm
              roomId={room.id}
              checkIn={context.data.checkIn}
              checkOut={context.data.checkOut}
              guests={context.data.guests}
              searchHref={searchHref}
            />
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  )
}

function Detail({
  label,
  value,
  icon,
}: {
  label: string
  value: string
  icon?: React.ReactNode
}) {
  return (
    <div>
      <dt className="flex items-center gap-2 text-xs font-semibold tracking-wide text-[#94a3b8] uppercase">
        {icon ? <span aria-hidden="true">{icon}</span> : null}
        {label}
      </dt>
      <dd className="mt-1.5 font-medium text-[#334155]">{value}</dd>
    </div>
  )
}

function ReviewIssue({
  title,
  messages,
  searchQuery = "",
}: {
  title: string
  messages: string[]
  searchQuery?: string
}) {
  return (
    <div className="min-h-screen bg-[#faf9f6]">
      <Header />
      <main className="mx-auto flex min-h-[70vh] max-w-3xl items-center px-5 py-16 sm:px-8">
        <div
          role="alert"
          className="w-full rounded-2xl border border-[#e7e5e0] bg-white p-8 text-center shadow-sm"
        >
          <h1 className="font-heading text-3xl font-bold text-[#163e2e]">
            {title}
          </h1>
          <ul className="mx-auto mt-3 max-w-lg space-y-1 text-sm leading-6 text-[#64748b]">
            {messages.map((message) => (
              <li key={message}>{message}</li>
            ))}
          </ul>
          <Link
            href={`/rooms${searchQuery ? `?${searchQuery}` : ""}`}
            className="mt-6 inline-flex rounded-lg bg-[#1b4332] px-5 py-3 text-sm font-semibold text-white hover:bg-[#2d6a4f]"
          >
            Search rooms
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}
