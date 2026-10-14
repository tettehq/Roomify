import Link from "next/link"
import {
  ArrowRight,
  ArrowDownLeft,
  ArrowUpRight,
  BedDouble,
  UtensilsCrossed,
  Users,
  CalendarDays,
} from "lucide-react"
import { requireRole } from "@/lib/auth/authorization"
import { getStaffDashboardData } from "@/data/operations"
import { getAdminUsers } from "@/data/admin-management"
import { AdminShell } from "@/components/admin/AdminShell"
import { StatusBadge } from "@/components/ui/status-badge"
import { LinkButton } from "@/components/ui/link-button"

export default async function AdminPage() {
  await requireRole(["ADMIN"], "/admin")
  const [data, users] = await Promise.all([
    getStaffDashboardData(),
    getAdminUsers(),
  ])
  const totalRooms = data.roomSummary.reduce((sum, room) => sum + room.count, 0)
  const metrics = [
    {
      label: "Arrivals today",
      value: data.arrivals.length,
      detail: "Expected check-ins",
      icon: ArrowDownLeft,
      href: "/staff",
    },
    {
      label: "Departures today",
      value: data.departures.length,
      detail: "Scheduled check-outs",
      icon: ArrowUpRight,
      href: "/staff",
    },
    {
      label: "In-house stays",
      value: data.currentStays.length,
      detail: "Currently checked in",
      icon: BedDouble,
      href: "/staff/bookings?status=CHECKED_IN",
    },
    {
      label: "Pending orders",
      value: data.pendingOrders,
      detail: "Awaiting service",
      icon: UtensilsCrossed,
      href: "/staff/room-service",
    },
  ]
  return (
    <AdminShell
      title="Overview"
      description="A clear view of your property. Here’s what’s happening today."
      action={
        <LinkButton href="/admin/bookings">
          Manage reservations <ArrowRight size={16} />
        </LinkButton>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(({ label, value, detail, icon: Icon, href }) => (
          <Link
            key={label}
            href={href}
            className="group rounded-xl border bg-card p-5 transition-shadow hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                {label}
              </span>
              <Icon size={19} className="text-primary" />
            </div>
            <p className="mt-5 font-heading text-4xl font-semibold tracking-tight tabular-nums">
              {value}
            </p>
            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
              <span>{detail}</span>
              <ArrowUpRight
                size={14}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </div>
          </Link>
        ))}
      </div>
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_300px]">
        <section className="min-w-0 overflow-hidden rounded-xl border bg-card">
          <div className="flex items-center justify-between gap-3 border-b px-6 py-5">
            <div>
              <h2 className="font-heading text-lg font-semibold">
                Reservation activity
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Upcoming arrivals and current stays
              </p>
            </div>
            <Link
              href="/admin/bookings"
              className="flex items-center gap-2 text-xs font-semibold text-primary"
            >
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr>
                  <th>Guest</th>
                  <th>Arrival</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.activeBookings.slice(0, 6).map((booking) => (
                  <tr key={booking.id} className="border-b last:border-0">
                    <td>
                      <Link
                        href={`/staff/bookings/${booking.id}`}
                        className="font-semibold hover:text-primary"
                      >
                        {booking.guestName}
                      </Link>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Room {booking.roomNumber}
                      </p>
                    </td>
                    <td className="whitespace-nowrap text-muted-foreground">
                      {new Intl.DateTimeFormat("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        timeZone: "UTC",
                      }).format(booking.checkIn)}
                    </td>
                    <td>
                      <StatusBadge status={booking.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!data.activeBookings.length && (
            <div className="px-6 py-14 text-center">
              <CalendarDays className="mx-auto mb-3 text-muted-foreground" />
              <p className="text-sm font-medium">No active reservations</p>
              <p className="mt-1 text-xs text-muted-foreground">
                New bookings will appear here.
              </p>
            </div>
          )}
        </section>
        <div className="space-y-6">
          <section className="rounded-xl border bg-card p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-lg font-semibold">
                Room readiness
              </h2>
              <BedDouble size={19} className="text-muted-foreground" />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {totalRooms} rooms in your property
            </p>
            <div className="mt-6 space-y-5">
              {[
                {
                  status: "AVAILABLE",
                  label: "Available",
                  color: "bg-emerald-500",
                },
                { status: "OCCUPIED", label: "Occupied", color: "bg-sky-500" },
                {
                  status: "NEEDS_CLEANING",
                  label: "Needs cleaning",
                  color: "bg-amber-500",
                },
              ].map(({ status, label, color }) => {
                const count =
                  data.roomSummary.find((room) => room.status === status)
                    ?.count ?? 0
                return (
                  <div key={status}>
                    <div className="mb-2 flex justify-between text-xs">
                      <span className="text-muted-foreground">{label}</span>
                      <span className="font-semibold">{count}</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className={`h-full rounded-full ${color}`}
                        style={{
                          width: `${totalRooms ? (count / totalRooms) * 100 : 0}%`,
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
            <Link
              href="/staff"
              className="mt-6 flex items-center justify-between border-t pt-4 text-xs font-semibold text-primary"
            >
              Update room status <ArrowRight size={14} />
            </Link>
          </section>
          <Link
            href="/admin/users"
            className="flex items-center gap-4 rounded-xl border bg-card p-5"
          >
            <span className="rounded-xl bg-primary/10 p-3 text-primary">
              <Users size={20} />
            </span>
            <div>
              <p className="text-sm font-semibold">People & access</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {users.filter((user) => user.isActive).length} active accounts
              </p>
            </div>
            <ArrowUpRight size={16} className="ml-auto text-muted-foreground" />
          </Link>
        </div>
      </div>
    </AdminShell>
  )
}
