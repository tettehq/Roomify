import { LinkButton } from "@/components/ui/link-button"
import { StatusBadge } from "@/components/ui/status-badge"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { ChevronRight, ClipboardList } from "lucide-react"
import { Footer } from "@/components/home/Footer"
import { Header } from "@/components/home/Header"
import { getGuestBookings } from "@/data/bookings"
import { requireRole } from "@/lib/auth/authorization"
import { displayMoney } from "@/lib/money"
import { ROOM_TYPE_LABELS } from "@/lib/room-types"

function date(value: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(value)
}

function group(booking: Awaited<ReturnType<typeof getGuestBookings>>[number]) {
  if (booking.status === "CANCELLED") return "Cancelled"
  if (booking.status === "COMPLETED") return "Completed"
  const now = Date.now()
  if (booking.checkIn.getTime() <= now && booking.checkOut.getTime() > now)
    return "Current"
  return "Upcoming"
}

export default async function MyBookingsPage() {
  const user = await requireRole(["GUEST"], "/bookings")
  let bookings: Awaited<ReturnType<typeof getGuestBookings>>
  try {
    bookings = await getGuestBookings(user.id)
  } catch {
    console.error("Guest bookings query failed.")
    bookings = []
  }
  const groups = ["Upcoming", "Current", "Completed", "Cancelled"] as const

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main
        id="main-content"
        className="mx-auto min-h-[70vh] max-w-6xl px-5 py-10 sm:px-8 lg:py-14"
      >
        <p className="text-xs font-bold tracking-[0.18em] text-muted-foreground uppercase">
          Your stays
        </p>
        <h1 className="mt-2 font-heading text-3xl font-bold tracking-[-0.04em] text-foreground sm:text-4xl">
          My bookings
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
          View your reservations, room details, and stay status in one place.
        </p>
        {!bookings.length ? (
          <Card className="mt-9 gap-0 p-10 py-0 text-center">
            <ClipboardList
              className="mx-auto text-muted-foreground"
              size={34}
            />
            <h2 className="mt-4 font-heading text-xl font-semibold text-foreground">
              No bookings yet
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Your confirmed stays will appear here.
            </p>
            <LinkButton href="/rooms" variant="default" className="mt-5">
              Browse rooms
            </LinkButton>
          </Card>
        ) : (
          groups.map((name) => {
            const entries = bookings.filter(
              (booking) => group(booking) === name
            )
            return entries.length ? (
              <section
                key={name}
                className="mt-9"
                aria-labelledby={`${name.toLowerCase()}-heading`}
              >
                <h2
                  id={`${name.toLowerCase()}-heading`}
                  className="font-heading text-2xl font-semibold text-foreground"
                >
                  {name}
                </h2>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  {entries.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} />
                  ))}
                </div>
              </section>
            ) : null
          })
        )}
      </main>
      <Footer />
    </div>
  )
}

function BookingCard({
  booking,
}: {
  booking: Awaited<ReturnType<typeof getGuestBookings>>[number]
}) {
  return (
    <Card
      role="article"
      className="gap-0 rounded-2xl border border-border bg-card p-5 shadow-sm ring-0"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold tracking-[0.15em] text-muted-foreground uppercase">
            Room {booking.roomNumber}
          </p>
          <h3 className="mt-1 font-heading text-xl font-semibold text-foreground">
            {ROOM_TYPE_LABELS[booking.roomType]}
          </h3>
        </div>
        <StatusBadge status={booking.status} />
      </div>
      <div className="mt-5 grid grid-cols-2 gap-4 border-y border-border py-4 text-sm">
        <div>
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Stay
          </p>
          <p className="mt-1 font-medium text-foreground">
            {date(booking.checkIn)} – {date(booking.checkOut)}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Total
          </p>
          <p className="mt-1 font-medium text-foreground">
            ${displayMoney(booking.totalAmount)}
          </p>
        </div>
      </div>
      <p className="mt-4 text-xs break-all text-muted-foreground">
        Reference: {booking.id}
      </p>
      <Link
        href={`/bookings/${booking.id}`}
        className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary"
      >
        View booking <ChevronRight size={16} />
      </Link>
    </Card>
  )
}
