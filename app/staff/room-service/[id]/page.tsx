import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ReceiptText } from "lucide-react"
import { AdminShell } from "@/components/admin/AdminShell"
import { StatusBadge } from "@/components/ui/status-badge"
import { OrderStatusForm } from "@/components/room-service/StatusForm"
import { getOrderById } from "@/data/room-service"
import { requireRole } from "@/lib/auth/authorization"
import { displayMoney, multiplyMoney } from "@/lib/money"
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
    <AdminShell
      title={`Order ${id.slice(0, 8)}`}
      description={`Room ${order.roomNumber} · ${order.guestName}`}
      action={<StatusBadge status={order.status} />}
    >
      <Link
        href="/staff/room-service"
        className="inline-flex items-center gap-2 text-sm font-medium text-primary"
      >
        <ArrowLeft size={16} />
        Back to service orders
      </Link>
      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <section className="overflow-hidden rounded-xl border bg-card">
          <div className="flex items-center gap-3 border-b px-6 py-5">
            <ReceiptText size={19} className="text-primary" />
            <h2 className="font-heading text-lg font-semibold">Order items</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Unit price</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id} className="border-t">
                    <td className="font-medium">{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>${displayMoney(item.unitPrice)}</td>
                    <td className="font-semibold tabular-nums">
                      ${multiplyMoney(item.unitPrice, item.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between border-t bg-muted/30 px-6 py-5 font-semibold">
            <span>Order total</span>
            <span>${displayMoney(order.totalAmount)}</span>
          </div>
        </section>
        <aside className="space-y-6">
          <section className="rounded-xl border bg-card p-6">
            <h2 className="font-semibold">Delivery details</h2>
            <p className="mt-5 text-2xl font-semibold">
              Room {order.roomNumber}
            </p>
            <p className="mt-3 text-sm">{order.guestName}</p>
            <p className="mt-1 text-xs break-all text-muted-foreground">
              {order.guestEmail}
            </p>
          </section>
          <section className="rounded-xl border bg-card p-6">
            <h2 className="font-semibold">Order progress</h2>
            <p className="my-4 text-xs leading-5 text-muted-foreground">
              Start preparation when the team is ready. Mark the order complete
              after delivery.
            </p>
            <OrderStatusForm orderId={id} status={order.status} />
            {["COMPLETED", "CANCELLED"].includes(order.status) && (
              <p className="text-sm text-muted-foreground">
                This order is closed.
              </p>
            )}
          </section>
        </aside>
      </div>
    </AdminShell>
  )
}
