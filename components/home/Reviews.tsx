import { Star } from "lucide-react"
import { reviews } from "@/lib/hotel-info"
import { SectionHeading } from "./SectionHeading"

export function Reviews() {
  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length

  return (
    <section id="reviews" className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <SectionHeading eyebrow="Guest reviews" title="Loved by our guests" />
        <p className="mb-9 text-sm text-muted-foreground">
          <span className="font-heading text-2xl font-bold text-foreground">{avg.toFixed(1)}</span> / 5 from {reviews.length} reviews
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {reviews.map((r) => (
          <figure key={r.name} className="rounded-2xl border bg-card p-6">
            <div className="flex gap-0.5" aria-label={`${r.rating} out of 5 stars`}>
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} size={16} aria-hidden className={i < r.rating ? "fill-primary text-primary" : "text-muted-foreground/40"} />
              ))}
            </div>
            <blockquote className="mt-4 text-sm leading-6">"{r.text}"</blockquote>
            <figcaption className="mt-4 text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">{r.name}</span> · {r.stay}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
