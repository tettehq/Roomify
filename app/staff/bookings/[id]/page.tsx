import Link from "next/link"
import { notFound } from "next/navigation"
import { CalendarDays, ArrowLeft, BedDouble, UserRound } from "lucide-react"
import { BookingStatusForm } from "@/components/staff/StatusForm"
import { AdminShell } from "@/components/admin/AdminShell"
import { StatusBadge } from "@/components/ui/status-badge"
import { getStaffBookingById } from "@/data/bookings"
import { requireRole } from "@/lib/auth/authorization"
import { displayMoney } from "@/lib/money"
import { ROOM_TYPE_LABELS } from "@/lib/room-types"
import { isUuid } from "@/lib/uuid"
const date = (value: Date) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
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
  const user = await requireRole(["STAFF", "ADMIN"], `/staff/bookings/${id}`)
  if (!isUuid(id)) notFound()
  const booking = await getStaffBookingById(id)
  if (!booking) notFound()
  return (
    <AdminShell
      title={`Room ${booking.roomNumber}`}
      description={`${ROOM_TYPE_LABELS[booking.roomType]} · Reservation details`}
      action={<StatusBadge status={booking.status} />}
    >
      <Link
        href="/staff/bookings"
        className="inline-flex items-center gap-2 text-sm font-medium text-primary"
      >
        <ArrowLeft size={16} />
        All reservations
      </Link>
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className="overflow-hidden rounded-xl border bg-card">
          <div className="flex items-center gap-3 border-b px-6 py-5">
            <CalendarDays size={19} className="text-primary" />
            <h2 className="font-heading text-lg font-semibold">
              Stay information
            </h2>
          </div>
          <dl className="grid gap-7 p-6 sm:grid-cols-2">
            <Detail label="Check-in" value={date(booking.checkIn)} />
            <Detail label="Check-out" value={date(booking.checkOut)} />
            <Detail
              label="Room type"
              value={ROOM_TYPE_LABELS[booking.roomType]}
            />
            <Detail
              label="Reservation total"
              value={`$${displayMoney(booking.totalAmount)}`}
            />
          </dl>
          <div className="border-t bg-muted/30 px-6 py-4">
            <p className="text-xs text-muted-foreground">Booking reference</p>
            <p className="mt-1 font-mono text-xs break-all">{booking.id}</p>
          </div>
        </section>
        <div className="space-y-6">
          <section className="rounded-xl border bg-card p-6">
            <div className="flex items-center gap-2">
              <UserRound size={18} className="text-primary" />
              <h2 className="font-semibold">Guest details</h2>
            </div>
            <p className="mt-5 font-medium">{booking.guestName}</p>
            <p className="mt-1 text-sm break-all text-muted-foreground">
              {booking.guestEmail}
            </p>
          </section>
          <section className="rounded-xl border bg-card p-6">
            <div className="flex items-center gap-2">
              <BedDouble size={18} className="text-primary" />
              <h2 className="font-semibold">Stay actions</h2>
            </div>
            <p className="mt-3 text-xs leading-5 text-muted-foreground">
              Check guests in on their arrival date and complete their stay at
              departure.
            </p>
            {booking.status === "CONFIRMED" ? (
              <BookingStatusForm bookingId={id} nextStatus="CHECKED_IN" />
            ) : booking.status === "CHECKED_IN" ? (
              <BookingStatusForm bookingId={id} nextStatus="COMPLETED" />
            ) : (
              <p className="mt-4 text-sm text-muted-foreground">
                No check-in or check-out action is available for this status.
              </p>
            )}
            {user.role === "ADMIN" && (
              <Link
                href={`/admin/bookings?q=${id}`}
                className="mt-5 block border-t pt-4 text-xs font-semibold text-primary"
              >
                Manage dates, room, or cancellation →
              </Link>
            )}
          </section>
        </div>
      </div>
    </AdminShell>
  )
}
function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-2 text-base font-semibold">{value}</dd>
    </div>
  )
}
