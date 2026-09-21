"use client"

import { CalendarDays, ChevronDown, Search, Users } from "lucide-react"
import { ReactNode } from "react"
import { ROOM_TYPES, ROOM_TYPE_LABELS } from "@/lib/room-types"

type SearchValues = {
  checkIn?: string
  checkOut?: string
  guests?: string
  roomType?: string
}

export function BookingSearch({
  values = {},
  variant = "hero",
}: {
  values?: SearchValues
  variant?: "hero" | "results"
}) {
  const today = new Date().toISOString().slice(0, 10)
  return (
    <div
      id="stay"
      className={
        variant === "hero"
          ? "relative mx-auto -mt-9 max-w-7xl px-5 sm:px-8"
          : "w-full"
      }
    >
      <form
        action="/rooms"
        method="get"
        className="grid gap-3 rounded-2xl border border-[#e7e5e0] bg-white p-3 shadow-[0_12px_30px_rgba(27,67,50,0.1)] md:grid-cols-[1.1fr_1fr_1fr_0.9fr_1fr_auto] md:gap-1.5 md:p-2"
      >
        <Field
          icon={<Search size={18} />}
          label="Destination"
          value="Grand Azure Resort"
        />
        <Field
          icon={<CalendarDays size={18} />}
          label="Check-in"
          type="date"
          name="checkIn"
          value={values.checkIn}
          min={today}
          required
        />
        <Field
          icon={<CalendarDays size={18} />}
          label="Check-out"
          type="date"
          name="checkOut"
          value={values.checkOut}
          min={values.checkIn || today}
          required
        />
        <label className="flex min-w-0 items-center gap-3 rounded-xl px-3 py-2 text-left transition focus-within:bg-[#f4f3ee]">
          <Users size={18} className="shrink-0 text-[#2d6a4f]" />
          <span className="min-w-0 flex-1">
            <span className="block text-[11px] font-semibold tracking-[0.12em] text-[#94a3b8] uppercase">
              Guests
            </span>
            <select
              name="guests"
              className="w-full appearance-none bg-transparent text-sm font-medium text-[#1e293b] outline-none"
              defaultValue={values.guests || "2"}
              aria-label="Guests"
            >
              <option value="1">1 guest</option>
              <option value="2">2 guests</option>
              <option value="3">3 guests</option>
              <option value="4">4 guests</option>
            </select>
          </span>
          <ChevronDown size={15} className="text-[#94a3b8]" />
        </label>
        <label className="flex min-w-0 items-center gap-3 rounded-xl px-3 py-2 text-left transition focus-within:bg-[#f4f3ee]">
          <span className="min-w-0 flex-1">
            <span className="block text-[11px] font-semibold tracking-[0.12em] text-[#94a3b8] uppercase">
              Room type
            </span>
            <select
              name="roomType"
              className="w-full appearance-none bg-transparent text-sm font-medium text-[#1e293b] outline-none"
              defaultValue={values.roomType || ""}
              aria-label="Room type"
            >
              <option value="">Any room</option>
              {ROOM_TYPES.map((type) => (
                <option key={type} value={type}>
                  {ROOM_TYPE_LABELS[type]}
                </option>
              ))}
            </select>
          </span>
          <ChevronDown size={15} className="text-[#94a3b8]" />
        </label>
        <button
          className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#1b4332] px-5 text-sm font-semibold text-white transition hover:bg-[#2d6a4f] focus-visible:ring-4 focus-visible:ring-[#1b4332]/20 focus-visible:outline-none"
          type="submit"
        >
          <Search size={17} /> Search
        </button>
      </form>
    </div>
  )
}

function Field({
  icon,
  label,
  value,
  type = "text",
  name,
  min,
  required,
}: {
  icon: ReactNode
  label: string
  value?: string
  type?: string
  name?: string
  min?: string
  required?: boolean
}) {
  return (
    <label className="flex min-w-0 items-center gap-3 rounded-xl px-3 py-2 text-left transition focus-within:bg-[#f4f3ee]">
      <span className="shrink-0 text-[#2d6a4f]">{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="block text-[11px] font-semibold tracking-[0.12em] text-[#94a3b8] uppercase">
          {label}
        </span>
        <input
          className="w-full min-w-0 bg-transparent text-sm font-medium text-[#1e293b] outline-none placeholder:text-[#1e293b]"
          aria-label={label}
          type={type}
          name={name}
          min={min}
          required={required}
          defaultValue={value}
        />
      </span>
    </label>
  )
}
