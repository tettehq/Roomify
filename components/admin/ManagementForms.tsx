"use client"

import { useActionState } from "react"
import {
  saveUserAction,
  manageBookingAction,
  type ManagementState,
} from "@/app/actions/admin-management"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

const selectClass =
  "h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
const initial: ManagementState = {}
function Feedback({ state }: { state: ManagementState }) {
  return (
    <p
      role={state.success ? "status" : "alert"}
      className={
        state.success ? "text-sm text-primary" : "text-sm text-destructive"
      }
    >
      {state.message}
    </p>
  )
}
export function UserManagementForm({
  user,
}: {
  user?: { id: string; role: string; isActive: boolean }
}) {
  const [state, action, pending] = useActionState(saveUserAction, initial)
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="id" value={user?.id ?? ""} />
      <fieldset disabled={pending} className="space-y-4">
        {!user && (
          <>
            <Label className="grid gap-2">
              Name
              <Input
                name="name"
                required
                minLength={2}
                maxLength={80}
                autoComplete="name"
              />
            </Label>
            <Label className="grid gap-2">
              Email
              <Input name="email" type="email" required autoComplete="email" />
            </Label>
            <Label className="grid gap-2">
              Password
              <Input
                name="password"
                type="password"
                required
                minLength={10}
                autoComplete="new-password"
              />
            </Label>
            <p className="text-xs text-muted-foreground">
              At least 10 characters, with uppercase, lowercase, and a number.
            </p>
            <Label className="grid gap-2">
              Confirm password
              <Input
                name="confirmPassword"
                type="password"
                required
                autoComplete="new-password"
              />
            </Label>
          </>
        )}
        <Label className="grid gap-2">
          Role
          <select
            name="role"
            defaultValue={user?.role ?? "STAFF"}
            className={selectClass}
          >
            <option value="GUEST">Guest</option>
            <option value="STAFF">Staff</option>
            <option value="ADMIN">Administrator</option>
          </select>
        </Label>
        {user && (
          <Label className="grid gap-2">
            Account access
            <select
              name="isActive"
              defaultValue={String(user.isActive)}
              className={selectClass}
            >
              <option value="true">Active</option>
              <option value="false">Deactivated</option>
            </select>
          </Label>
        )}
        <Button type="submit">
          {pending ? "Saving…" : user ? "Save account" : "Create account"}
        </Button>
      </fieldset>
      <Feedback state={state} />
    </form>
  )
}

export function ReservationManagementForm({
  booking,
  rooms,
}: {
  booking: { id: string; roomId: string; checkIn: string; checkOut: string }
  rooms: {
    id: string
    roomNumber: string
    capacity: number
    baseRate: string
  }[]
}) {
  const [state, action, pending] = useActionState(manageBookingAction, initial)
  const [cancelState, cancelAction, cancelling] = useActionState(
    manageBookingAction,
    initial
  )
  if (cancelState.success) return <Feedback state={cancelState} />
  return (
    <div className="space-y-6">
      <form action={action} className="space-y-4">
        <input type="hidden" name="id" value={booking.id} />
        <input type="hidden" name="operation" value="update" />
        <fieldset disabled={pending || cancelling} className="space-y-4">
          <Label className="grid gap-2">
            Room
            <select
              name="roomId"
              defaultValue={booking.roomId}
              className={selectClass}
            >
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  Room {room.roomNumber} · {room.capacity} guests · $
                  {room.baseRate}/night
                </option>
              ))}
            </select>
          </Label>
          <div className="grid gap-4 sm:grid-cols-2">
            <Label className="grid gap-2">
              Check-in
              <Input
                type="date"
                name="checkIn"
                required
                defaultValue={booking.checkIn}
              />
            </Label>
            <Label className="grid gap-2">
              Check-out
              <Input
                type="date"
                name="checkOut"
                required
                defaultValue={booking.checkOut}
              />
            </Label>
          </div>
          <p className="text-xs text-muted-foreground">
            Saving recalculates the total at the selected room’s current rate.
            Choose a room with at least the original capacity. No real charge or
            refund is made.
          </p>
          <Button type="submit">
            {pending ? "Saving…" : "Update reservation"}
          </Button>
        </fieldset>
        <Feedback state={state} />
      </form>
      <form action={cancelAction} className="space-y-4 border-t pt-4">
        <input type="hidden" name="id" value={booking.id} />
        <input type="hidden" name="operation" value="cancel" />
        <fieldset disabled={pending || cancelling} className="space-y-3">
          <Label className="flex gap-2">
            <input type="checkbox" name="confirmCancel" value="yes" required />I
            confirm cancellation of this reservation.
          </Label>
          <Button type="submit" variant="destructive">
            {cancelling ? "Cancelling…" : "Cancel reservation"}
          </Button>
        </fieldset>
        <Feedback state={cancelState} />
      </form>
    </div>
  )
}
