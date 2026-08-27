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
import { useSeoMeta } from '../hooks/useSeoMeta'

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

  useSeoMeta({
    title: homeData?.meta_title || 'Automation Systems and Solutions | ASSIPL',
    description:
      homeData?.meta_description ||
      'Integrated Security Solutions for BFSI, IT Parks, Industries, and Critical Infrastructure.',
    keywords: homeData?.meta_keywords,
    ogTitle: homeData?.og_title,
    ogDescription: homeData?.og_description,
    ogImage: homeData?.og_image,
    robotsIndex: homeData?.robots_index,
    robotsFollow: homeData?.robots_follow,
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Automation Systems and Solutions (India) Pvt. Ltd.',
      alternateName: 'ASSIPL',
      url: window.location.origin,
      logo: `${window.location.origin}/favicon.webp`,
    },
  })

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
