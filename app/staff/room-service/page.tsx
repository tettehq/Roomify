import Link from "next/link"
import { Footer } from "@/components/home/Footer"
import { Header } from "@/components/home/Header"
import { OrderQueue } from "@/components/room-service/OrderQueue"
import { getStaffOrders } from "@/data/room-service"
import { requireRole } from "@/lib/auth/authorization"

export default async function StaffRoomServicePage() {
  await requireRole(["STAFF", "ADMIN"], "/staff/room-service")
  const orders = await getStaffOrders()
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main
        id="main-content"
        className="mx-auto min-h-[70vh] max-w-6xl px-5 py-10 sm:px-8"
      >
        <Link href="/staff" className="text-sm font-semibold text-primary">
          ← Dashboard
        </Link>
        <h1 className="mt-5 font-heading text-3xl font-bold text-foreground">
          Room-service queue
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Process pending and in-progress guest orders in sequence.
        </p>
        <OrderQueue
          initialOrders={orders.map((order) => ({
            ...order,
            createdAt: order.createdAt.toISOString(),
          }))}
        />
      </main>
      <Footer />
    </div>
  )
}
