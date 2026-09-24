"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { useTheme } from "next-themes"
import {
  BedDouble,
  CalendarDays,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Settings2,
  Sun,
  UtensilsCrossed,
} from "lucide-react"
import { logoutAction } from "@/app/actions/auth"
import type { SafeUser } from "@/data/users"
import { Button, buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

type HeaderUser = Pick<SafeUser, "name" | "role">
export function HeaderClient({ user }: { user: HeaderUser | null }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()
  const links = [
    { href: "/rooms", label: "Explore rooms", icon: BedDouble },
    ...(user?.role === "GUEST"
      ? [{ href: "/bookings", label: "My bookings", icon: CalendarDays }]
      : []),
    ...(user && user.role !== "GUEST"
      ? [
          { href: "/staff", label: "Overview", icon: LayoutDashboard },
          { href: "/staff/bookings", label: "Bookings", icon: CalendarDays },
          {
            href: "/staff/room-service",
            label: "Room service",
            icon: UtensilsCrossed,
          },
        ]
      : []),
    ...(user?.role === "ADMIN"
      ? [{ href: "/admin", label: "Administration", icon: Settings2 }]
      : []),
  ]
  const nav = (mobile = false) => (
    <nav
      aria-label={mobile ? "Mobile navigation" : "Main navigation"}
      className={mobile ? "grid gap-2" : "hidden items-center gap-1 xl:flex"}
    >
      {links.map(({ href, label, icon: Icon }) => {
        const active =
          pathname === href ||
          (href !== "/staff" &&
            href !== "/admin" &&
            pathname.startsWith(href + "/")) ||
          (href === "/admin" && pathname.startsWith("/admin"))
        return (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            aria-current={active ? "page" : undefined}
            className={cn(
              buttonVariants({
                variant: active ? "secondary" : "ghost",
                size: "sm",
              }),
              mobile && "h-11 justify-start"
            )}
          >
            <Icon className="size-4" />
            {label}
          </Link>
        )
      })}
    </nav>
  )
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-background focus:p-3"
      >
        Skip to content
      </a>
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
        <Link
          href="/"
          aria-label="Roomify home"
          className="flex shrink-0 items-center gap-2.5"
        >
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <BedDouble className="size-5" />
          </span>
          <span className="font-heading text-xl font-bold tracking-tight">
            Roomify<span className="text-primary">.</span>
          </span>
        </Link>
        {nav()}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Toggle color theme"
            onClick={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
          >
            <Sun className="size-4 dark:hidden" />
            <Moon className="hidden size-4 dark:block" />
          </Button>
          {user ? (
            <>
              <div className="hidden border-l pl-3 text-right text-sm lg:block">
                <p className="max-w-32 truncate font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground capitalize">
                  {user.role.toLowerCase()}
                </p>
              </div>
              <form action={logoutAction} className="hidden xl:block">
                <Button
                  type="submit"
                  variant="ghost"
                  size="icon"
                  aria-label="Sign out"
                >
                  <LogOut />
                </Button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "hidden sm:inline-flex"
              )}
            >
              Sign in
            </Link>
          )}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              render={
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="xl:hidden"
                  aria-label="Open navigation"
                />
              }
            >
              <Menu />
            </SheetTrigger>
            <SheetContent className="w-[min(90vw,360px)]!">
              <SheetHeader className="border-b p-6">
                <SheetTitle>Roomify</SheetTitle>
                <SheetDescription>
                  {user
                    ? "Your hotel workspace"
                    : "Make room for a better stay."}
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-6 px-4">
                {nav(true)}
                {user ? (
                  <div className="space-y-4 border-t pt-4">
                    <div className="flex items-center justify-between gap-2 px-2">
                      <span className="truncate font-medium">{user.name}</span>
                      <Badge variant="secondary">
                        {user.role.toLowerCase()}
                      </Badge>
                    </div>
                    <form action={logoutAction}>
                      <Button
                        type="submit"
                        variant="outline"
                        className="w-full"
                      >
                        <LogOut /> Sign out
                      </Button>
                    </form>
                  </div>
                ) : (
                  <div className="grid gap-2">
                    <Link
                      onClick={() => setOpen(false)}
                      href="/login"
                      className={buttonVariants({ variant: "outline" })}
                    >
                      Sign in
                    </Link>
                    <Link
                      onClick={() => setOpen(false)}
                      href="/register"
                      className={buttonVariants()}
                    >
                      Create account
                    </Link>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
