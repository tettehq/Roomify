import { isRoomType, type RoomType } from "./room-types"

export const BLOCKING_BOOKING_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "CHECKED_IN",
] as const

export type RoomSearchCriteria = {
  checkIn: string
  checkOut: string
  checkInDate: Date
  checkOutDate: Date
  guests: number
  roomType?: RoomType
  nights: number
}

export type RoomSearchInput = {
  checkIn?: string
  checkOut?: string
  guests?: string
  roomType?: string
}

export type RoomSearchResult =
  | { success: true; data: RoomSearchCriteria; input: RoomSearchInput }
  | { success: false; errors: string[]; input: RoomSearchInput }

type SearchParams = Record<string, string | string[] | undefined>

export type RoomStayContext =
  | { state: "missing"; input: RoomSearchInput }
  | { state: "invalid"; errors: string[]; input: RoomSearchInput }
  | { state: "valid"; data: RoomSearchCriteria; input: RoomSearchInput }

function single(value: string | string[] | undefined) {
  return typeof value === "string" ? value : undefined
}

function roomSearchInput(searchParams: SearchParams): RoomSearchInput {
  return {
    checkIn: single(searchParams.checkIn),
    checkOut: single(searchParams.checkOut),
    guests: single(searchParams.guests),
    roomType: single(searchParams.roomType),
  }
}

function parseHotelDate(value: string, hour: number) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null
  const date = new Date(`${value}T${String(hour).padStart(2, "0")}:00:00.000Z`)
  return Number.isNaN(date.valueOf()) ||
    date.toISOString().slice(0, 10) !== value
    ? null
    : date
}

export function parseRoomSearch(
  searchParams: SearchParams,
  currentDate = new Date()
): RoomSearchResult {
  const input = roomSearchInput(searchParams)
  const errors: string[] = []
  const checkInDate = input.checkIn ? parseHotelDate(input.checkIn, 15) : null
  const checkOutDate = input.checkOut
    ? parseHotelDate(input.checkOut, 11)
    : null

  if (!input.checkIn) errors.push("Please select a check-in date.")
  else if (!checkInDate) errors.push("Please enter a valid check-in date.")
  if (!input.checkOut) errors.push("Please select a check-out date.")
  else if (!checkOutDate) errors.push("Please enter a valid check-out date.")

  const guests =
    input.guests && /^\d+$/.test(input.guests)
      ? Number(input.guests)
      : Number.NaN
  if (!Number.isSafeInteger(guests) || guests < 1) {
    errors.push("Please select at least one guest.")
  }

  let roomType: RoomType | undefined
  if (input.roomType) {
    if (isRoomType(input.roomType)) roomType = input.roomType
    else errors.push("Please select a valid room type.")
  }

  if (checkInDate && checkOutDate && checkOutDate <= checkInDate) {
    errors.push("Check-out must be after check-in.")
  }

  if (checkInDate) {
    const today = new Date(currentDate)
    today.setUTCHours(0, 0, 0, 0)
    const checkInDay = new Date(`${input.checkIn}T00:00:00.000Z`)
    if (checkInDay < today) errors.push("Check-in cannot be in the past.")
  }

  if (errors.length || !checkInDate || !checkOutDate) {
    return { success: false, errors, input }
  }

  const nights = calculateHotelNights(input.checkIn!, input.checkOut!)

  return {
    success: true,
    data: {
      checkIn: input.checkIn!,
      checkOut: input.checkOut!,
      checkInDate,
      checkOutDate,
      guests,
      roomType,
      nights,
    },
    input,
  }
}

export function calculateHotelNights(checkIn: string, checkOut: string) {
  return Math.round(
    (Date.parse(`${checkOut}T00:00:00.000Z`) -
      Date.parse(`${checkIn}T00:00:00.000Z`)) /
      86_400_000
  )
}

export function parseRoomStayContext(
  searchParams: SearchParams,
  currentDate = new Date()
): RoomStayContext {
  const input = roomSearchInput(searchParams)
  if (!input.checkIn && !input.checkOut && !input.guests) {
    return { state: "missing", input }
  }

  const parsed = parseRoomSearch(searchParams, currentDate)
  return parsed.success
    ? { state: "valid", data: parsed.data, input: parsed.input }
    : { state: "invalid", errors: parsed.errors, input: parsed.input }
}

export function roomSearchQuery(input: RoomSearchInput) {
  const query = new URLSearchParams()
  for (const key of ["checkIn", "checkOut", "guests", "roomType"] as const) {
    const value = input[key]
    if (value) query.set(key, value)
  }
  return query.toString()
}

export function dateRangesOverlap(
  existingCheckIn: Date,
  existingCheckOut: Date,
  requestedCheckIn: Date,
  requestedCheckOut: Date
) {
  return (
    existingCheckIn < requestedCheckOut && existingCheckOut > requestedCheckIn
  )
}

export function bookingBlocksInventory(status: string) {
  return (BLOCKING_BOOKING_STATUSES as readonly string[]).includes(status)
}
