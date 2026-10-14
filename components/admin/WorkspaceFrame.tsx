import Link from "next/link"
import { ArrowUpRight, Hotel, LogOut } from "lucide-react"
import type { SafeUser } from "@/data/users"
import { logoutAction } from "@/app/actions/auth"
import { AdminNavigation } from "@/components/admin/AdminNavigation"
import "@/app/admin/admin.css"

export function WorkspaceFrame({
  children,
  user,
}: {
  children: React.ReactNode
  user: SafeUser
}) {
  return (
    <div className="admin-workspace min-h-dvh bg-background">
      <aside className="workspace-sidebar sticky top-0 z-40 flex flex-col bg-[#173d35] text-white lg:fixed lg:inset-y-0 lg:left-0 lg:w-[232px]">
        <Link
          href={user.role === "ADMIN" ? "/admin" : "/staff"}
          className="flex shrink-0 items-center gap-3 border-b border-white/10 px-5 py-3 lg:px-6 lg:py-5"
        >
          <span className="flex size-10 items-center justify-center rounded-xl bg-white/10">
            <Hotel size={23} />
          </span>
          <span className="font-heading text-xl font-semibold tracking-tight">
            Roomify
            <span className="mt-0.5 block text-[10px] font-medium tracking-[0.2em] text-white/50 uppercase">
              {user.role === "ADMIN" ? "Administration" : "Operations"}
            </span>
          </span>
        </Link>
        <AdminNavigation isAdmin={user.role === "ADMIN"} />
        <div className="mt-auto hidden shrink-0 border-t border-white/10 p-5 lg:block">
          <p className="text-xs text-white/50">Property workspace</p>
          <p className="mt-1 text-sm font-medium">
            Everything for a better stay.
          </p>
          <Link
            href="/"
            className="mt-4 flex items-center justify-between text-xs text-white/70 hover:text-white"
          >
            Open guest website
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </aside>
      <div className="min-w-0 lg:ml-[232px]">
        <header className="relative z-30 flex h-16 items-center justify-between gap-4 border-b bg-card/95 px-5 backdrop-blur-sm sm:px-8 lg:sticky lg:top-0 lg:px-10">
          <div className="text-sm text-muted-foreground">
            Property management<span className="mx-3 text-border">/</span>
            <span className="font-medium text-foreground">
              {user.role === "ADMIN" ? "Admin workspace" : "Staff workspace"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden size-9 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary sm:flex">
              {user.name
                .split(" ")
                .map((part) => part[0])
                .slice(0, 2)
                .join("")}
            </span>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold">{user.name}</p>
              <p className="text-xs text-muted-foreground">
                {user.role === "ADMIN" ? "Administrator" : "Staff"}
              </p>
            </div>
            <form action={logoutAction}>
              <button
                title="Sign out"
                aria-label="Sign out"
                className="rounded-lg p-2 text-muted-foreground hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
              >
                <LogOut size={18} />
              </button>
            </form>
          </div>
        </header>
        {children}
      </div>
    </div>
  )
}
