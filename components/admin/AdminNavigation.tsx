"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  BedDouble,
  UtensilsCrossed,
  ClipboardList,
  Building2,
} from "lucide-react"

const sections = [
  {
    label: "Workspace",
    items: [
      { href: "/admin", label: "Overview", icon: LayoutDashboard },
      { href: "/admin/bookings", label: "Reservations", icon: CalendarDays },
      { href: "/admin/users", label: "People & access", icon: Users },
    ],
  },
  {
    label: "Property",
    items: [
      { href: "/admin/rooms", label: "Rooms", icon: BedDouble },
      { href: "/admin/menu", label: "Service menu", icon: UtensilsCrossed },
    ],
  },
  {
    label: "Operations",
    items: [
      { href: "/staff", label: "Front desk", icon: Building2 },
      {
        href: "/staff/bookings",
        label: "Booking operations",
        icon: CalendarDays,
      },
      {
        href: "/staff/room-service",
        label: "Service orders",
        icon: ClipboardList,
      },
    ],
  },
]
export function AdminNavigation({ isAdmin = true }: { isAdmin?: boolean }) {
  const pathname = usePathname()
  const router = useRouter()
  const visibleSections = sections.filter(
    (section) => isAdmin || section.label === "Operations"
  )
  const current = visibleSections
    .flatMap((section) => section.items)
    .find(
      (item) =>
        pathname === item.href ||
        (item.href !== "/admin" &&
          item.href !== "/staff" &&
          pathname.startsWith(item.href + "/"))
    )
  return (
    <>
      <div className="px-5 py-3 lg:hidden">
        <label htmlFor="workspace-page" className="sr-only">
          Navigate workspace
        </label>
        <select
          id="workspace-page"
          value={current?.href ?? ""}
          onChange={(event) => router.push(event.target.value)}
          className="h-10 w-full rounded-lg border border-white/20 bg-[#214c42] px-3 text-sm font-medium text-white outline-offset-2 focus-visible:outline-2 focus-visible:outline-white"
        >
          {visibleSections.map((section) => (
            <optgroup key={section.label} label={section.label}>
              {section.items.map((item) => (
                <option key={item.href} value={item.href}>
                  {item.label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>
      <nav
        aria-label="Administration"
        className="hidden min-h-0 flex-1 [scrollbar-width:thin] space-y-5 overflow-y-auto overscroll-contain px-4 py-5 lg:block"
      >
        {sections
          .filter((section) => isAdmin || section.label === "Operations")
          .map((section) => (
            <div
              key={section.label}
              className="flex shrink-0 gap-1 lg:block lg:space-y-1"
            >
              <p className="mb-3 hidden px-3 text-[10px] font-semibold tracking-[0.18em] text-white/45 uppercase lg:block">
                {section.label}
              </p>
              {section.items.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  aria-current={
                    pathname === href ||
                    (href !== "/admin" &&
                      href !== "/staff" &&
                      pathname.startsWith(href + "/"))
                      ? "page"
                      : undefined
                  }
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${pathname === href || (href !== "/admin" && href !== "/staff" && pathname.startsWith(href + "/")) ? "bg-white/15 font-semibold text-white" : "text-white/65 hover:bg-white/10 hover:text-white"}`}
                >
                  <Icon size={17} aria-hidden="true" />
                  {label}
                </Link>
              ))}
            </div>
          ))}
      </nav>
    </>
  )
}
