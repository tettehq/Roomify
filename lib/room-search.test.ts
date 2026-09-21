import assert from "node:assert/strict"
import test from "node:test"
import {
  bookingBlocksInventory,
  dateRangesOverlap,
  parseRoomStayContext,
  parseRoomSearch,
  roomSearchQuery,
} from "./room-search"

const date = (value: string) => new Date(`${value}T12:00:00.000Z`)

test("overlap uses half-open hotel date boundaries", () => {
  const existingStart = date("2030-09-20")
  const existingEnd = date("2030-09-23")

  assert.equal(
    dateRangesOverlap(
      existingStart,
      existingEnd,
      date("2030-09-22"),
      date("2030-09-25")
    ),
    true
  )
  assert.equal(
    dateRangesOverlap(
      existingStart,
      existingEnd,
      date("2030-09-23"),
      date("2030-09-25")
    ),
    false
  )
  assert.equal(
    dateRangesOverlap(
      existingStart,
      existingEnd,
      date("2030-09-18"),
      date("2030-09-20")
    ),
    false
  )
})

test("only inventory-reserving statuses block rooms", () => {
  assert.equal(bookingBlocksInventory("PENDING"), true)
  assert.equal(bookingBlocksInventory("CONFIRMED"), true)
  assert.equal(bookingBlocksInventory("CHECKED_IN"), true)
  assert.equal(bookingBlocksInventory("COMPLETED"), false)
  assert.equal(bookingBlocksInventory("CANCELLED"), false)
})

test("server search validation rejects invalid criteria", () => {
  const currentDate = date("2030-09-01")
  const result = parseRoomSearch(
    {
      checkIn: "2030-09-25",
      checkOut: "2030-09-24",
      guests: "0",
      roomType: "NOT_A_ROOM",
    },
    currentDate
  )

  assert.equal(result.success, false)
  if (!result.success) {
    assert.ok(result.errors.includes("Check-out must be after check-in."))
    assert.ok(result.errors.includes("Please select at least one guest."))
    assert.ok(result.errors.includes("Please select a valid room type."))
  }
})

test("valid criteria include the exact number of nights", () => {
  const result = parseRoomSearch(
    {
      checkIn: "2030-09-20",
      checkOut: "2030-09-23",
      guests: "2",
      roomType: "DELUXE_DOUBLE",
    },
    date("2030-09-01")
  )

  assert.equal(result.success, true)
  if (result.success) {
    assert.equal(result.data.nights, 3)
    assert.equal(result.data.roomType, "DELUXE_DOUBLE")
  }
})

test("room details allow a missing stay context", () => {
  const result = parseRoomStayContext({}, date("2030-09-01"))
  assert.equal(result.state, "missing")
})

test("room details preserve invalid criteria for correction", () => {
  const result = parseRoomStayContext(
    { checkIn: "2030-09-25", checkOut: "2030-09-24", guests: "2" },
    date("2030-09-01")
  )
  assert.equal(result.state, "invalid")
  if (result.state === "invalid") {
    assert.ok(result.errors.includes("Check-out must be after check-in."))
  }
})

test("search query preserves the established parameter names", () => {
  assert.equal(
    roomSearchQuery({
      checkIn: "2030-09-20",
      checkOut: "2030-09-23",
      guests: "2",
      roomType: "EXECUTIVE_SUITE",
    }),
    "checkIn=2030-09-20&checkOut=2030-09-23&guests=2&roomType=EXECUTIVE_SUITE"
  )
})
