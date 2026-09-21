"use client"

import Link from "next/link"
import { LogOut, Menu, X } from "lucide-react"
import { useState } from "react"
import { logoutAction } from "@/app/actions/auth"
import type { SafeUser } from "@/data/users"

type HeaderUser = Pick<SafeUser, "name" | "role">

function Brand() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2"
      aria-label="Roomify home"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-[11px] bg-[#1b4332] text-xl font-bold text-white shadow-sm">
        R
      </span>
      <span className="font-heading text-[25px] font-bold tracking-[-0.06em] text-[#163e2e]">
        Room<span className="text-[#ba6548]">ify</span>
      </span>
    </Link>
  )
}

export function HeaderClient({ user }: { user: HeaderUser | null }) {
  const [open, setOpen] = useState(false)
  return (
    <header className="relative z-20 border-b border-[#e7e5e0] bg-[#faf9f6]/95 backdrop-blur">
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 sm:px-8">
        <Brand />
        <nav
          className="hidden items-center gap-8 text-sm font-medium text-[#475569] lg:flex"
          aria-label="Main navigation"
        >
          <Link className="text-[#1b4332]" href="/#stay">
            Find a stay
          </Link>
          <Link
            className="transition-colors hover:text-[#1b4332]"
            href="/#rooms"
          >
            Rooms
          </Link>
          <Link
            className="transition-colors hover:text-[#1b4332]"
            href="/#experience"
          >
            The Roomify experience
          </Link>
        </nav>
        <div className="hidden items-center gap-4 lg:flex">
          {user ? (
            <AuthenticatedNavigation user={user} />
          ) : (
            <PublicNavigation />
          )}
        </div>
        <button
          className="rounded-lg p-2 text-[#1b4332] focus-visible:ring-2 focus-visible:ring-[#1b4332]/30 focus-visible:outline-none lg:hidden"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X size={23} /> : <Menu size={23} />}
        </button>
      </div>
      {open && (
        <nav
          className="border-t border-[#e7e5e0] px-5 py-4 lg:hidden"
          aria-label="Mobile navigation"
        >
          <div className="flex flex-col gap-4 text-sm font-medium text-[#475569]">
            <Link href="/#stay" onClick={() => setOpen(false)}>
              Find a stay
            </Link>
            <Link href="/#rooms" onClick={() => setOpen(false)}>
              Rooms
            </Link>
            <Link href="/#experience" onClick={() => setOpen(false)}>
              The Roomify experience
            </Link>
            <div className="flex flex-col gap-3 border-t border-[#e7e5e0] pt-4">
              {user ? (
                <AuthenticatedNavigation user={user} />
              ) : (
                <PublicNavigation />
              )}
            </div>
          </div>
        </nav>
      )}
    </header>
  )
}

function PublicNavigation() {
  return (
    <>
      <Link
        className="text-sm font-medium text-[#475569] hover:text-[#1b4332]"
        href="/login"
      >
        Sign in
      </Link>
      <Link
        className="rounded-lg bg-[#1b4332] px-5 py-3 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-[#2d6a4f] focus-visible:ring-4 focus-visible:ring-[#1b4332]/20 focus-visible:outline-none"
        href="/register"
      >
        Create account
      </Link>
    </>
  )
}

function AuthenticatedNavigation({ user }: { user: HeaderUser }) {
  return (
    <>
      <div className="leading-tight">
        <p className="text-sm font-semibold text-[#163e2e]">{user.name}</p>
        <p className="mt-0.5 text-[11px] font-semibold tracking-wide text-[#94a3b8] uppercase">
          {user.role.toLowerCase()}
        </p>
      </div>
      {user.role === "GUEST" ? (
        <span
          className="text-sm text-[#64748b]"
          aria-label="My bookings coming soon"
        >
          My bookings
        </span>
      ) : null}
      <form action={logoutAction}>
        <button
          type="submit"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#2d6a4f] hover:text-[#1b4332] focus-visible:rounded focus-visible:ring-2 focus-visible:ring-[#1b4332]/30 focus-visible:outline-none"
        >
          <LogOut size={15} /> Logout
        </button>
      </form>
    </>
  )
}
