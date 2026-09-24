import { LinkButton } from "@/components/ui/link-button"
import Link from "next/link"
import { ArrowRight, Leaf, ShieldCheck, Sparkles } from "lucide-react"
import { BookingSearch } from "@/components/home/BookingSearch"
import { Footer } from "@/components/home/Footer"
import { Header } from "@/components/home/Header"
import { Suspense } from "react"
import { FeaturedRooms, RoomMessage } from "@/components/home/FeaturedRooms"

export default function Page() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">
      <Header />
      <main id="main-content">
        <section className="relative overflow-hidden bg-muted">
          <div className="mx-auto grid min-h-[545px] max-w-7xl items-center gap-10 px-5 pt-16 pb-20 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:pt-24 lg:pb-28">
            <div className="relative z-10 max-w-xl">
              <p className="mb-5 flex items-center gap-2 text-xs font-bold tracking-[0.18em] text-muted-foreground uppercase">
                <Sparkles size={15} /> Stay somewhere meaningful
              </p>
              <h1 className="font-heading text-[clamp(2.7rem,6vw,4.8rem)] leading-[1.04] font-bold tracking-[-0.065em] text-foreground">
                Make room for{" "}
                <span className="text-muted-foreground">better</span> moments.
              </h1>
              <p className="mt-6 max-w-md text-base leading-7 text-muted-foreground">
                Thoughtfully chosen rooms, warm service, and the quiet details
                that turn a night away into a stay worth remembering.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <LinkButton href="#rooms" variant="default" className="">
                  Explore rooms <ArrowRight size={17} />
                </LinkButton>
                <Link
                  href="#experience"
                  className="text-sm font-semibold text-primary underline decoration-muted-foreground/50 underline-offset-4 hover:text-primary"
                >
                  Why Roomify?
                </Link>
              </div>
            </div>
            <div className="relative mx-auto w-full max-w-[620px] lg:mr-0">
              <div className="absolute -top-10 -right-10 h-36 w-36 rounded-full bg-accent blur-2xl" />
              <div className="relative aspect-[1.12] overflow-hidden rounded-[2rem] rounded-bl-[5rem] shadow-sm">
                <div
                  className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=85')] bg-cover bg-center"
                  role="img"
                  aria-label="Sunlit boutique hotel room with natural textures"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c2b1d]/35 to-transparent" />
                <div className="absolute bottom-5 left-5 flex items-center gap-3 rounded-xl bg-card/90 px-4 py-3 backdrop-blur">
                  <Leaf size={18} className="text-primary" />
                  <span className="text-xs font-semibold text-foreground">
                    A softer way to travel
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
        <BookingSearch />
        <section id="rooms" className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
          <div className="mb-9 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold tracking-[0.18em] text-muted-foreground uppercase">
                Handpicked for you
              </p>
              <h2 className="mt-2 font-heading text-3xl font-bold tracking-[-0.04em] text-foreground">
                Find your kind of room
              </h2>
            </div>
            <Link
              href="/rooms"
              className="flex items-center gap-2 text-sm font-semibold text-primary"
            >
              View all rooms <ArrowRight size={16} />
            </Link>
          </div>
          <Suspense fallback={<RoomMessage>Loading rooms…</RoomMessage>}>
            <FeaturedRooms />
          </Suspense>
        </section>
        <section id="experience" className="bg-primary text-primary-foreground">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 md:grid-cols-[0.9fr_1.1fr] md:items-center md:py-20">
            <div>
              <p className="text-xs font-bold tracking-[0.18em] text-primary-foreground/80 uppercase">
                The Roomify difference
              </p>
              <h2 className="mt-3 max-w-md font-heading text-3xl font-bold tracking-[-0.04em] sm:text-4xl">
                Hospitality that feels personal.
              </h2>
              <p className="mt-5 max-w-md text-sm leading-7 text-primary-foreground/80">
                From the first search to the final goodnight, every part of your
                stay is designed to feel clear, calm, and cared for.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <Feature
                icon={<Leaf />}
                title="Considered spaces"
                text="Rooms with character and comfort."
              />
              <Feature
                icon={<ShieldCheck />}
                title="Easy, secure stays"
                text="Simple booking with peace of mind."
              />
              <Feature
                icon={<Sparkles />}
                title="Warm details"
                text="The little things matter here."
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

function Feature({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode
  title: string
  text: string
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-card/5 p-5">
      <span className="text-primary-foreground/80">{icon}</span>
      <h3 className="mt-4 font-heading text-base font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-primary-foreground/80">
        {text}
      </p>
    </div>
  )
}
