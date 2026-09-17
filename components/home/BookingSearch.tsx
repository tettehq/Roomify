"use client"

import { CalendarDays, ChevronDown, Search, Users } from "lucide-react"
import { FormEvent, ReactNode, useState } from "react"

export function BookingSearch() {
  const [submitted, setSubmitted] = useState(false)
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(true)
  }
  return (
    <div id="stay" className="relative mx-auto -mt-9 max-w-6xl px-5 sm:px-8">
      <form
        onSubmit={submit}
        className="grid gap-3 rounded-2xl border border-[#e7e5e0] bg-white p-3 shadow-[0_12px_30px_rgba(27,67,50,0.1)] md:grid-cols-[1.1fr_1fr_1fr_0.9fr_auto] md:gap-1.5 md:p-2"
      >
        <Field
          icon={<Search size={18} />}
          label="Destination"
          value="Grand Azure Resort"
        />
        <Field icon={<CalendarDays size={18} />} label="Check-in" type="date" />
        <Field
          icon={<CalendarDays size={18} />}
          label="Check-out"
          type="date"
        />
        <label className="flex min-w-0 items-center gap-3 rounded-xl px-3 py-2 text-left transition focus-within:bg-[#f4f3ee]">
          <Users size={18} className="shrink-0 text-[#2d6a4f]" />
          <span className="min-w-0 flex-1">
            <span className="block text-[11px] font-semibold tracking-[0.12em] text-[#94a3b8] uppercase">
              Guests
            </span>
            <select
              className="w-full appearance-none bg-transparent text-sm font-medium text-[#1e293b] outline-none"
              defaultValue="2"
            >
              <option value="1">1 guest</option>
              <option value="2">2 guests</option>
              <option value="3">3 guests</option>
              <option value="4">4 guests</option>
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
      {submitted && (
        <p
          className="mt-3 text-center text-sm font-medium text-[#2d6a4f]"
          role="status"
        >
          Availability search is ready for your stay.
        </p>
      )}
    </div>
  )
}

function Field({
  icon,
  label,
  value,
  type = "text",
}: {
  icon: ReactNode
  label: string
  value?: string
  type?: string
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
          defaultValue={type === "text" ? value : undefined}
        />
      </span>
    </label>
  )
}
