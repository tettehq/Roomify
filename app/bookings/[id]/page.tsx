import { Card } from "@/components/ui/card"
import { LinkButton } from "@/components/ui/link-button"
import { StatusBadge } from "@/components/ui/status-badge"
import Link from "next/link"
import { notFound } from "next/navigation"
import { CalendarDays, ArrowLeft } from "lucide-react"
import { CancelBookingForm } from "@/components/bookings/CancelBookingForm"
import { Footer } from "@/components/home/Footer"
import { Header } from "@/components/home/Header"
import { getGuestBookingById } from "@/data/bookings"
import { requireRole } from "@/lib/auth/authorization"
import { displayMoney } from "@/lib/money"
import { ROOM_TYPE_LABELS } from "@/lib/room-types"
import { isUuid } from "@/lib/uuid"

const date = (value: Date) =>
  new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(value)

export default async function GuestBookingPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user = await requireRole(["GUEST"], `/bookings/${id}`)
  if (!isUuid(id)) notFound()
  const booking = await getGuestBookingById(id, user.id)
  if (!booking) notFound()
  const cancellable =
    ["PENDING", "CONFIRMED"].includes(booking.status) &&
    // This authenticated Server Component evaluates eligibility at request time.
    // eslint-disable-next-line react-hooks/purity
    booking.checkIn.getTime() > Date.now()
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main
        id="main-content"
        className="mx-auto min-h-[70vh] max-w-3xl px-5 py-10 sm:px-8"
      >
        <Link
          href="/bookings"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground"
        >
          <ArrowLeft size={16} /> Back to my bookings
        </Link>
        <Card className="mt-7 gap-0 p-6 py-0 sm:p-8">
          <p className="text-xs font-bold tracking-[0.16em] text-muted-foreground uppercase">
            Booking details
          </p>
          <div className="mt-2 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="font-heading text-3xl font-bold text-foreground">
                {ROOM_TYPE_LABELS[booking.roomType]}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Room {booking.roomNumber}
              </p>
            </div>
            <StatusBadge status={booking.status} />
          </div>
          <dl className="mt-7 grid gap-5 border-y border-border py-6 sm:grid-cols-2">
            <Detail label="Check-in" value={date(booking.checkIn)} />
            <Detail label="Check-out" value={date(booking.checkOut)} />
            <Detail
              label="Total"
              value={`$${displayMoney(booking.totalAmount)}`}
            />
            <Detail label="Reference" value={booking.id} />
          </dl>
          <div className="flex flex-wrap gap-3">
            <LinkButton
              href={`/bookings/${booking.id}/confirmation`}
              variant="default"
              className=""
            >
              View confirmation
            </LinkButton>
            {booking.status === "CHECKED_IN" ? (
              <LinkButton
                href={`/bookings/${booking.id}/room-service`}
                variant="outline"
                className=""
              >
                Room service
              </LinkButton>
            ) : null}
          </div>
          {cancellable ? <CancelBookingForm bookingId={booking.id} /> : null}
        </Card>
      </main>
      <Footer />
    </div>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="flex items-center gap-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        <CalendarDays size={16} />
        {label}
      </dt>
      <dd className="mt-1 font-medium break-all text-foreground">{value}</dd>
    </div>
  )
}
