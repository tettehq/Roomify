import { redirect } from "next/navigation"
import { parseRoomStayContext } from "@/lib/room-search"

type SearchParams = Record<string, string | string[] | undefined>

export default async function LegacyReservationRedirect({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const values = await searchParams
  const context = parseRoomStayContext(values)
  const roomId = typeof values.roomId === "string" ? values.roomId : ""
  const reserveQuery = new URLSearchParams({
    ...(roomId ? { roomId } : {}),
    ...(context.input.checkIn ? { checkIn: context.input.checkIn } : {}),
    ...(context.input.checkOut ? { checkOut: context.input.checkOut } : {}),
    ...(context.input.guests ? { guests: context.input.guests } : {}),
    ...(context.input.roomType ? { roomType: context.input.roomType } : {}),
  }).toString()
  redirect(`/bookings/new${reserveQuery ? `?${reserveQuery}` : ""}`)
}
