"use client"

import { Button } from "@/components/ui/button"
import { SelectField, SelectFieldOption } from "@/components/ui/select-field"

import { useActionState } from "react"
import {
  updateBookingStatusAction,
  updateRoomStatusAction,
  type StaffActionState,
} from "@/app/actions/staff"

export function BookingStatusForm({
  bookingId,
  nextStatus,
}: {
  bookingId: string
  nextStatus: "CHECKED_IN" | "COMPLETED"
}) {
  const [state, action, pending] = useActionState<StaffActionState, FormData>(
    updateBookingStatusAction,
    {}
  )
  return (
    <form action={action} className="mt-4">
      <input type="hidden" name="bookingId" value={bookingId} />
      <input type="hidden" name="nextStatus" value={nextStatus} />
      {state.message ? (
        <p role="alert" className="mb-2 text-sm text-destructive">
          {state.message}
        </p>
      ) : null}
      <Button type="submit" disabled={pending} size="sm">
        {pending
          ? "Saving…"
          : nextStatus === "CHECKED_IN"
            ? "Check in guest"
            : "Check out guest"}
      </Button>
    </form>
  )
}

export function RoomStatusForm({
  roomId,
  status,
}: {
  roomId: string
  status: "AVAILABLE" | "OCCUPIED" | "NEEDS_CLEANING"
}) {
  const [state, action, pending] = useActionState<StaffActionState, FormData>(
    updateRoomStatusAction,
    {}
  )
  return (
    <form action={action} className="flex items-center gap-2">
      <input type="hidden" name="roomId" value={roomId} />
      <SelectField
        aria-label="Room status"
        name="status"
        defaultValue={status}
        className="min-w-40"
      >
        <SelectFieldOption value="AVAILABLE">Available</SelectFieldOption>
        <SelectFieldOption value="OCCUPIED">Occupied</SelectFieldOption>
        <SelectFieldOption value="NEEDS_CLEANING">
          Needs cleaning
        </SelectFieldOption>
      </SelectField>
      <Button type="submit" disabled={pending} size="sm">
        Save
      </Button>
      {state.message ? (
        <span className="text-xs text-destructive">{state.message}</span>
      ) : null}
    </form>
  )
}
