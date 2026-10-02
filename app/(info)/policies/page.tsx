import type { Metadata } from "next"
import Link from "next/link"
import { PageHeading } from "@/components/info/PageHeading"
import { cancellationRules, paymentInfo, hotel } from "@/lib/hotel-info"

export const metadata: Metadata = {
    title: "Cancellation & Payment Policy",
    description: "Free cancellation up to 48 hours before check-in. How and when you're charged."
}

export default function PoliciesPage() {
    return (
        <>
            <PageHeading eyebrow="Policies" title="Cancellation & Payment" updated="September 30, 2026" />

            <section id="cancellaiton" className="scroll-mt-24">
                <h2 className="font-heading text-2xl font-bold">Cancellation</h2>
                <table className="mt-5 w-full overflow-hidden rounded-2x1 border text-sm">
                    <thead className="bg-muted text-left">
                        <tr>
                            <th className="p-4">If you cancel</th>
                            <th className="p-4">You're charged</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {cancellationRules.map((r) => (
                            <tr key={r.when}>
                                <td className="p-4">{r.when}</td>
                                <td className="p-4 font-semibold">{r.outcome}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                Times are based on the hotel's local time and a {hotel.checkIn} check-in. Cancel anytime from your {" "}
                <Link href="/booking" className="text-primary underline underline-offset-4">Bookings</Link> page.
                </p>
            </section>
            <section id="payment" className="mt-16 scroll-mt-24">
                <h2 className="font-heading text-2xl font-bold">Payment</h2>
                <h3 className="mt-6 font-semibold">Accepted methods</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-muted-foreground">
                    {paymentInfo.methods.map((m) => <li key={m}>{m}</li>)}
                </ul>
                <h3 className="mt-6 font-semibold">When you're charged</h3>
                <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm leading-6 text-muted-foreground">
                    {paymentInfo.steps.map((s) => <li key={s}>{s}</li>)}
                </ol>
            </section>
        </>
    )
}