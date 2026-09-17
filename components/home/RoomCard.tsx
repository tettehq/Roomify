import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, BedDouble } from "lucide-react"
import { Room } from "./data"

export function RoomCard({ room }: { room: Room }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-[#e7e5e0] bg-white shadow-[0_1px_3px_rgba(27,67,50,0.04)] transition hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(27,67,50,0.1)]">
      <div className="relative aspect-[1.42] overflow-hidden">
        <Image
          src={room.image}
          alt={room.name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        {room.tag && (
          <span className="absolute top-4 left-4 rounded-full bg-[#d8f3dc] px-3 py-1 text-xs font-semibold text-[#2d6a4f]">
            {room.tag}
          </span>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-heading text-lg font-semibold text-[#163e2e]">
              {room.name}
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
              ${room.price}
            </span>
            <span className="text-xs text-[#94a3b8]"> / night</span>
            <p className="mt-1 text-xs text-[#64748b]">{room.details}</p>
          </div>
          <Link
            href={`/rooms/${room.id}`}
            className="flex items-center gap-1 text-sm font-semibold text-[#2d6a4f] hover:text-[#1b4332]"
          >
            Explore <ArrowUpRight size={15} />
          </Link>
        </div>
      </div>
    </article>
  )
}
