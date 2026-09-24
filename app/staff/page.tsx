import { Card } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight, BedDouble, LogIn, LogOut, Utensils } from "lucide-react"
import { Footer } from "@/components/home/Footer"
import { Header } from "@/components/home/Header"
import { RoomStatusForm } from "@/components/staff/StatusForm"
import { getRoomStatusRows, getStaffDashboardData } from "@/data/operations"
import { requireRole } from "@/lib/auth/authorization"

const date = (value: Date) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(value)

export default async function StaffDashboardPage() {
  await requireRole(["STAFF", "ADMIN"], "/staff")
  let data
  let roomRows
  try {
    ;[data, roomRows] = await Promise.all([
      getStaffDashboardData(),
      getRoomStatusRows(),
    ])
  } catch {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main id="main-content" className="mx-auto max-w-5xl px-5 py-16">
          <h1 className="font-heading text-3xl font-bold text-foreground">
            Staff dashboard unavailable
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Please try again shortly.
          </p>
        </main>
        <Footer />
      </div>
    )
  }
  const statusCount = Object.fromEntries(
    data.roomSummary.map((item) => [item.status, item.count])
  )
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main
        id="main-content"
        className="mx-auto min-h-[70vh] max-w-7xl px-5 py-10 sm:px-8 lg:py-14"
      >
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold tracking-[0.18em] text-muted-foreground uppercase">
              Operations
            </p>
            <h1 className="mt-2 font-heading text-3xl font-bold text-foreground sm:text-4xl">
              Staff dashboard
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Today&apos;s arrivals, departures, stays, and room readiness.
            </p>
          </div>
          <Link
            href="/staff/bookings"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary"
          >
            Manage bookings <ArrowRight size={16} />
          </Link>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Metric
            icon={<LogIn size={18} />}
            label="Arrivals today"
            value={data.arrivals.length}
          />
          <Metric
            icon={<LogOut size={18} />}
            label="Departures today"
            value={data.departures.length}
          />
          <Metric
            icon={<BedDouble size={18} />}
            label="Current guests"
            value={data.currentStays.length}
          />
          <Metric
            icon={<Utensils size={18} />}
            label="Pending orders"
            value={data.pendingOrders}
          />
        </div>
        <div className="mt-8 grid gap-7 lg:grid-cols-2">
          <OperationsList
            title="Today's arrivals"
            entries={data.arrivals.map(
              (item) => `${item.guestName} · Room ${item.roomNumber}`
            )}
            empty="No arrivals scheduled today."
          />
          <OperationsList
            title="Today's departures"
            entries={data.departures.map(
              (item) => `${item.guestName} · Room ${item.roomNumber}`
            )}
            empty="No departures scheduled today."
          />
          <Card className="gap-0 p-6 py-0">
            <h2 className="font-heading text-xl font-semibold text-foreground">
              Room status
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Available {statusCount.AVAILABLE ?? 0} · Occupied{" "}
              {statusCount.OCCUPIED ?? 0} · Needs cleaning{" "}
              {statusCount.NEEDS_CLEANING ?? 0}
            </p>
            <div className="mt-5 space-y-3">
              {roomRows.map((room) => (
                <div
                  key={room.id}
                  className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3"
                >
                  <span className="text-sm font-medium text-foreground">
                    Room {room.roomNumber}
                  </span>
                  <RoomStatusForm roomId={room.id} status={room.status} />
                </div>
              ))}
            </div>
          </Card>
          <Card className="gap-0 p-6 py-0">
            <div className="flex items-center justify-between gap-3">
              <h2 className="font-heading text-xl font-semibold text-foreground">
                Active bookings
              </h2>
              <Link
                href="/staff/bookings"
                className="text-sm font-semibold text-primary"
              >
                View all
              </Link>
            </div>
            <div className="mt-4 space-y-3">
              {data.activeBookings.slice(0, 8).map((booking) => (
                <Link
                  key={booking.id}
                  href={`/staff/bookings/${booking.id}`}
                  className="block rounded-xl bg-muted p-3 text-sm hover:bg-accent"
                >
                  <span className="font-semibold text-foreground">
                    Room {booking.roomNumber}
                  </span>{" "}
                  · {booking.guestName}
                  <span className="block text-xs text-muted-foreground">
                    {date(booking.checkIn)} – {date(booking.checkOut)} ·{" "}
                    {booking.status}
                  </span>
                </Link>
              ))}
              {!data.activeBookings.length ? (
                <p className="text-sm text-muted-foreground">
                  No active bookings.
                </p>
              ) : null}
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
}

function Metric({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: number | string
}) {
  return (
    <Card className="gap-0 p-5 py-0">
      <span className="text-muted-foreground">{icon}</span>
      <p className="mt-4 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        {label}
      </p>
      <p className="mt-1 font-heading text-3xl font-bold text-foreground">
        {value}
      </p>
    </Card>
  )
}
function OperationsList({
  title,
  entries,
  empty,
}: {
  title: string
  entries: string[]
  empty: string
}) {
  return (
    <Card className="gap-0 p-6 py-0">
      <h2 className="font-heading text-xl font-semibold text-foreground">
        {title}
      </h2>
      {entries.length ? (
        <ul className="mt-4 space-y-3">
          {entries.map((entry) => (
            <li
              key={entry}
              className="rounded-xl bg-muted p-3 text-sm text-foreground"
            >
              {entry}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">{empty}</p>
      )}
    </Card>
  )
}
