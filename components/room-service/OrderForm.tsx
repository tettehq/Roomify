"use client"

import { useActionState, useState } from "react"
import { ShoppingBag, UtensilsCrossed, LoaderCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { SelectField, SelectFieldOption } from "@/components/ui/select-field"
import { Label } from "@/components/ui/label"
import { multiplyMoney } from "@/lib/money"
import {
  placeRoomServiceOrderAction,
  type RoomServiceState,
} from "@/app/actions/room-service"
type Item = {
  id: string
  name: string
  description: string
  category: string
  price: string
}
export function OrderForm({
  bookingId,
  items,
}: {
  bookingId: string
  items: Item[]
}) {
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const [category, setCategory] = useState("ALL")
  const [state, action, pending] = useActionState<RoomServiceState, FormData>(
    placeRoomServiceOrderAction,
    {}
  )
  const selected = items.filter((item) => (quantities[item.id] ?? 0) > 0)
  const total = selected.reduce(
    (sum, item) =>
      sum +
      BigInt(multiplyMoney(item.price, quantities[item.id]).replace(".", "")),
    BigInt(0)
  )
  const totalLabel = `${total / BigInt(100)}.${String(total % BigInt(100)).padStart(2, "0")}`
  return (
    <form
      action={action}
      className="mt-8 grid items-start gap-6 lg:grid-cols-[1fr_320px]"
    >
      <input type="hidden" name="bookingId" value={bookingId} />
      {selected.map((item) => (
        <input
          key={item.id}
          type="hidden"
          name="item"
          value={`${item.id}:${quantities[item.id]}`}
        />
      ))}
      <div className="space-y-5">
        <div className="flex flex-wrap gap-2" aria-label="Menu categories">
          {["ALL", ...new Set(items.map((item) => item.category))].map(
            (value) => (
              <Button
                key={value}
                type="button"
                variant={category === value ? "secondary" : "ghost"}
                size="sm"
                aria-pressed={category === value}
                onClick={() => setCategory(value)}
                className="capitalize"
              >
                {value === "ALL"
                  ? "All items"
                  : value.toLowerCase().replaceAll("_", " ")}
              </Button>
            )
          )}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {items
            .filter((item) => category === "ALL" || item.category === category)
            .map((item) => (
              <Card key={item.id} className="h-full">
                <CardContent className="flex h-full flex-col gap-4">
                  <div className="flex items-start justify-between gap-3">
                    <span className="flex size-9 items-center justify-center rounded-lg bg-accent text-primary">
                      <UtensilsCrossed className="size-4" />
                    </span>
                    <span className="font-semibold tabular-nums">
                      ${item.price}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between gap-3 border-t pt-4">
                    <Label htmlFor={"qty-" + item.id}>
                      Quantity<span className="sr-only"> for {item.name}</span>
                    </Label>
                    <SelectField
                      id={"qty-" + item.id}
                      disabled={pending}
                      value={quantities[item.id] ?? 0}
                      onValueChange={(value) =>
                        setQuantities((current) => ({
                          ...current,
                          [item.id]: Number(value),
                        }))
                      }
                      wrapperClassName="w-20"
                    >
                      {Array.from({ length: 11 }, (_, n) => (
                        <SelectFieldOption key={n} value={n}>
                          {n}
                        </SelectFieldOption>
                      ))}
                    </SelectField>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
      <Card className="lg:sticky lg:top-24">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingBag className="size-4" />
            Your order
          </CardTitle>
          <CardDescription>Delivered to your room.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {selected.length ? (
            <ul className="space-y-3">
              {selected.map((item) => (
                <li
                  key={item.id}
                  className="flex justify-between gap-3 text-sm"
                >
                  <span>
                    {quantities[item.id]} × {item.name}
                  </span>
                  <span className="shrink-0 tabular-nums">
                    ${multiplyMoney(item.price, quantities[item.id])}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="rounded-xl border border-dashed p-5 text-center text-sm text-muted-foreground">
              Choose a quantity to add an item.
            </p>
          )}
          <div
            className="flex justify-between border-t pt-4 font-semibold"
            aria-live="polite"
          >
            <span>Estimated total</span>
            <span className="tabular-nums">${totalLabel}</span>
          </div>
          {state.message && (
            <Alert variant="destructive">
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}
          <Button
            type="submit"
            disabled={pending || !selected.length}
            className="w-full"
          >
            {pending ? (
              <>
                <LoaderCircle className="animate-spin" />
                Placing order…
              </>
            ) : (
              "Place order"
            )}
          </Button>
        </CardContent>
      </Card>
    </form>
  )
}
