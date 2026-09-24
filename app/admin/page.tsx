import Link from "next/link"
import { Footer } from "@/components/home/Footer"
import { Header } from "@/components/home/Header"
import { requireRole } from "@/lib/auth/authorization"
export default async function AdminPage() {
  await requireRole(["ADMIN"], "/admin")
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main
        id="main-content"
        className="mx-auto min-h-[70vh] max-w-5xl px-5 py-10 sm:px-8"
      >
        <p className="text-xs font-bold tracking-[0.18em] text-muted-foreground uppercase">
          Administration
        </p>
        <h1 className="mt-2 font-heading text-3xl font-bold text-foreground">
          Roomify admin
        </h1>
        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <Link
            href="/admin/rooms"
            className="rounded-2xl border border-border bg-card p-6 shadow-sm hover:bg-muted"
          >
            <h2 className="font-heading text-xl font-semibold text-foreground">
              Room management
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Manage rooms, rates, capacities, types, statuses, and images.
            </p>
          </Link>
          <Link
            href="/admin/menu"
            className="rounded-2xl border border-border bg-card p-6 shadow-sm hover:bg-muted"
          >
            <h2 className="font-heading text-xl font-semibold text-foreground">
              Menu management
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Manage room-service menu items, prices, categories, and
              availability.
            </p>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}
