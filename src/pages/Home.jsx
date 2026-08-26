import AboutSection from '../components/AboutSection'
import ClientsSection from '../components/ClientsSection'
import HeroSection from '../components/HeroSection'
import InfrastructureAuditSection from '../components/InfrastructureAuditSection'
import NationwideSection from '../components/NationwideSection'
import PartnersStrip from '../components/PartnersStrip'
import ProductsSection from '../components/ProductsSection'
import ServicesSection from '../components/ServicesSection'
import VideoSection from '../components/VideoSection'

function Home() {
  return (
    <main>
      <HeroSection />
      <PartnersStrip />
      <AboutSection />
      <ProductsSection />
      <VideoSection />
      <ClientsSection />
      <ServicesSection />
      <NationwideSection />
      <InfrastructureAuditSection />
    </main>
  )
}

export default Home
