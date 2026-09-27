import { included } from "@/lib/hotel-info"
import { SectionHeading } from "./SectionHeading"

export function WhatsIncluded() {
  return (
    <section id="included" className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
      <SectionHeading eyebrow="Every stay" title="What's included" />
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {included.map(({ icon: Icon, label }) => (
          <li key={label} className="flex items-center gap-3 rounded-2xl border bg-card p-5">
            <Icon size={20} className="text-primary" aria-hidden />
            <span className="text-sm font-medium">{label}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}