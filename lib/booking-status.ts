import "server-only"
import { eq } from "drizzle-orm"
import { bookings, bookingStatusEnum } from "@/db/schema"
import type { Tx } from "@/db"
import { recordAudit, type Actor } from "@/data/audit"

type BookingStatus = typeof bookingStatusEnum.enumValues[number]

const allowed: Record<BookingStatus, BookingStatus[]> = {
    PENDING: ["CONFIRMED", "CANCELLED"],
    CONFIRMED: ["CHECKED_IN", "CANCELLED"],
    CHECKED_IN: ["COMPLETED"],
    COMPLETED: [],
    CANCELLED: [],
}

export type Result = { ok: true } | { ok: false; error: string }

export async function transitionBooking(tx: Tx, id: string, newStatus: BookingStatus, actor: Actor): Promise<Result> {
    const [booking] = await tx
        .select()
        .from(bookings)
        .where(eq(bookings.id, id))
    if (!booking) {
        return { ok: false, error: "Booking not found" }
    }
    if (!allowed[booking.status as BookingStatus].includes(newStatus)) {
        return { ok: false, error: `Cannot transition from ${booking.status} to ${newStatus}` }
    }
    await tx
        .update(bookings)
        .set({ status: newStatus })
        .where(eq(bookings.id, id))
    await recordAudit(tx, {
        actor,
        action: "transition_booking",
        entityType: "booking",
        entityId: id,
        changes: { status: [booking.status, newStatus] },
    })
    return { ok: true }
}