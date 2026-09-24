import assert from "node:assert/strict"
import test from "node:test"
import {
  createGuestRoomServiceOrder,
  getOrderById,
  updateOrderStatus,
} from "./room-service"

const BOOKING_ID = "20000000-0000-4000-8000-000000000001"
const GUEST_ID = "00000000-0000-4000-8000-000000000101"
const MENU_ITEM_ID = "40000000-0000-4000-8000-000000000005"

test("room-service order uses database menu price and preserves order history", async () => {
  const created = await createGuestRoomServiceOrder({
    bookingId: BOOKING_ID,
    guestId: GUEST_ID,
    items: [{ menuItemId: MENU_ITEM_ID, quantity: 1 }],
  })
  assert.equal(created.success, true)
  const orderId = created.success ? created.orderId : undefined
  assert.ok(orderId)
  const order = await getOrderById(orderId)
  assert.ok(order)
  assert.equal(order.totalAmount, "14.50")
  assert.ok(
    order.items.some(
      (item) => item.menuItemId === MENU_ITEM_ID && item.unitPrice === "14.50"
    )
  )

  if (order.status === "PENDING")
    assert.equal(
      (await updateOrderStatus(order.id, "IN_PROGRESS"))?.id,
      order.id
    )
  if (order.status === "PENDING" || order.status === "IN_PROGRESS")
    assert.equal((await updateOrderStatus(order.id, "COMPLETED"))?.id, order.id)
  const completed = await getOrderById(order.id)
  assert.equal(completed?.status, "COMPLETED")
})
