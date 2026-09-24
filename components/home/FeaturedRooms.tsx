import { connection } from "next/server"
import { getFeaturedRooms } from "@/data/rooms"
import { RoomCard } from "./RoomCard"

export async function FeaturedRooms() {
  await connection()
  let rooms
  try {
    rooms = await getFeaturedRooms()
  } catch {
    // Never log the raw database error: it can contain connection details.
    console.error("Homepage room query failed.")
    return (
      <RoomMessage>
        Rooms are temporarily unavailable. Please try again later.
      </RoomMessage>
    )
  }
  if (rooms.length === 0) {
    return (
      <RoomMessage>
        No rooms are currently available to feature. Please check back soon.
      </RoomMessage>
    )
  }
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {rooms.map((room) => (
        <RoomCard key={room.id} room={room} />
      ))}
    </div>
  )
}

export function RoomMessage({ children }: { children: React.ReactNode }) {
  return (
    <p
      role="status"
      className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground"
    >
      {children}
    </p>
  )
}
