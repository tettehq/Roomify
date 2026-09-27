import { ChevronDown } from "lucide-react"
import { faqs } from "@/lib/hotel-info"
import { SectionHeading } from "./SectionHeading"

export function Faq() {
    return (
        <section id="faq" className="mx-auto max-w-3xl px-5 py-20 sm:px-8">
            <SectionHeading eyebrow="Questions" title="Frequently asked" />
            <div className="divide-y rounded-2xl border bg-card">
                {faqs.map((f) => (
                <details key={f.q} className="group p-5">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold">
                    {f.q}
                    <ChevronDown size={18} aria-hidden className="shrink-0 transition-transform group-open:rotate-180" />
                    </summary>
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">{f.a}</p>
                </details>
                ))}
            </div>
        </section>     
    )
}