import { Navigation } from "@/components/Navigation"
import { Hero } from "@/components/Hero"
import { Services } from "@/components/Services"
import { Industries } from "@/components/Industries"
import { WhyChooseUs } from "@/components/WhyChooseUs"
import { ApplyForm } from "@/components/ApplyForm"
import { Testimonials } from "@/components/Testimonials"
import { Contact } from "@/components/Contact"
import { Footer } from "@/components/Footer"

export function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <Hero />
        <Services />
        <Industries />
        <WhyChooseUs />
        <ApplyForm />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}
