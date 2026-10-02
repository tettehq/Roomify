"use client"
import { ErrorState } from "@/components/states/ErrorState"

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
    return <ErrorState error={error} reset={reset} title="We couldn't load your bookings" backHref="/" />
}