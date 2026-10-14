import { StatusBadge } from "@/components/ui/status-badge"
import Link from "next/link"
import { requireRole } from "@/lib/auth/authorization"
import { getStaffBookings } from "@/data/bookings"
import { getAdminRooms } from "@/data/admin"
import { AdminShell } from "@/components/admin/AdminShell"
import { EditorDialog } from "@/components/admin/EditorDialog"
import { ReservationManagementForm } from "@/components/admin/ManagementForms"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { canEditReservation } from "@/lib/admin-management"
import { bookingStatusEnum } from "@/db/schema"

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>
}) {
  await requireRole(["ADMIN"], "/admin/bookings")
  const params = await searchParams
  const query = typeof params.q === "string" ? params.q : ""
  const status = bookingStatusEnum.enumValues.find(
    (status) => status === params.status
  )
  const [bookings, rooms] = await Promise.all([
    getStaffBookings({ query, status }),
    getAdminRooms(),
  ])
  return (
    <AdminShell
      title="Reservations"
      description="Find a stay, review the details, and keep every reservation on track."
    >
      <form className="flex flex-wrap gap-3 rounded-xl border bg-card p-4">
        <Input
          aria-label="Search bookings"
          className="max-w-sm"
          name="q"
          defaultValue={query}
          placeholder="Guest, room, or booking reference"
        />
        <select
          aria-label="Booking status"
          name="status"
          defaultValue={status ?? ""}
          className="h-10 rounded-lg border bg-background px-3 text-sm"
        >
          <option value="">All statuses</option>
          {bookingStatusEnum.enumValues.map((status) => (
            <option key={status} value={status}>
              {status
                .toLowerCase()
                .replaceAll("_", " ")
                .replace(/^./, (letter) => letter.toUpperCase())}
            </option>
          ))}
        </select>
        <Button variant="outline">Search</Button>
      </form>
      <div className="overflow-x-auto rounded-xl border bg-card">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted">
            <tr>
              {["Guest / room", "Dates", "Status", "Total", "Manage"].map(
                (label) => (
                  <th key={label} className="p-4">
                    {label}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id} className="border-t">
                <td className="p-4">
                  <Link
                    className="font-semibold text-foreground hover:text-primary"
                    href={`/staff/bookings/${booking.id}`}
                  >
                    {booking.guestName} · Room {booking.roomNumber}
                  </Link>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {booking.guestEmail}
                  </p>
                </td>
                <td className="p-4 whitespace-nowrap">
                  {booking.checkIn.toISOString().slice(0, 10)} –{" "}
                  {booking.checkOut.toISOString().slice(0, 10)}
                </td>
                <td className="p-4">
                  <StatusBadge status={booking.status} />
                </td>
                <td className="p-4 font-semibold tabular-nums">
                  ${booking.totalAmount}
                </td>
                <td className="p-4">
                  {canEditReservation(booking.status) ? (
                    <EditorDialog
                      title={`Reservation for ${booking.guestName}`}
                      description={`Room ${booking.roomNumber} · Current total $${booking.totalAmount}`}
                    >
                      <ReservationManagementForm
                        booking={{
                          id: booking.id,
                          roomId: booking.roomId,
                          checkIn: booking.checkIn.toISOString().slice(0, 10),
                          checkOut: booking.checkOut.toISOString().slice(0, 10),
                        }}
                        rooms={rooms}
                      />
                    </EditorDialog>
                  ) : (
                    <Link
                      href={`/staff/bookings/${booking.id}`}
                      className="text-primary"
                    >
                      View details
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="border-t bg-muted/30 px-5 py-3 text-xs text-muted-foreground">
          {bookings.length}{" "}
          {bookings.length === 1 ? "reservation" : "reservations"}
          {query || status ? " matching your filters" : " in total"}
        </div>
        {!bookings.length && (
          <p className="p-6 text-sm text-muted-foreground">
            No reservations match your search.
          </p>
        )}
      </div>
    </AdminShell>
  )
}
