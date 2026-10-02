"use client"

import { useEffect } from "react"
import Link from "next/link"
import error from "next/dist/api/error"

export function ErrorState({
    error,
    reset,
    title = "Something went wrong",
    backHref = "/",
    backLabel = "Go home",
}: {
    error: Error & { digest?: string }
    reset: () => void
    title?: string
    backHref?: string
    backLabel?: string
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div role="alert" className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-muted-foreground">{error.message}</p>
            <div className="flex gap-4">
                <button onClick={reset} className="rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90">
                    Try again
                </button>
                <Link href={backHref} className="rounded-lg border border-border px-4 py-2 hover:bg-muted">
                    {backLabel}
                </Link>
            </div>
        </div>
    )
}           