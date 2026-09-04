import { useState } from 'react'
import EnquiryPopup from './EnquiryPopup'
import Reveal from './Reveal'
import heroImage from '../assets/home/hero-reference.webp'
import { getMediaUrl } from '../lib/homeApi'

const defaultStats = ['15+ Years Experience', '3000+ Projects Delivered', 'ISO 9001:2015 Certified', 'Pan-India Operations']

function HeroSection({ data }) {
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false)

  const titleLine1 = data?.hero_title_line1 || 'Automation Systems'
  const titleLine2 = data?.hero_title_line2 || 'and Solutions'
  const subtitle =
    data?.hero_subtitle || 'Integrated Security Solutions for BFSI, IT Parks, Industries, and Critical Infrastructure.'
  const stats = data?.hero_stats?.length ? data.hero_stats : defaultStats
  const ctaLabel = data?.hero_cta_label || 'Consult an Integration Expert'
  const backgroundImage = data?.hero_background_image ? getMediaUrl(data.hero_background_image) : heroImage

  return (
    <section
      id="home"
      className="relative min-h-screen overflow-hidden bg-white px-5 pt-39 pb-7.5 md:pt-37.5 md:pb-15 lg:px-0 lg:pt-47.25"
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(27, 26, 23, 0.44) 68%, rgba(255, 255, 255, 1) 100%), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="relative mx-auto w-full max-w-300">
        <Reveal
          as="h1"
          className="max-w-240.5 font-heading text-[48px] font-semibold leading-[1.05] text-white md:max-w-112.5 md:text-[68px] lg:max-w-275 lg:text-[108px]"
        >
          <span className="block">{titleLine1}</span>
          <span className="block">{titleLine2}</span>
        </Reveal>
        <Reveal
          as="p"
          delay={100}
          className="mt-7.5 w-full max-w-176.25 text-justify font-heading text-[18px] font-semibold leading-[1.4] text-white md:text-left md:text-[26px] md:leading-8.25"
        >
          {subtitle}
        </Reveal>
        <Reveal delay={150}>
          <ul className="mt-12 list-disc space-y-0 pl-5 font-body text-[17px] font-normal leading-normal text-white marker:text-white md:text-[18px] lg:text-[20px]">
            {stats.map((stat) => (
              <li key={stat}>{stat}</li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={200}>
          <button
            type="button"
            onClick={() => setIsEnquiryOpen(true)}
            className="mt-11 inline-flex h-13.75 items-center rounded-full bg-primary px-9.75 font-body text-[16px] font-medium capitalize leading-normal text-white transition hover:bg-secondary md:text-[17px] lg:text-[18px]"
          >
            {ctaLabel}
          </button>
        </Reveal>
      </div>

      <EnquiryPopup isOpen={isEnquiryOpen} onClose={() => setIsEnquiryOpen(false)} />
    </section>
  )
}

export default HeroSection
