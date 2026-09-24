"use client"

import Link from "next/link"
import { useQuery } from "@tanstack/react-query"
import type { getStaffOrders } from "@/data/room-service"
import { OrderStatusForm } from "@/components/room-service/StatusForm"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/ui/status-badge"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { displayMoney } from "@/lib/money"

type Order = Awaited<ReturnType<typeof getStaffOrders>>[number]
export type QueueOrder = Omit<Order, "createdAt"> & { createdAt: string }

export function OrderQueue({ initialOrders }: { initialOrders: QueueOrder[] }) {
  const orders = useQuery({
    queryKey: ["staff", "room-service"],
    queryFn: async ({ signal }): Promise<QueueOrder[]> => {
      const response = await fetch("/api/staff/room-service", {
        signal,
        cache: "no-store",
      })
      if (!response.ok)
        throw new Error(
          response.status === 401
            ? "Your session expired. Please sign in again."
            : response.status === 403
              ? "Staff access is required."
              : "Orders could not be refreshed. Please try again."
        )
      return response.json()
    },
    initialData: initialOrders,
    refetchInterval: 15_000,
  })

  return (
    <div className="mt-7 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground" role="status">
          {orders.isFetching
            ? "Refreshing orders…"
            : "Updates automatically every 15 seconds."}
        </p>
        <Button
          type="button"
          variant="outline"
          disabled={orders.isFetching}
          onClick={() => void orders.refetch()}
        >
          Refresh
        </Button>
      </div>
      {orders.error && (
        <Alert variant="destructive">
          <AlertDescription>{orders.error.message}</AlertDescription>
        </Alert>
      )}
      {orders.data.map((order) => (
        <Card key={order.id}>
          <CardContent>
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <p className="text-xs font-bold tracking-wide text-muted-foreground uppercase">
                  Room {order.roomNumber} · {order.guestName}
                </p>
                <h2 className="mt-1 font-heading text-xl font-semibold text-foreground">
                  Order {order.id.slice(0, 8)}
                </h2>
                <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                  <span>${displayMoney(order.totalAmount)}</span>
                  <StatusBadge status={order.status} />
                </div>
              </div>
              <OrderStatusForm orderId={order.id} status={order.status} />
            </div>
            <Link
              href={`/staff/room-service/${order.id}`}
              className="mt-4 inline-block text-sm font-semibold text-primary"
            >
              View order details →
            </Link>
          </CardContent>
        </Card>
      ))}
      {!orders.data.length && (
        <Card>
          <CardContent className="py-6 text-center text-sm text-muted-foreground">
            No pending room-service orders.
          </CardContent>
        </Card>
      )}
    </div>
  )
}
