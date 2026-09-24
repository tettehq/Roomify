import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-10 sm:px-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-heading text-lg font-bold text-foreground">
            Room<span className="text-muted-foreground">ify</span>
          </p>
          <p className="mt-2 max-w-xs text-sm leading-6 text-muted-foreground">
            A more considered way to find your next stay.
          </p>
        </div>
        <nav
          className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground"
          aria-label="Footer navigation"
        >
          <Link href="/rooms">Explore rooms</Link>
          <Link href="/#experience">Our experience</Link>
          <Link href="/bookings">My bookings</Link>
        </nav>
      </div>
      <div className="mx-auto max-w-7xl border-t border-border px-5 py-5 text-xs text-muted-foreground sm:px-8">
        © 2026 Roomify. Crafted for restful stays.
      </div>
    </footer>
  )
}
