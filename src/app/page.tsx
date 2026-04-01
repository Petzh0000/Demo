import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/sections/HeroSection'
import AboutSection from '@/components/sections/AboutSection'
import ProductsSection from '@/components/sections/ProductsSection'
import TestimonialsSection from '@/components/sections/TestimonialsSection'
import NewsSection from '@/components/sections/NewsSection'
import CTASection from '@/components/sections/CTASection'

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <HeroSection />
      <AboutSection />
      <ProductsSection />
      <TestimonialsSection />
      <NewsSection />
      <CTASection />
      <Footer />
    </main>
  )
}
