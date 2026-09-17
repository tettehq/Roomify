import Link from "next/link"
import { ArrowRight, Leaf, ShieldCheck, Sparkles } from "lucide-react"
import { BookingSearch } from "@/components/home/BookingSearch"
import { Footer } from "@/components/home/Footer"
import { Header } from "@/components/home/Header"
import { RoomCard } from "@/components/home/RoomCard"
import { featuredRooms } from "@/components/home/data"

export default function Page() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#faf9f6] text-[#0f172a]">
      <Header />
      <main>
        <section className="relative overflow-hidden bg-[#f1f5ee]">
          <div className="mx-auto grid min-h-[545px] max-w-7xl items-center gap-10 px-5 pt-16 pb-20 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:pt-24 lg:pb-28">
            <div className="relative z-10 max-w-xl">
              <p className="mb-5 flex items-center gap-2 text-xs font-bold tracking-[0.18em] text-[#ba6548] uppercase">
                <Sparkles size={15} /> Stay somewhere meaningful
              </p>
              <h1 className="font-heading text-[clamp(2.7rem,6vw,4.8rem)] leading-[1.04] font-bold tracking-[-0.065em] text-[#163e2e]">
                Make room for <span className="text-[#ba6548]">better</span>{" "}
                moments.
              </h1>
              <p className="mt-6 max-w-md text-base leading-7 text-[#52655b]">
                Thoughtfully chosen rooms, warm service, and the quiet details
                that turn a night away into a stay worth remembering.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="#rooms"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#1b4332] px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#2d6a4f]"
                >
                  Explore rooms <ArrowRight size={17} />
                </Link>
                <Link
                  href="#experience"
                  className="text-sm font-semibold text-[#2d6a4f] underline decoration-[#ba6548]/50 underline-offset-4 hover:text-[#1b4332]"
                >
                  Why Roomify?
                </Link>
              </div>
            </div>
            <div className="relative mx-auto w-full max-w-[620px] lg:mr-0">
              <div className="absolute -top-10 -right-10 h-36 w-36 rounded-full bg-[#d8f3dc] blur-2xl" />
              <div className="relative aspect-[1.12] overflow-hidden rounded-[2rem] rounded-bl-[5rem] shadow-[0_24px_50px_rgba(27,67,50,0.18)]">
                <div
                  className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=85')] bg-cover bg-center"
                  role="img"
                  aria-label="Sunlit boutique hotel room with natural textures"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0c2b1d]/35 to-transparent" />
                <div className="absolute bottom-5 left-5 flex items-center gap-3 rounded-xl bg-white/90 px-4 py-3 backdrop-blur">
                  <Leaf size={18} className="text-[#2d6a4f]" />
                  <span className="text-xs font-semibold text-[#163e2e]">
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
              <p className="text-xs font-bold tracking-[0.18em] text-[#ba6548] uppercase">
                Handpicked for you
              </p>
              <h2 className="mt-2 font-heading text-3xl font-bold tracking-[-0.04em] text-[#163e2e]">
                Find your kind of room
              </h2>
            </div>
            <Link
              href="/rooms"
              className="flex items-center gap-2 text-sm font-semibold text-[#2d6a4f]"
            >
              View all rooms <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {featuredRooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        </section>
        <section id="experience" className="bg-[#1b4332] text-white">
          <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:px-8 md:grid-cols-[0.9fr_1.1fr] md:items-center md:py-20">
            <div>
              <p className="text-xs font-bold tracking-[0.18em] text-[#a5d0b9] uppercase">
                The Roomify difference
              </p>
              <h2 className="mt-3 max-w-md font-heading text-3xl font-bold tracking-[-0.04em] sm:text-4xl">
                Hospitality that feels personal.
              </h2>
              <p className="mt-5 max-w-md text-sm leading-7 text-[#d2e4d8]">
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
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <span className="text-[#a5d0b9]">{icon}</span>
      <h3 className="mt-4 font-heading text-base font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[#bcd4c5]">{text}</p>
    </div>
  )
}
