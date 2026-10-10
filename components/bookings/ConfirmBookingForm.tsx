"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CreditCard, LoaderCircle } from "lucide-react"
import {
  DEMO_CARD_SUCCESS,
  DEMO_CARD_DECLINED,
  type PaymentField,
} from "@/lib/payment-simulation"

import Link from "next/link"
import { useActionState, useState } from "react"
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
  total,
}: {
  roomId: string
  checkIn: string
  checkOut: string
  guests: number
  searchHref: string
  total: string
}) {
  const [state, action, pending] = useActionState(
    confirmBookingAction,
    initialState
  )
  const [fields, setFields] = useState({
    cardholder: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
  })

  function fieldProps(name: PaymentField) {
    return {
      id: name,
      name,
      value: fields[name],
      onChange: (event: React.ChangeEvent<HTMLInputElement>) =>
        setFields((previous) => ({ ...previous, [name]: event.target.value })),
      required: true,
      autoComplete: "off",
      "aria-invalid": Boolean(state.paymentErrors?.[name]),
      "aria-describedby": state.paymentErrors?.[name]
        ? `${name}-error`
        : undefined,
    }
  }

  function fieldError(name: PaymentField) {
    return state.paymentErrors?.[name] ? (
      <p id={`${name}-error`} className="text-xs text-destructive">
        {state.paymentErrors[name]}
      </p>
    ) : null
  }

  function fillDemoCard(cardNumber: string) {
    setFields({
      cardholder: "Demo Guest",
      cardNumber,
      expiry: `12/${String(new Date().getUTCFullYear() + 1).slice(-2)}`,
      cvc: "123",
    })
  }

  return (
    <form action={action} className="mt-6" aria-busy={pending}>
      <input type="hidden" name="roomId" value={roomId} />
      <input type="hidden" name="checkIn" value={checkIn} />
      <input type="hidden" name="checkOut" value={checkOut} />
      <input type="hidden" name="guests" value={guests} />
      <fieldset
        disabled={pending}
        aria-describedby="demo-payment-help"
        className="mb-5 min-w-0 space-y-4 border-t border-border pt-5"
      >
        <legend className="flex items-center gap-2 pr-2 font-heading text-lg font-semibold">
          <CreditCard size={20} aria-hidden="true" /> Card payment
        </legend>
        <div
          id="demo-payment-help"
          className="rounded-xl bg-muted p-3 text-xs leading-5 text-muted-foreground"
        >
          <p className="font-semibold text-foreground">
            Simulation only — no money is charged.
          </p>
          <p>
            Use demo details, never a real card. Choose a test card to fill the
            form:
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fillDemoCard(DEMO_CARD_SUCCESS)}
            >
              Successful card
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fillDemoCard(DEMO_CARD_DECLINED)}
            >
              Declined card
            </Button>
          </div>
          <p className="mt-2">
            Success: 4242 4242 4242 4242
            <br />
            Decline: 4000 0000 0000 0002
          </p>
          <p>Use a future expiry and any three-digit security code.</p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="cardholder">Name on demo card</Label>
          <Input
            {...fieldProps("cardholder")}
            maxLength={100}
            placeholder="Demo Guest"
          />
          {fieldError("cardholder")}
        </div>
        <div className="space-y-2">
          <Label htmlFor="cardNumber">Demo card number</Label>
          <Input
            {...fieldProps("cardNumber")}
            inputMode="numeric"
            maxLength={19}
            placeholder="4242 4242 4242 4242"
          />
          {fieldError("cardNumber")}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="expiry">Expiry (MM/YY)</Label>
            <Input
              {...fieldProps("expiry")}
              maxLength={5}
              placeholder="MM/YY"
            />
            {fieldError("expiry")}
          </div>
          <div className="space-y-2">
            <Label htmlFor="cvc">Security code</Label>
            <Input
              {...fieldProps("cvc")}
              type="password"
              inputMode="numeric"
              maxLength={3}
              placeholder="123"
            />
            {fieldError("cvc")}
          </div>
        </div>
      </fieldset>
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
        {pending ? (
          <>
            <LoaderCircle className="animate-spin" aria-hidden="true" />{" "}
            Processing…
          </>
        ) : (
          `Simulate payment · $${total}`
        )}
      </Button>
      <p className="mt-3 text-center text-xs leading-5 text-muted-foreground">
        A successful simulation confirms your reservation. Your room and total
        are checked again before confirmation. Card details are not saved.
      </p>
    </form>
  )
}
