import { Footer } from "@/components/home/Footer"
import { Header } from "@/components/home/Header"

export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main
        id="main-content"
        className="mx-auto min-h-[70vh] max-w-7xl animate-pulse px-5 py-14 sm:px-8"
      >
        <div className="h-4 w-24 rounded bg-border" />
        <div className="mt-6 h-10 w-72 rounded bg-border" />
        <div className="mt-8 h-24 rounded-2xl bg-card shadow-sm" />
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {[0, 1, 2].map((item) => (
            <div key={item} className="h-96 rounded-2xl bg-card shadow-sm" />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  )
}
