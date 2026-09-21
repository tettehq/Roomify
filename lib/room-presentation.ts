import type { RoomType } from "./room-types"

const ROOM_PHOTO_IDS: Record<RoomType, string> = {
  STANDARD_KING: "photo-1590490360182-c33d57733427",
  DELUXE_DOUBLE: "photo-1611892440504-42a792e24d32",
  EXECUTIVE_SUITE: "photo-1582719478250-c89cae4dc85b",
  FAMILY_SUITE: "photo-1611892440504-42a792e24d32",
}

export function getRoomImageFallback(type: RoomType) {
  return `https://images.unsplash.com/${ROOM_PHOTO_IDS[type]}?auto=format&fit=crop&w=1600&q=85`
}
