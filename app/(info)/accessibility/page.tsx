import type { Metadata } from "next"
import { PageHeading } from "@/components/info/PageHeading"
import { accessibilityFeatures, hotel } from "@/lib/hotel-info"

export const metadata: Metadata = {
  title: "Accessibility Statement",
  description: "Accessible rooms, facilities, and how Roomify supports guests with disabilities.",
}

export default function AccessibilityPage() {
    return (
        <>
            <PageHeading
                eyebrow="Accessibility"
                title="Accessibility statement"
                intro="We want every guest to book and stay with confidence. If something doesn't work for you, tell us and we'll fix it."
                updated="September 30, 2026"
            />
            <div className="space-y-12 text-sm leading-7">
                <section>
                    <h2 className="mb-4 text-lg font-semibold">At the hotel</h2>
                    <ul className="space-y-2">
                        {accessibilityFeatures.map((feature) => (
                            <li key={feature}>{feature}</li>
                        ))}
                    </ul>
                </section>
                <section>
                    <h2 className="font-heading text-xl font-bold">On our website and app</h2>
                    <p className="mt-3 text-muted-foreground">
                        The site supports keyboard navigation, screen readers,
                        text resizing, and light and dark themes.
                    </p>
                </section>
                <section>
                    <h2 className="font-heading text-xl font-bold">Known limitations</h2>
                    <p className="mt-3 text-muted-foreground">
                        While we strive to make our website and app as accessible as possible, there may be some limitations due to the nature of the content or technology used.
                    </p>
                </section>
                <section>
                    <h2 className="font-heading text-xl font-bold">Feedback</h2>
                    <p className="mt-3 text-muted-foreground">
                        If you encounter any accessibility issues or have suggestions for improvement, please contact us at {" "}
                        <a href={`mailto:${hotel.email}`} className="text-primary underline">
                            {hotel.email}
                        </a>. 
                        We respond within 2 business days.
                    </p>
                </section>
            </div>
        </>
    )
}
