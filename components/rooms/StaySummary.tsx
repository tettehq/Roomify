import { LinkButton } from "@/components/ui/link-button"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { AlertCircle, CalendarDays, Check, Users } from "lucide-react"
import type { RoomDetails } from "@/data/rooms"
import type { UserRole } from "@/db/schema"
import { loginUrl } from "@/lib/auth/return-to"
import { displayMoney, multiplyMoney } from "@/lib/money"
import { roomSearchQuery, type RoomStayContext } from "@/lib/room-search"

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00.000Z`))
}

export function StaySummary({
  room,
  context,
  available,
  viewerRole,
}: {
  room: RoomDetails
  context: RoomStayContext
  available: boolean | null
  viewerRole: UserRole | null
}) {
  const searchQuery = roomSearchQuery(context.input)
  const searchHref = `/rooms${searchQuery ? `?${searchQuery}` : ""}`
  const capacityExceeded =
    context.state === "valid" && context.data.guests > room.capacity
  const canReserve =
    context.state === "valid" && available === true && !capacityExceeded
  const reserveQuery =
    context.state === "valid"
      ? new URLSearchParams({
          roomId: room.id,
          checkIn: context.data.checkIn,
          checkOut: context.data.checkOut,
          guests: String(context.data.guests),
          ...(context.data.roomType ? { roomType: context.data.roomType } : {}),
        }).toString()
      : ""
  const reservationPath = `/bookings/new?${reserveQuery}`
  const reserveHref = viewerRole ? reservationPath : loginUrl(reservationPath)

  return (
    <aside
      id="stay-summary"
      aria-labelledby="stay-summary-heading"
      className="rounded-2xl border border-border bg-card p-6 shadow-sm lg:sticky lg:top-24"
    >
      <div className="flex items-baseline justify-between gap-4 border-b border-border pb-5">
        <h2
          id="stay-summary-heading"
          className="font-heading text-xl font-semibold text-foreground"
        >
          Stay summary
        </h2>
        <p className="shrink-0 text-sm text-muted-foreground">
          <span className="font-heading text-2xl font-bold text-foreground">
            ${displayMoney(room.baseRate)}
          </span>{" "}
          / night
        </p>
      </div>

      {context.state === "valid" ? (
        <>
          <dl className="mt-5 grid grid-cols-2 gap-x-5 gap-y-5 text-sm">
            <SummaryItem
              icon={<CalendarDays size={17} />}
              label="Check-in"
              value={formatDate(context.data.checkIn)}
            />
            <SummaryItem
              icon={<CalendarDays size={17} />}
              label="Check-out"
              value={formatDate(context.data.checkOut)}
            />
            <SummaryItem
              icon={<Users size={17} />}
              label="Guests"
              value={`${context.data.guests}`}
            />
            <SummaryItem
              icon={<Check size={17} />}
              label="Length"
              value={`${context.data.nights} ${context.data.nights === 1 ? "night" : "nights"}`}
            />
          </dl>
          <div className="mt-6 space-y-3 border-t border-border pt-5 text-sm">
            <div className="flex justify-between gap-4 text-muted-foreground">
              <span>
                ${displayMoney(room.baseRate)} × {context.data.nights}{" "}
                {context.data.nights === 1 ? "night" : "nights"}
              </span>
              <span className="font-medium text-foreground">
                ${multiplyMoney(room.baseRate, context.data.nights)}
              </span>
            </div>
            <div className="flex justify-between gap-4 border-t border-border pt-3 font-semibold text-foreground">
              <span>Estimated room subtotal</span>
              <span>${multiplyMoney(room.baseRate, context.data.nights)}</span>
            </div>
          </div>
        </>
      ) : (
        <div className="mt-5 rounded-xl bg-muted p-4">
          <p className="text-sm font-semibold text-foreground">
            Select your stay before reserving
          </p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            Choose valid check-in and check-out dates and at least one guest.
          </p>
        </div>
      )}

      {context.state === "invalid" && (
        <div
          role="alert"
          className="mt-4 rounded-xl border border-destructive/25 bg-destructive/5 p-4"
        >
          <p className="flex items-center gap-2 text-sm font-semibold text-destructive">
            <AlertCircle size={17} /> Check your stay details
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-destructive">
            {context.errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      )}
      {capacityExceeded && (
        <StatusMessage>
          This room accommodates up to {room.capacity}{" "}
          {room.capacity === 1 ? "guest" : "guests"}.
        </StatusMessage>
      )}
      {context.state === "valid" &&
        !capacityExceeded &&
        available === false && (
          <StatusMessage>
            This room is no longer available for the selected dates.
          </StatusMessage>
        )}
      {context.state === "valid" && available === null && (
        <StatusMessage>
          We couldn&apos;t confirm availability right now. Please try again.
        </StatusMessage>
      )}
      {canReserve && viewerRole && viewerRole !== "GUEST" && (
        <StatusMessage>
          Reservations can only be started from a guest account.
        </StatusMessage>
      )}

      {canReserve && (!viewerRole || viewerRole === "GUEST") ? (
        <LinkButton
          href={reserveHref}
          variant="default"
          className="mt-6 min-h-12 w-full"
        >
          Reserve room
        </LinkButton>
      ) : (
        <Button type="button" disabled className="mt-6 w-full">
          Reserve room
        </Button>
      )}
      <p className="mt-3 text-center text-xs leading-5 text-muted-foreground">
        No charge is made at this step. Taxes and fees are not yet included.
      </p>
      <Link
        href={searchHref}
        className="mt-4 block text-center text-sm font-semibold text-primary hover:text-primary focus-visible:rounded focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:outline-none"
      >
        Back to available rooms
      </Link>
    </aside>
  )
}

function SummaryItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div>
      <dt className="flex items-center gap-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        <span aria-hidden="true">{icon}</span> {label}
      </dt>
      <dd className="mt-1.5 font-medium text-foreground">{value}</dd>
    </div>
  )
}

function StatusMessage({ children }: { children: React.ReactNode }) {
  return (
    <p
      role="alert"
      className="mt-4 rounded-xl border border-destructive/25 bg-destructive/5 p-4 text-sm leading-6 text-destructive"
    >
      {children}
    </p>
  )
}
