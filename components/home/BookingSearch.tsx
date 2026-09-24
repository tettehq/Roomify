"use client"

import { useId, useState } from "react"
import { addDays, format, isValid, parseISO } from "date-fns"
import { Search, CalendarDays, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DatePicker } from "@/components/ui/date-picker"
import { Label } from "@/components/ui/label"
import { SelectField, SelectFieldOption } from "@/components/ui/select-field"
import { Card, CardContent } from "@/components/ui/card"
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
  const id = useId()
  const today = new Date().toISOString().slice(0, 10)
  const [checkIn, setCheckIn] = useState(values.checkIn || "")
  const [checkOut, setCheckOut] = useState(values.checkOut || "")
  return (
    <div
      id="stay"
      className={
        variant === "hero"
          ? "relative mx-auto -mt-8 max-w-7xl px-5 sm:px-8"
          : "w-full"
      }
    >
      <Card className="shadow-sm">
        <CardContent>
          <form
            action="/rooms"
            method="get"
            className="grid items-end gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_.75fr_1.2fr_auto]"
          >
            <div className="grid min-w-0 gap-2">
              <Label htmlFor={id + "in"}>
                <CalendarDays className="size-3.5 text-muted-foreground" />
                Check-in
              </Label>
              <DatePicker
                id={id + "in"}
                label="Check-in"
                name="checkIn"
                min={today}
                value={checkIn}
                onValueChange={(value) => {
                  setCheckIn(value)
                  if (checkOut && value >= checkOut) setCheckOut("")
                }}
              />
            </div>
            <div className="grid min-w-0 gap-2">
              <Label htmlFor={id + "out"}>Check-out</Label>
              <DatePicker
                id={id + "out"}
                label="Check-out"
                name="checkOut"
                min={
                  checkIn && isValid(parseISO(checkIn))
                    ? format(addDays(parseISO(checkIn), 1), "yyyy-MM-dd")
                    : today
                }
                value={checkOut}
                onValueChange={setCheckOut}
              />
            </div>
            <div className="grid min-w-0 gap-2">
              <Label htmlFor={id + "guests"}>Guests</Label>
              <SelectField
                id={id + "guests"}
                name="guests"
                defaultValue={values.guests || "2"}
              >
                {[1, 2, 3, 4].map((n) => (
                  <SelectFieldOption key={n} value={n}>
                    {n} {n === 1 ? "guest" : "guests"}
                  </SelectFieldOption>
                ))}
              </SelectField>
            </div>
            <div className="grid min-w-0 gap-2">
              <Label htmlFor={id + "type"}>
                <SlidersHorizontal className="size-3.5 text-muted-foreground" />
                Room type
              </Label>
              <SelectField
                id={id + "type"}
                name="roomType"
                defaultValue={values.roomType || ""}
              >
                <SelectFieldOption value="">All room types</SelectFieldOption>
                {ROOM_TYPES.map((type) => (
                  <SelectFieldOption key={type} value={type}>
                    {ROOM_TYPE_LABELS[type]}
                  </SelectFieldOption>
                ))}
              </SelectField>
            </div>
            <Button type="submit" className="sm:col-span-2 lg:col-span-1">
              <Search />
              Search rooms
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
