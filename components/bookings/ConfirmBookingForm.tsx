"use client"

import { Button } from "@/components/ui/button"

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
          className="mb-4 rounded-xl border border-destructive/25 bg-destructive/5 p-4 text-sm leading-6 text-destructive"
        >
          <p>{state.message}</p>
          {state.code === "UNAVAILABLE" ? (
            <Link
              href={searchHref}
              className="mt-2 inline-flex font-semibold text-primary underline underline-offset-4"
            >
              Search other rooms
            </Link>
          ) : null}
        </div>
      ) : null}
      <Button type="submit" disabled={pending} size="lg" className="w-full">
        {pending ? "Confirming reservation…" : "Confirm reservation"}
      </Button>
      <p className="mt-3 text-center text-xs leading-5 text-muted-foreground">
        Your room and total are checked again securely before confirmation.
      </p>
    </form>
  )
}
