import Link from "next/link"
import { Clock } from "lucide-react"
import { hotel, policies } from "@/lib/hotel-info"
import { SectionHeading } from "./SectionHeading"

export function StayInfo() {
    return (
        <section id="policies" className="bg-muted">
            <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
                <SectionHeading eyebrow="Good to know" title="Your stay, at a glance" />
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-2xl bg-card p-6">
                        <Clock className="text-primary" aria-hidden />
                        <dl className="mt-4 space-y-2 text-sm">
                            <div className="flex justify-between"><dt className="text-muted-foreground">Check-in</dt><dd className="font-semibold">from {hotel.checkIn}</dd></div>
                            <div className="flex justify-between"><dt className="text-muted-foreground">Check-out</dt><dd className="font-semibold">by {hotel.checkOut}</dd></div>
                        </dl>
                    </div>
                    {policies.map((p) => (
                        <div key={p.title} className="flex flex-col rounded-2xl bg-card p-6">
                            <h3 className="font-heading text-base font-semibold">{p.title}</h3>
                            <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">{p.text}</p>
                            <Link href={p.href} className="mt-4 text-sm font-semibold text-primary underline underline-offset-4">
                                Read full {p.title.toLowerCase()} policy
                            </Link>
                        </div>
                    ))}
                </div>
            </div>  
        </section>
    )
}