import { Card } from "@/components/ui/card"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Footer } from "@/components/home/Footer"
import { Header } from "@/components/home/Header"
import { getOrderById } from "@/data/room-service"
import { requireRole } from "@/lib/auth/authorization"
import { displayMoney } from "@/lib/money"
import { isUuid } from "@/lib/uuid"

export default async function StaffOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  await requireRole(["STAFF", "ADMIN"], `/staff/room-service/${id}`)
  if (!isUuid(id)) notFound()
  const order = await getOrderById(id)
  if (!order) notFound()
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main
        id="main-content"
        className="mx-auto min-h-[70vh] max-w-3xl px-5 py-10 sm:px-8"
      >
        <Link
          href="/staff/room-service"
          className="text-sm font-semibold text-primary"
        >
          ← Room-service queue
        </Link>
        <Card className="mt-6 gap-0 p-6 py-0 sm:p-8">
          <p className="text-xs font-bold tracking-wide text-muted-foreground uppercase">
            Room {order.roomNumber} · {order.guestName}
          </p>
          <h1 className="mt-2 font-heading text-3xl font-bold text-foreground">
            Order details
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {order.guestEmail} · {order.status.replaceAll("_", " ")}
          </p>
          <ul className="mt-6 space-y-3 border-y border-border py-5">
            {order.items.map((item) => (
              <li key={item.id} className="flex justify-between gap-4 text-sm">
                <span className="text-foreground">
                  {item.quantity} × {item.name}
                </span>
                <span className="font-medium text-foreground">
                  ${displayMoney(item.unitPrice)}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-5 flex justify-between font-semibold text-foreground">
            <span>Total</span>
            <span>${displayMoney(order.totalAmount)}</span>
          </p>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
