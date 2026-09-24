import { Card } from "@/components/ui/card"
import { LinkButton } from "@/components/ui/link-button"
import Link from "next/link"
import { ArrowLeft, Utensils } from "lucide-react"
import { OrderForm } from "@/components/room-service/OrderForm"
import { Footer } from "@/components/home/Footer"
import { Header } from "@/components/home/Header"
import {
  getGuestCurrentBooking,
  getGuestOrders,
  getAvailableMenuItems,
} from "@/data/room-service"
import { requireRole } from "@/lib/auth/authorization"
import { displayMoney } from "@/lib/money"
import { isUuid } from "@/lib/uuid"

export default async function GuestRoomServicePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user = await requireRole(["GUEST"], `/bookings/${id}/room-service`)
  if (!isUuid(id)) return <InvalidStay />
  const [booking, menu, orders] = await Promise.all([
    getGuestCurrentBooking(id, user.id),
    getAvailableMenuItems(),
    getGuestOrders(user.id, id),
  ])
  if (!booking) return <InvalidStay />
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main
        id="main-content"
        className="mx-auto min-h-[70vh] max-w-5xl px-5 py-10 sm:px-8"
      >
        <Link
          href={`/bookings/${id}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary"
        >
          <ArrowLeft size={16} /> Back to booking
        </Link>
        <div className="mt-6">
          <p className="text-xs font-bold tracking-[0.16em] text-muted-foreground uppercase">
            Room {booking.roomNumber}
          </p>
          <h1 className="mt-2 font-heading text-3xl font-bold text-foreground">
            Room service
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Choose from the current menu. Prices and the total are checked on
            the server when you place the order.
          </p>
        </div>
        {menu.length ? (
          <OrderForm
            bookingId={id}
            items={menu.map((item) => ({
              ...item,
              price: displayMoney(item.price),
            }))}
          />
        ) : (
          <Card className="mt-8 gap-0 p-8 py-0 text-center">
            <Utensils className="mx-auto text-muted-foreground" size={32} />
            <p className="mt-3 text-sm text-muted-foreground">
              The menu is currently unavailable.
            </p>
          </Card>
        )}
        <section className="mt-10">
          <h2 className="font-heading text-2xl font-semibold text-foreground">
            Your orders
          </h2>
          {orders.length ? (
            <div className="mt-4 grid gap-3">
              {orders.map((order) => (
                <Link
                  key={order.id}
                  href={`/bookings/${id}/room-service?order=${order.id}`}
                  className="rounded-xl border border-border bg-card p-4"
                >
                  <div className="flex justify-between gap-4 text-sm">
                    <span className="font-semibold text-foreground">
                      Order {order.id.slice(0, 8)}
                    </span>
                    <span className="font-bold text-accent-foreground">
                      {order.status.replaceAll("_", " ")}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    ${displayMoney(order.totalAmount)}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">
              No room-service orders for this stay yet.
            </p>
          )}
        </section>
      </main>
      <Footer />
    </div>
  )
}

function InvalidStay() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main
        id="main-content"
        className="mx-auto flex min-h-[70vh] max-w-2xl items-center px-5 py-16"
      >
        <Card className="w-full gap-0 p-8 py-0 text-center">
          <h1 className="font-heading text-2xl font-bold text-foreground">
            Room service is unavailable
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Room service is available only for your current checked-in stay.
          </p>
          <LinkButton href="/bookings" variant="default" className="mt-5">
            Back to bookings
          </LinkButton>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
