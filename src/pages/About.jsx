import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Autoplay } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import CareerPopup from '../components/CareerPopup'
import EnquiryPopup from '../components/EnquiryPopup'
import Reveal from '../components/Reveal'
import LazyMount from '../components/LazyMount'
import FadeImg from '../components/FadeImg'
import logoAlba from '../assets/about-page/embedded-0.webp'
import logoAditya from '../assets/about-page/embedded-1.png'
import logoTexecom from '../assets/about-page/embedded-2.jpg'
import logoSecurico from '../assets/about-page/embedded-3.jpg'
import logoPrinciples from '../assets/about-page/embedded-4.jpg'
import logoHouston from '../assets/about-page/embedded-5.png'
import logoHoneywell from '../assets/about-page/embedded-6.webp'
import logoBosch from '../assets/about-page/embedded-7.webp'
import logoHid from '../assets/about-page/embedded-8.webp'
import logoPrama from '../assets/about-page/embedded-9.webp'
import logoTyco from '../assets/about-page/embedded-10.png'
import heroBg from '../assets/about-page/embedded-13.webp'
import trustedImage from '../assets/about-page/embedded-14.webp'
import csrSupplies from '../assets/about-page/embedded-15.jpg'
import ctaBg from '../assets/about-page/embedded-16.webp'
import statExperience from '../assets/about-page/embedded-21.png'
import statProjects from '../assets/about-page/embedded-22.png'
import statIso from '../assets/about-page/embedded-23.png'
import statTeam from '../assets/about-page/embedded-24.png'
import statIndia from '../assets/about-page/embedded-25.png'
import statService from '../assets/about-page/embedded-26.png'
import careerImage from '../assets/about-page/embedded-29.webp'
import csrHappyKids from '../assets/csr/happy-kids.webp'
import csrPankhSchool from '../assets/csr/pankh-evening-school-3.jpg'
import { useSeoMeta } from '../hooks/useSeoMeta'

const FALLBACK_ABOUT = {
  banner_image: heroBg,
  banner_title: '15+ Years of Integration Excellence.',
  banner_description: 'Building resilient, scalable, and compliant safety architectures across India.',

  about_image: trustedImage,
  about_title: "India's Trusted Security Infrastructure Partner",
  about_description: `
    <p>Automation Systems and Solutions (India) Pvt. Ltd. (ASSIPL) is a leading system integrator specializing in electronic security &amp; safety solutions. Established in 2009, we have evolved into a premier technology-driven security infrastructure partner for the nation's most demanding sectors.</p>
    <p>We possess the financial and operational stability to execute massive multi-site rollouts. We do not just supply hardware; we deliver end-to-end systems integration. By managing the complete SITC lifecycle (Supply, Installation, Testing, and Commissioning), we ensure that complex security architectures perform flawlessly.</p>
  `.trim(),
  download_brochure: 'https://automationsystems.co.in/wp-content/uploads/2026/08/ASSIPL-WITH-VERTICAL-LOGO.pdf',

  manufacture_title: "Powered by the World's Leading Manufacturers",
  logos: [
    { logo: logoAlba, alt: 'ALBA Urmet', sort_order: 0 },
    { logo: logoBosch, alt: 'Bosch', sort_order: 1 },
    { logo: logoHoneywell, alt: 'Honeywell', sort_order: 2 },
    { logo: logoPrama, alt: 'Prama', sort_order: 3 },
    { logo: logoTyco, alt: 'Tyco', sort_order: 4 },
    { logo: logoAditya, alt: 'Aditya', sort_order: 5 },
    { logo: logoTexecom, alt: 'Texecom', sort_order: 6 },
    { logo: logoSecurico, alt: 'Securico', sort_order: 7 },
    { logo: logoPrinciples, alt: 'Principles', sort_order: 8 },
    { logo: logoHouston, alt: 'Houston', sort_order: 9 },
    { logo: logoHid, alt: 'HID', sort_order: 10 },
  ],

  features: [
    { logo: statExperience, description: '15+ Years Of Industry Experience.', sort_order: 0 },
    { logo: statProjects, description: '3000+ Projects Delivered Successfully.', sort_order: 1 },
    { logo: statIso, description: 'ISO 9001:2015 Certified Quality Management.', sort_order: 2 },
    { logo: statTeam, description: '40+ Dedicated Professional Team Members.', sort_order: 3 },
    { logo: statIndia, description: 'Pan-India Operational Reach.', sort_order: 4 },
    { logo: statService, description: '15+ Regional Service Locations.', sort_order: 5 },
  ],

  securing_title: 'Securing the Future. Empowering Communities.',
  securing_description:
    '<p>At ASSIPL, we believe that true security extends beyond corporate infrastructure; it involves protecting and uplifting the communities in which we operate. Corporate Social Responsibility is deeply rooted in our corporate values. We are committed to making a tangible, positive impact on societal well-being and environmental sustainability.</p>',
  securing_image: csrSupplies,
  securing_image_2: csrHappyKids,
  securing_image_3: csrPankhSchool,

  future_title: 'Build the Future of Enterprise Security',
  future_description:
    '<p>Join a dedicated workforce of 40+ professional team members passionate about engineering smarter security. As we continue to expand our Pan-India operations across our 15+ regional service locations, ASSIPL is actively seeking driven integration engineers, project managers, and technical specialists who thrive in high-stakes environments.</p>',
  future_image: careerImage,
}

const API_ROOT = (
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000/api'
).replace(/\/$/, '')

const BACKEND_ORIGIN = (import.meta.env.VITE_MEDIA_BASE_URL || API_ROOT.replace(/\/api$/, '')).replace(/\/$/, '')
const ABOUT_ENDPOINT = `${API_ROOT}/about`

const getMediaUrl = (value = '') => {
  const textValue = String(value || '').trim()

  if (!textValue) return ''
  if (
    textValue.startsWith('http') ||
    textValue.startsWith('blob:') ||
    textValue.startsWith('data:') ||
    textValue.startsWith('/')
  ) {
    return textValue
  }

  return `${BACKEND_ORIGIN}/${textValue}`
}

const sortByOrder = (items) =>
  (Array.isArray(items) ? items : []).slice().sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))

const hasAboutContent = (record) => {
  if (!record || typeof record !== 'object') return false

  const contentFields = [
    'banner_image',
    'banner_title',
    'banner_description',
    'about_image',
    'about_title',
    'about_description',
    'download_brochure',
    'manufacture_title',
    'securing_title',
    'securing_description',
    'securing_image',
    'future_title',
    'future_description',
    'future_image',
  ]

  return (
    contentFields.some((field) => String(record[field] || '').trim()) ||
    (Array.isArray(record.logos) && record.logos.length > 0) ||
    (Array.isArray(record.features) && record.features.length > 0)
  )
}

function ButtonLink({ children, className = '', ...props }) {
  return (
    <a
      className={`inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-8 py-2 text-[15px] font-semibold leading-[1.43] text-white transition hover:bg-secondary ${className}`}
      {...props}
    >
      {children}
    </a>
  )
}

function About() {
  const location = useLocation()
  const [about, setAbout] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCareerOpen, setIsCareerOpen] = useState(false)
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false)

  useEffect(() => {
    let isMounted = true

    const fetchAbout = async () => {
      try {
        const response = await axios.get(ABOUT_ENDPOINT)
        const data = response.data?.data
        const record = Array.isArray(data) ? data[0] : data

        if (isMounted) {
          setAbout(hasAboutContent(record) ? record : FALLBACK_ABOUT)
        }
      } catch {
        if (isMounted) {
          setAbout(FALLBACK_ABOUT)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void fetchAbout()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (!location.hash || isLoading) return

    const section = document.querySelector(location.hash)
    if (!section) return

    window.setTimeout(() => {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 0)
  }, [location.hash, isLoading])

  useSeoMeta({
    title: about?.meta_title || 'About Us | ASSIPL',
    description:
      about?.meta_description ||
      "India's trusted security infrastructure partner, delivering integrated electronic security and safety solutions since 2009.",
    keywords: about?.meta_keywords,
    ogTitle: about?.og_title,
    ogDescription: about?.og_description,
    ogImage: about?.og_image,
    robotsIndex: about?.robots_index,
    robotsFollow: about?.robots_follow,
  })

  if (isLoading) {
    return (
      <main className="flex min-h-150 items-center justify-center bg-white">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-secondary" />
      </main>
    )
  }

  if (!about) {
    return null
  }

  const logos = sortByOrder(about.logos)
  const features = sortByOrder(about.features)

  return (
    <main className="bg-white">
      <section className="relative flex min-h-88 items-center overflow-hidden px-5 pt-15 md:min-h-112 md:px-5 md:pt-15 lg:min-h-125 lg:px-0 lg:pt-10">
        <img
          src={getMediaUrl(about.banner_image)}
          alt=""
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative mx-auto w-full max-w-300">
          <Reveal className="max-w-190">
            {about.banner_title && (
              <h1 className="pt-5 text-[30px] font-bold leading-[1.12] text-white md:pt-0 md:text-[50px] lg:text-[65px]">
                {about.banner_title}
              </h1>
            )}
            {about.banner_description && (
              <p className="mt-1 max-w-190 text-justify text-[18px] font-semibold leading-[1.67] text-white md:mt-4 md:text-left">
                {about.banner_description}
              </p>
            )}
          </Reveal>
        </div>
      </section>

      {(about.about_image || about.about_title || about.about_description) && (
        <section className="px-5 pt-12 pb-0 md:py-12 lg:px-5 lg:py-22">
          <div className="mx-auto flex max-w-350 flex-col-reverse gap-12 lg:flex-row lg:items-center lg:gap-16">
            {about.about_image && (
              <Reveal className="relative min-h-64 w-full overflow-hidden rounded-3xl md:min-h-105 lg:w-1/2 lg:min-h-130">
                <img
                  src={getMediaUrl(about.about_image)}
                  alt="ASSIPL digital security infrastructure"
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </Reveal>
            )}
            <Reveal delay={150} className="w-full lg:w-1/2">
              {about.about_title && (
                <h2 className="text-[30px] font-bold leading-[1.18] text-secondary md:text-[35px] lg:text-[45px]">
                  {about.about_title}
                </h2>
              )}
              {about.about_description && (
                <div
                  className="mt-5 space-y-5 text-justify text-[18px] leading-[1.67] text-text md:text-left [&_p]:mt-5 [&_p:first-child]:mt-0"
                  dangerouslySetInnerHTML={{ __html: about.about_description }}
                />
              )}
              {about.download_brochure && (
                <ButtonLink
                  href={getMediaUrl(about.download_brochure)}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-8"
                >
                  Download Brochure
                </ButtonLink>
              )}
            </Reveal>
          </div>
        </section>
      )}

      {logos.length > 0 && (
        <section className="overflow-hidden px-5 py-12 md:pb-12 md:pt-0 lg:px-0 lg:py-20">
          {about.manufacture_title && (
            <Reveal
              as="h2"
              className="mx-auto max-w-275 text-center text-[30px] font-bold leading-[1.18] text-secondary md:text-[35px] lg:text-[45px]"
            >
              {about.manufacture_title}
            </Reveal>
          )}
          <LazyMount className="mt-8 w-full px-3 md:mt-12 md:px-5 lg:px-8">
            <Swiper
              modules={[Autoplay]}
              loop
              speed={500}
              slidesPerGroup={1}
              autoplay={{ delay: 2500, disableOnInteraction: false, pauseOnMouseEnter: true }}
              spaceBetween={56}
              slidesPerView={2}
              breakpoints={{
                768: { slidesPerView: 4, spaceBetween: 76 },
                1024: { slidesPerView: 6, spaceBetween: 120 },
              }}
            >
              {logos.map((logo, index) => (
                <SwiperSlide key={logo.id || index}>
                  <div className="mx-auto flex h-22 w-38 items-center justify-center md:w-44 lg:w-54">
                    <FadeImg
                      src={getMediaUrl(logo.logo)}
                      alt={logo.alt || 'Manufacturer partner logo'}
                      className="max-h-18 w-full object-contain"
                      loading="lazy"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </LazyMount>
        </section>
      )}

      {features.length > 0 && (
        <section className="bg-[#F8FAFC] px-5 py-12 md:px-5 md:py-12 lg:px-5 lg:py-20">
          <div className="mx-auto grid max-w-350 grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Reveal
                key={feature.id || index}
                as="article"
                delay={(index % 3) * 100}
                className={`flex min-h-68 flex-col justify-center rounded-[20px] border border-accent px-8 py-8 md:min-h-68 lg:min-h-68 ${
                  index % 2 === 0 ? 'bg-transparent' : 'bg-white'
                }`}
              >
                <div
                  className={`flex h-23 w-23 items-center justify-center rounded-full border border-accent ${
                    index % 2 === 0 ? 'bg-transparent' : 'bg-background'
                  }`}
                >
                  <img src={getMediaUrl(feature.logo)} alt="" className="h-12 w-12 object-contain" loading="lazy" />
                </div>
                <h3 className="mt-8 max-w-90 text-[24px] font-semibold leading-snug text-[#061542] md:text-center lg:text-left">
                  {feature.description}
                </h3>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {(about.securing_image || about.securing_title || about.securing_description) && (
        <section className="bg-white px-5 py-12 md:py-12 lg:px-5 lg:py-22">
          <div className="mx-auto grid max-w-350 gap-12 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-16">
            <Reveal className="max-w-170">
              {about.securing_title && (
                <h2 className="text-[30px] font-bold leading-[1.18] text-secondary md:text-[35px] lg:text-[45px]">
                  {about.securing_title}
                </h2>
              )}
              {about.securing_description && (
                <div
                  className="mt-6 text-justify text-[18px] leading-[1.67] text-text md:text-left [&_p]:mt-4 [&_p:first-child]:mt-0"
                  dangerouslySetInnerHTML={{ __html: about.securing_description }}
                />
              )}
              <Link
                to="/csr"
                className="mt-8 inline-flex min-h-14 items-center justify-center rounded-full bg-primary px-10 py-4 text-[17px] font-semibold leading-[1.43] text-white transition hover:bg-secondary"
              >
                Discover Our CSR Initiatives
              </Link>
            </Reveal>

            {about.securing_image && (
              <Reveal delay={150} className="h-full">
                <div className="grid h-full gap-4 md:grid-cols-[1.2fr_1fr]">
                  <img
                    src={getMediaUrl(about.securing_image)}
                    alt="ASSIPL CSR initiative"
                    className="h-80 w-full rounded-[18px] object-cover md:h-full"
                    loading="lazy"
                  />
                  <div className="grid gap-4 md:grid-rows-2">
                    {about.securing_image_2 && (
                      <img
                        src={getMediaUrl(about.securing_image_2)}
                        alt="ASSIPL CSR community initiative"
                        className="h-80 w-full rounded-[18px] object-cover md:h-full"
                        loading="lazy"
                      />
                    )}
                    {about.securing_image_3 && (
                      <img
                        src={getMediaUrl(about.securing_image_3)}
                        alt="ASSIPL CSR community initiative"
                        className="h-80 w-full rounded-[18px] object-cover md:h-full"
                        loading="lazy"
                      />
                    )}
                  </div>
                </div>
              </Reveal>
            )}
          </div>
        </section>
      )}

      {(about.future_image || about.future_title || about.future_description) && (
        <section id="career" className="scroll-mt-32 px-5 pb-0 md:pb-12 lg:px-5 lg:pb-22">
          <div className="mx-auto flex max-w-350 flex-col gap-8 lg:flex-row lg:items-center lg:gap-16">
            {about.future_image && (
              <Reveal className="w-full overflow-hidden rounded-3xl lg:w-1/2">
                <img
                  src={getMediaUrl(about.future_image)}
                  alt="ASSIPL careers and enterprise security team"
                  className="h-75 w-full object-cover object-center md:h-100"
                  loading="lazy"
                />
              </Reveal>
            )}
            <Reveal delay={150} className="w-full lg:w-1/2">
              {about.future_title && (
                <h2 className="text-[30px] font-bold leading-[1.18] text-secondary md:text-[35px] lg:text-[45px]">
                  {about.future_title}
                </h2>
              )}
              {about.future_description && (
                <div
                  className="mt-5 text-justify text-[18px] leading-[1.67] text-text md:text-left [&_p]:mt-4 [&_p:first-child]:mt-0"
                  dangerouslySetInnerHTML={{ __html: about.future_description }}
                />
              )}
              <button
                type="button"
                onClick={() => setIsCareerOpen(true)}
                className="mt-8 inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-8 py-2 text-[15px] font-semibold leading-[1.43] text-white transition hover:bg-secondary"
              >
                Join Our Team
              </button>
            </Reveal>
          </div>
        </section>
      )}

      <section className="px-5 pt-10 pb-12 md:px-0 md:pt-0 md:pb-0">
        <div
          className="min-h-104 overflow-hidden rounded-3xl bg-cover bg-center px-5 py-16 md:rounded-none md:px-0 md:py-20"
          style={{
            backgroundImage: `linear-gradient(rgba(18,28,69,.28),rgba(18,28,69,.28)), url(${ctaBg})`,
          }}
        >
          <Reveal className="mx-auto flex min-h-64 max-w-360 flex-col items-start justify-center gap-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-180 text-left">
              <h3 className="text-[32px] font-semibold leading-[1.125] md:text-[45px] text-white text-center md:text-left">
                Ready to Standardize Your Enterprise Infrastructure?
              </h3>
              <p className="mt-5 max-w-180 text-center text-[18px] font-normal leading-tight md:leading-[1.67] text-white md:text-left">
                Connect with our systems integration experts to discuss multi-site rollouts, vault
                security, and scalable safety architectures.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsEnquiryOpen(true)}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-10 py-4 text-[18px] font-medium capitalize leading-normal text-white transition hover:bg-secondary hover:text-white md:mr-5"
            >
              Contact Our Engineering Team
            </button>
          </Reveal>
        </div>
      </section>

      <CareerPopup isOpen={isCareerOpen} onClose={() => setIsCareerOpen(false)} />
      <EnquiryPopup isOpen={isEnquiryOpen} onClose={() => setIsEnquiryOpen(false)} />
    </main>
  )
}

export default About
