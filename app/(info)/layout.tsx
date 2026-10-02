import { Header } from "@/components/home/Header"
import { Footer } from "@/components/home/Footer"

export default function InfoLayout({ children } : { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-background text-foreground">
            <Header />
            <main id="main-content" className="mx-auto max-w-3x1 px-6 py-16 sm:px-8 lg-py-24">
                {children}
            </main>
            <Footer />
        </div>
    )
}