import { useEffect, useState } from 'react'
import AboutSection from '../components/AboutSection'
import ClientsSection from '../components/ClientsSection'
import HeroSection from '../components/HeroSection'
import InfrastructureAuditSection from '../components/InfrastructureAuditSection'
import NationwideSection from '../components/NationwideSection'
import PartnersStrip from '../components/PartnersStrip'
import ProductsSection from '../components/ProductsSection'
import ServicesSection from '../components/ServicesSection'
import VideoSection from '../components/VideoSection'
import { fetchHome } from '../lib/homeApi'

function Home() {
  const [homeData, setHomeData] = useState(null)

  useEffect(() => {
    let isMounted = true

    fetchHome()
      .then((data) => {
        if (isMounted) setHomeData(data)
      })
      .catch(() => {})

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <main>
      <HeroSection data={homeData} />
      <PartnersStrip data={homeData} />
      <AboutSection data={homeData} />
      <ProductsSection />
      <VideoSection data={homeData} />
      <ClientsSection data={homeData} />
      <ServicesSection data={homeData} />
      <NationwideSection data={homeData} />
      <InfrastructureAuditSection data={homeData} />
    </main>
  )
}

export default Home
