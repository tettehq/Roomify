"use client"

import "./globals.css"
import { ErrorState } from "@/components/states/ErrorState"

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
    return <ErrorState error={error} reset={reset} title="Something went wrong" backHref="/" />
}