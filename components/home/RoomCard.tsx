import Link from "next/link"
import { ArrowUpRight, BedDouble } from "lucide-react"
import type { AvailableRoom, FeaturedRoom } from "@/data/rooms"
import { displayMoney, multiplyMoney } from "@/lib/money"
import { getRoomImageFallback } from "@/lib/room-presentation"
import { ROOM_TYPE_LABELS } from "@/lib/room-types"
import { RoomImage } from "./RoomImage"

type Stay = {
  checkIn: string
  checkOut: string
  guests: number
  roomType?: string
  nights: number
}

export function RoomCard({
  room,
  stay,
}: {
  room: FeaturedRoom | AvailableRoom
  stay?: Stay
}) {
  const name = ROOM_TYPE_LABELS[room.type]
  const price = displayMoney(room.baseRate)
  const query = stay
    ? new URLSearchParams({
        checkIn: stay.checkIn,
        checkOut: stay.checkOut,
        guests: String(stay.guests),
        ...(stay.roomType ? { roomType: stay.roomType } : {}),
      }).toString()
    : ""
  return (
    <article className="group overflow-hidden rounded-2xl border border-[#e7e5e0] bg-white shadow-[0_1px_3px_rgba(27,67,50,0.04)] transition hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(27,67,50,0.1)]">
      <div className="relative aspect-[1.42] overflow-hidden">
        <RoomImage
          src={room.imageUrl}
          fallback={getRoomImageFallback(room.type)}
          alt={name}
        />
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-heading text-lg font-semibold text-[#163e2e]">
              {name}
            </h3>
            <p className="mt-2 text-sm leading-6 text-[#64748b]">
              {room.description}
            </p>
          </div>
          <BedDouble size={20} className="mt-1 shrink-0 text-[#ba6548]" />
        </div>
        <div className="mt-5 flex items-center justify-between border-t border-[#f1f0ea] pt-4">
          <div>
            <span className="font-heading text-xl font-bold text-[#163e2e]">
              ${price}
            </span>
            <span className="text-xs text-[#94a3b8]"> / night</span>
            <p className="mt-1 text-xs text-[#64748b]">
              {room.capacity} {room.capacity === 1 ? "guest" : "guests"}
            </p>
            {stay && (
              <p className="mt-2 text-xs leading-5 text-[#64748b]">
                {stay.nights} {stay.nights === 1 ? "night" : "nights"}
                <br />
                <span className="font-semibold text-[#163e2e]">
                  Estimated stay: ${multiplyMoney(room.baseRate, stay.nights)}
                </span>
              </p>
            )}
          </div>
          <Link
            href={`/rooms/${room.id}${query ? `?${query}` : ""}`}
            className="flex items-center gap-1 text-sm font-semibold text-[#2d6a4f] hover:text-[#1b4332]"
          >
            {stay ? "Select room" : "Explore"} <ArrowUpRight size={15} />
          </Link>
        </div>
      </div>
    </article>
  )
}
