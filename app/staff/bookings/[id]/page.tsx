import { Card } from "@/components/ui/card"
import Link from "next/link"
import { notFound } from "next/navigation"
import { BookingStatusForm } from "@/components/staff/StatusForm"
import { Footer } from "@/components/home/Footer"
import { Header } from "@/components/home/Header"
import { getStaffBookingById } from "@/data/bookings"
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

export default async function StaffBookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  await requireRole(["STAFF", "ADMIN"], `/staff/bookings/${id}`)
  if (!isUuid(id)) notFound()
  const booking = await getStaffBookingById(id)
  if (!booking) notFound()
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main
        id="main-content"
        className="mx-auto min-h-[70vh] max-w-3xl px-5 py-10 sm:px-8"
      >
        <Link
          href="/staff/bookings"
          className="text-sm font-semibold text-primary"
        >
          ← Booking operations
        </Link>
        <Card className="mt-6 gap-0 p-6 py-0 sm:p-8">
          <p className="text-xs font-bold tracking-[0.16em] text-muted-foreground uppercase">
            Staff booking detail
          </p>
          <h1 className="mt-2 font-heading text-3xl font-bold text-foreground">
            Room {booking.roomNumber} · {ROOM_TYPE_LABELS[booking.roomType]}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Guest: {booking.guestName} · {booking.guestEmail}
          </p>
          <dl className="mt-7 grid gap-5 border-y border-border py-6 sm:grid-cols-2">
            <Detail label="Check-in" value={date(booking.checkIn)} />
            <Detail label="Check-out" value={date(booking.checkOut)} />
            <Detail
              label="Status"
              value={booking.status.replaceAll("_", " ")}
            />
            <Detail
              label="Total"
              value={`$${displayMoney(booking.totalAmount)}`}
            />
          </dl>
          {booking.status === "CONFIRMED" ? (
            <BookingStatusForm bookingId={booking.id} nextStatus="CHECKED_IN" />
          ) : null}
          {booking.status === "CHECKED_IN" ? (
            <BookingStatusForm bookingId={booking.id} nextStatus="COMPLETED" />
          ) : null}
        </Card>
      </main>
      <Footer />
    </div>
  )
}
function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        {label}
      </dt>
      <dd className="mt-1 font-medium text-foreground">{value}</dd>
    </div>
  )
}
