"use client"

import { useActionState } from "react"
import {
  cancelBookingAction,
  type CancelBookingState,
} from "@/app/actions/guest-bookings"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog"
export function CancelBookingForm({ bookingId }: { bookingId: string }) {
  const [state, action, pending] = useActionState<CancelBookingState, FormData>(
    cancelBookingAction,
    {}
  )
  return (
    <div className="mt-6 border-t pt-6">
      <AlertDialog>
        <AlertDialogTrigger
          render={<Button variant="destructive" type="button" />}
        >
          Cancel reservation
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel this reservation?</AlertDialogTitle>
            <AlertDialogDescription>
              Your room will be released. You can make a new reservation later,
              subject to availability.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <form action={action} className="grid gap-4">
            <input type="hidden" name="bookingId" value={bookingId} />
            {state.message && (
              <Alert variant="destructive">
                <AlertDescription>{state.message}</AlertDescription>
              </Alert>
            )}
            <AlertDialogFooter>
              <AlertDialogCancel disabled={pending}>
                Keep reservation
              </AlertDialogCancel>
              <Button type="submit" variant="destructive" disabled={pending}>
                {pending ? "Cancelling…" : "Yes, cancel reservation"}
              </Button>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
