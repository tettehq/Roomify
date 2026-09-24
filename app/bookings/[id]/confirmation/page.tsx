import { Card } from "@/components/ui/card"
import { LinkButton } from "@/components/ui/link-button"
import { StatusBadge } from "@/components/ui/status-badge"

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
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main
        id="main-content"
        className="mx-auto min-h-[70vh] max-w-4xl px-5 py-10 sm:px-8 lg:py-16"
      >
        <Card
          aria-labelledby="confirmation-heading"
          className="gap-0 overflow-hidden py-0"
        >
          <div className="bg-primary px-6 py-9 text-center text-primary-foreground sm:px-10">
            <CheckCircle2 className="mx-auto" size={44} aria-hidden="true" />
            <p className="mt-4 text-xs font-bold tracking-[0.18em] text-primary-foreground uppercase">
              Booking confirmed
            </p>
            <h1
              id="confirmation-heading"
              className="mt-2 font-heading text-3xl font-bold tracking-[-0.04em] sm:text-4xl"
            >
              Your reservation is confirmed
            </h1>
            <p className="mt-3 text-sm text-primary-foreground">
              We look forward to welcoming you, {user.name}.
            </p>
          </div>

          <div className="grid md:grid-cols-[minmax(240px,0.85fr)_1.15fr]">
            <div className="relative min-h-64 overflow-hidden bg-muted">
              <RoomImage
                src={booking.roomImageUrl}
                fallback={getRoomImageFallback(booking.roomType)}
                alt={`${roomName} at Grand Azure Resort`}
                sizes="(max-width: 768px) 100vw, 38vw"
              />
            </div>
            <div className="p-6 sm:p-8">
              <p className="text-xs font-bold tracking-[0.16em] text-muted-foreground uppercase">
                Room {booking.roomNumber}
              </p>
              <h2 className="mt-2 font-heading text-2xl font-semibold text-foreground">
                {roomName}
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {booking.roomDescription}
              </p>

              <dl className="mt-6 grid gap-5 border-y border-border py-5 sm:grid-cols-2">
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
                  <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                    Reservation total
                  </p>
                  <p className="mt-1 font-heading text-2xl font-bold text-foreground">
                    ${displayMoney(booking.totalAmount)}
                  </p>
                </div>
                <StatusBadge status={booking.status} />
              </div>
              <p className="mt-5 rounded-xl bg-muted p-4 text-xs leading-5 break-all text-muted-foreground">
                Booking reference:{" "}
                <strong className="text-foreground">{booking.id}</strong>
              </p>
            </div>
          </div>
        </Card>

        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <LinkButton href="/rooms" variant="default" className="min-h-12">
            Browse more rooms
          </LinkButton>
          <LinkButton href="/" variant="outline" className="min-h-12">
            <Home size={16} /> Return home
          </LinkButton>
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
      <dt className="flex items-center gap-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        {icon ? <span aria-hidden="true">{icon}</span> : null}
        {label}
      </dt>
      <dd className="mt-1.5 font-medium text-foreground">{value}</dd>
    </div>
  )
}
