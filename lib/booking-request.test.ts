import assert from "node:assert/strict"
import test from "node:test"
import { bookingRequestFromFormData } from "./booking-request"

test("booking form parsing allowlists stay identifiers and ignores privileged fields", () => {
  const formData = new FormData()
  formData.set("roomId", "10000000-0000-4000-8000-000000000015")
  formData.set("checkIn", "2040-01-10")
  formData.set("checkOut", "2040-01-13")
  formData.set("guests", "2")
  formData.set("guestId", "00000000-0000-4000-8000-000000000999")
  formData.set("nightlyRate", "0.01")
  formData.set("totalAmount", "0.01")
  formData.set("status", "COMPLETED")

  assert.deepEqual(bookingRequestFromFormData(formData), {
    roomId: "10000000-0000-4000-8000-000000000015",
    checkIn: "2040-01-10",
    checkOut: "2040-01-13",
    guests: "2",
  })
})
