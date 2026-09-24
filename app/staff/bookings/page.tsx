import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SelectField, SelectFieldOption } from "@/components/ui/select-field"
import Link from "next/link"
import { BookingsTable } from "@/components/staff/BookingsTable"
import { Search } from "lucide-react"
import { Footer } from "@/components/home/Footer"
import { Header } from "@/components/home/Header"
import { getStaffBookings } from "@/data/bookings"
import { requireRole } from "@/lib/auth/authorization"

type Params = Promise<Record<string, string | string[] | undefined>>

export default async function StaffBookingsPage({
  searchParams,
}: {
  searchParams: Params
}) {
  await requireRole(["STAFF", "ADMIN"], "/staff/bookings")
  const values = await searchParams
  const query = typeof values.query === "string" ? values.query : ""
  const allowed = [
    "PENDING",
    "CONFIRMED",
    "CHECKED_IN",
    "COMPLETED",
    "CANCELLED",
  ] as const
  const status =
    typeof values.status === "string" &&
    allowed.includes(values.status as (typeof allowed)[number])
      ? (values.status as (typeof allowed)[number])
      : undefined
  const bookings = await getStaffBookings({ query, status })
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main
        id="main-content"
        className="mx-auto min-h-[70vh] max-w-7xl px-5 py-10 sm:px-8"
      >
        <Link href="/staff" className="text-sm font-semibold text-primary">
          ← Dashboard
        </Link>
        <h1 className="mt-5 font-heading text-3xl font-bold text-foreground">
          Booking operations
        </h1>
        <form className="mt-6 flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 sm:flex-row">
          <Input
            aria-label="Search bookings"
            name="query"
            defaultValue={query}
            placeholder="Search room, booking ID, or guest ID"
            className="flex-1"
          />
          <SelectField
            aria-label="Booking status"
            name="status"
            defaultValue={status ?? ""}
            className="min-w-44"
          >
            <SelectFieldOption value="">All statuses</SelectFieldOption>
            {allowed.map((item) => (
              <SelectFieldOption key={item} value={item}>
                {item.replaceAll("_", " ")}
              </SelectFieldOption>
            ))}
          </SelectField>
          <Button type="submit" size="lg">
            <Search size={16} /> Filter
          </Button>
        </form>
        <BookingsTable key={`${query}:${status ?? ""}`} bookings={bookings} />
      </main>
      <Footer />
    </div>
  )
}
