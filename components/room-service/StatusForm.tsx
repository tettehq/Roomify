"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { updateRoomServiceStatusAction } from "@/app/actions/room-service"
import { Button } from "@/components/ui/button"

export function OrderStatusForm({
  orderId,
  status,
}: {
  orderId: string
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED"
}) {
  const client = useQueryClient()
  const router = useRouter()
  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const result = await updateRoomServiceStatusAction({}, formData)
      if (!result.success)
        throw new Error(result.message ?? "Unable to update this order.")
    },
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: ["staff", "room-service"] })
      router.refresh()
    },
  })
  const next =
    status === "PENDING"
      ? "IN_PROGRESS"
      : status === "IN_PROGRESS"
        ? "COMPLETED"
        : null
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        mutation.mutate(new FormData(event.currentTarget))
      }}
      className="flex flex-wrap items-center gap-2"
    >
      <input type="hidden" name="orderId" value={orderId} />
      {next && (
        <>
          <input type="hidden" name="status" value={next} />
          <Button type="submit" disabled={mutation.isPending} size="sm">
            {mutation.isPending
              ? "Updating…"
              : next === "IN_PROGRESS"
                ? "Start order"
                : "Complete order"}
          </Button>
        </>
      )}
      {mutation.error && (
        <p role="alert" className="text-xs text-destructive">
          {mutation.error.message}
        </p>
      )}
    </form>
  )
}
