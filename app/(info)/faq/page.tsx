import type { Metadata } from "next"
import Link from "next/link"
import { ChevronDown } from "lucide-react"
import { PageHeading } from "@/components/info/PageHeading"
import { faqs } from "@/lib/hotel-info"

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: "Answers about booking, your stay, payments, and getting to Roomify.",
}

export default function FaqPage() {
  const grouped = Object.groupBy(faqs, (feature) => feature.category)

  return (
    <>
      <PageHeading eyebrow="Frequently asked" title="Questions" />
      <div className="mt-8 space-y-6">
        {Object.entries(grouped).map(([category, faqs]) => (
          <div key={category} className="rounded-2xl border bg-card p-5">
            <h2 className="font-semibold">{category}</h2>
            <div className="mt-4 space-y-4">
              {faqs!.map((faq) => (
                <div key={faq.q} className="border-b border-muted pb-4 last:border-0 last:pb-0">
                  <h3 className="font-medium">{faq.q}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <p className="mt-12 text-sm text-muted-foreground">
        Still stuck? <Link href="/location" className="text-primary underline underline-offset-4">Contact us</Link>.
      </p>
    </>
  )
}