import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-[#e7e5e0] bg-[#f4f3ee]">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-5 py-10 sm:px-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-heading text-lg font-bold text-[#163e2e]">
            Room<span className="text-[#ba6548]">ify</span>
          </p>
          <p className="mt-2 max-w-xs text-sm leading-6 text-[#64748b]">
            A more considered way to find your next stay.
          </p>
        </div>
        <nav
          className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-[#64748b]"
          aria-label="Footer navigation"
        >
          <Link href="#rooms">Rooms</Link>
          <Link href="#experience">Our experience</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/privacy">Privacy</Link>
        </nav>
      </div>
      <div className="mx-auto max-w-7xl border-t border-[#e7e5e0] px-5 py-5 text-xs text-[#94a3b8] sm:px-8">
        © 2026 Roomify. Crafted for restful stays.
      </div>
    </footer>
  )
}
