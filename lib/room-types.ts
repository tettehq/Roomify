export const ROOM_TYPES = [
  "STANDARD_KING",
  "DELUXE_DOUBLE",
  "EXECUTIVE_SUITE",
  "FAMILY_SUITE",
] as const

export type RoomType = (typeof ROOM_TYPES)[number]

export const ROOM_TYPE_LABELS: Record<RoomType, string> = {
  STANDARD_KING: "Standard King",
  DELUXE_DOUBLE: "Deluxe Double",
  EXECUTIVE_SUITE: "Executive Suite",
  FAMILY_SUITE: "Family Suite",
}

export function isRoomType(value: string): value is RoomType {
  return (ROOM_TYPES as readonly string[]).includes(value)
}
