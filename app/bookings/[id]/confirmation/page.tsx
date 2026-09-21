import Link from "next/link"
import { CalendarDays, CheckCircle2, Home, Users } from "lucide-react"
import { notFound } from "next/navigation"
import { Footer } from "@/components/home/Footer"
import { Header } from "@/components/home/Header"
import { RoomImage } from "@/components/home/RoomImage"
import { getGuestBookingById } from "@/data/bookings"
import { requireRole } from "@/lib/auth/authorization"
import { displayMoney } from "@/lib/money"
import { getRoomImageFallback } from "@/lib/room-presentation"
import { calculateHotelNights } from "@/lib/room-search"
import { ROOM_TYPE_LABELS } from "@/lib/room-types"
import { isUuid } from "@/lib/uuid"

function dateOnly(value: Date) {
  return value.toISOString().slice(0, 10)
}

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(value)
}

export default async function BookingConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user = await requireRole(["GUEST"], `/bookings/${id}/confirmation`)
  if (!isUuid(id)) notFound()

  const booking = await getGuestBookingById(id, user.id)
  if (!booking) notFound()

  const roomName = ROOM_TYPE_LABELS[booking.roomType]
  const nights = calculateHotelNights(
    dateOnly(booking.checkIn),
    dateOnly(booking.checkOut)
  )

  return (
    <div className="min-h-screen bg-[#faf9f6] text-[#0f172a]">
      <Header />
      <main className="mx-auto min-h-[70vh] max-w-4xl px-5 py-10 sm:px-8 lg:py-16">
        <section
          aria-labelledby="confirmation-heading"
          className="overflow-hidden rounded-2xl border border-[#dce7df] bg-white shadow-[0_18px_45px_rgba(27,67,50,0.1)]"
        >
          <div className="bg-[#1b4332] px-6 py-9 text-center text-white sm:px-10">
            <CheckCircle2 className="mx-auto" size={44} aria-hidden="true" />
            <p className="mt-4 text-xs font-bold tracking-[0.18em] text-[#d8eee1] uppercase">
              Booking confirmed
            </p>
            <h1
              id="confirmation-heading"
              className="mt-2 font-heading text-3xl font-bold tracking-[-0.04em] sm:text-4xl"
            >
              Your reservation is confirmed
            </h1>
            <p className="mt-3 text-sm text-[#d8eee1]">
              We look forward to welcoming you, {user.name}.
            </p>
          </div>

          <div className="grid md:grid-cols-[minmax(240px,0.85fr)_1.15fr]">
            <div className="relative min-h-64 overflow-hidden bg-[#e8ebe8]">
              <RoomImage
                src={booking.roomImageUrl}
                fallback={getRoomImageFallback(booking.roomType)}
                alt={`${roomName} at Grand Azure Resort`}
                sizes="(max-width: 768px) 100vw, 38vw"
              />
            </div>
            <div className="p-6 sm:p-8">
              <p className="text-xs font-bold tracking-[0.16em] text-[#ba6548] uppercase">
                Room {booking.roomNumber}
              </p>
              <h2 className="mt-2 font-heading text-2xl font-semibold text-[#163e2e]">
                {roomName}
              </h2>
              <p className="mt-2 text-sm leading-6 text-[#64748b]">
                {booking.roomDescription}
              </p>

              <dl className="mt-6 grid gap-5 border-y border-[#f1f0ea] py-5 sm:grid-cols-2">
                <ConfirmationDetail
                  label="Check-in"
                  value={formatDate(booking.checkIn)}
                  icon={<CalendarDays size={17} />}
                />
                <ConfirmationDetail
                  label="Check-out"
                  value={formatDate(booking.checkOut)}
                  icon={<CalendarDays size={17} />}
                />
                <ConfirmationDetail
                  label="Length of stay"
                  value={`${nights} ${nights === 1 ? "night" : "nights"}`}
                />
                <ConfirmationDetail
                  label="Room capacity"
                  value={`Up to ${booking.roomCapacity} guests`}
                  icon={<Users size={17} />}
                />
              </dl>

              <div className="mt-5 flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold tracking-wide text-[#94a3b8] uppercase">
                    Reservation total
                  </p>
                  <p className="mt-1 font-heading text-2xl font-bold text-[#163e2e]">
                    ${displayMoney(booking.totalAmount)}
                  </p>
                </div>
                <span className="rounded-full bg-[#e8f3ec] px-3 py-1.5 text-xs font-bold tracking-wide text-[#276044] uppercase">
                  {booking.status.replaceAll("_", " ")}
                </span>
              </div>
              <p className="mt-5 rounded-xl bg-[#f4f3ee] p-4 text-xs leading-5 break-all text-[#64748b]">
                Booking reference:{" "}
                <strong className="text-[#334155]">{booking.id}</strong>
              </p>
            </div>
          </div>
        </section>

        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/rooms"
            className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#1b4332] px-6 text-sm font-semibold text-white hover:bg-[#2d6a4f]"
          >
            Browse more rooms
          </Link>
          <Link
            href="/"
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#d7ddd8] bg-white px-6 text-sm font-semibold text-[#1b4332] hover:bg-[#f4f3ee]"
          >
            <Home size={16} /> Return home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}

function ConfirmationDetail({
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
