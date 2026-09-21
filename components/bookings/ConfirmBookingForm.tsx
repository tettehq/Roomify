"use client"

import Link from "next/link"
import { useActionState } from "react"
import {
  confirmBookingAction,
  type ConfirmBookingState,
} from "@/app/actions/bookings"

const initialState: ConfirmBookingState = {}

export function ConfirmBookingForm({
  roomId,
  checkIn,
  checkOut,
  guests,
  searchHref,
}: {
  roomId: string
  checkIn: string
  checkOut: string
  guests: number
  searchHref: string
}) {
  const [state, action, pending] = useActionState(
    confirmBookingAction,
    initialState
  )

  return (
    <form action={action} className="mt-6">
      <input type="hidden" name="roomId" value={roomId} />
      <input type="hidden" name="checkIn" value={checkIn} />
      <input type="hidden" name="checkOut" value={checkOut} />
      <input type="hidden" name="guests" value={guests} />
      {state.message ? (
        <div
          role="alert"
          aria-live="polite"
          className="mb-4 rounded-xl border border-[#f0c9ba] bg-[#fff8f5] p-4 text-sm leading-6 text-[#7a321d]"
        >
          <p>{state.message}</p>
          {state.code === "UNAVAILABLE" ? (
            <Link
              href={searchHref}
              className="mt-2 inline-flex font-semibold text-[#2d6a4f] underline underline-offset-4"
            >
              Search other rooms
            </Link>
          ) : null}
        </div>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="flex min-h-12 w-full items-center justify-center rounded-xl bg-[#1b4332] px-5 text-sm font-semibold text-white transition hover:bg-[#2d6a4f] focus-visible:ring-4 focus-visible:ring-[#1b4332]/20 focus-visible:outline-none disabled:cursor-wait disabled:opacity-60"
      >
        {pending ? "Confirming reservation…" : "Confirm reservation"}
      </button>
      <p className="mt-3 text-center text-xs leading-5 text-[#94a3b8]">
        Your room and total are checked again securely before confirmation.
      </p>
    </form>
  )
}
