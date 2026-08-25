import { ArrowRight, ChevronRight, Mail, Phone } from 'lucide-react'
import Reveal from '../components/Reveal'
import heroBackground from '../assets/products/video-surveillance-bg-2.webp'
import contactBackground from '../assets/products/video-surveillance-bg-3.webp'
import productImage from '../assets/products/video-surveillance-1.webp'
import bankImage from '../assets/products/video-surveillance-2.webp'
import commercialImage from '../assets/products/video-surveillance-3.webp'
import manufacturingImage from '../assets/products/video-surveillance-4.webp'
import infrastructureImage from '../assets/products/video-surveillance-5.webp'

const productLinks = [
  'Video Surveillance',
  'Access Control',
  'Fire Detection System',
  'Intrusion Detection Systems',
  'Gate Automation & Control Barriers',
  'Gas Suppression Systems',
]

const capabilities = [
  {
    title: 'IP CCTV Surveillance',
    tone: 'white',
    points: [
      'Delivers high-definition video feeds for comprehensive indoor and outdoor oversight.',
      'Features STQC-certified IP CCTV cameras with robust system control to ensure absolute compliance and network security.',
      'Secures high-stakes environments, including commercial hubs and restricted banking vaults.',
    ],
  },
  {
    title: 'Intelligent Video Analytics',
    tone: 'muted',
    points: [
      'Distinguishes objects and patterns within a frame to significantly reduce false alarms.',
      'Detects the slightest physical movements using precision motion tracking and geofencing.',
      'Implements Internet of Things integrations to improve overall operational efficiency.',
    ],
  },
  {
    title: 'AI Facial Recognition',
    tone: 'muted',
    points: [
      'Utilizes advanced algorithmic systems for automated target tracking and identification.',
      'Provides highly secure, touchless access verification at critical corporate entry points.',
    ],
  },
  {
    title: 'Command & Control Centre Integration',
    tone: 'white',
    points: [
      'Centralizes real-time visual information for complete situational awareness during critical events.',
      'Streamlines incident management through integrated functionality and video wall management.',
    ],
  },
]

const useCases = [
  {
    title: 'Bank Branches & Currency Chests',
    image: bankImage,
  },
  {
    title: 'Commercial Real Estate',
    image: commercialImage,
  },
  {
    title: 'Sprawling Manufacturing Facilities',
    image: manufacturingImage,
  },
  {
    title: 'Critical Infrastructure',
    image: infrastructureImage,
  },
]

function ProductSidebar() {
  return (
    <aside className="grid gap-12 lg:sticky lg:top-12 lg:self-start">
      <div className="overflow-hidden rounded-3xl border border-border bg-white px-5 py-8">
        <nav aria-label="Products">
          <ul className="space-y-2">
            {productLinks.map((link) => {
              const isActive = link === 'Video Surveillance'

              return (
                <li key={link}>
                  <a
                    href={isActive ? '/products/video-surveillance' : '#'}
                    className={`block rounded-xl px-5 py-3 text-[15px] font-medium transition ${
                      isActive
                        ? 'bg-primary text-white'
                        : 'text-secondary hover:bg-background hover:text-primary'
                    }`}
                  >
                    {link}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>

      <div
        className="overflow-hidden rounded-[10px] bg-cover bg-center px-6 pb-5 pt-36 text-white"
        style={{
          backgroundImage: `linear-gradient(rgba(18, 28, 69, 0.35), rgba(18, 28, 69, 0.62)), url(${contactBackground})`,
        }}
      >
        <h3 className="text-[28px] font-semibold leading-tight text-white">Get in Touch</h3>
        <div className="my-5 h-px w-full bg-white/50" />
        <div className="space-y-3 text-[15px] leading-7 text-white">
          <a href="mailto:assipl@automationsystems.co.in" className="flex items-start gap-3">
            <Mail className="mt-1 h-4 w-4 flex-none" aria-hidden="true" />
            assipl@automationsystems.co.in
          </a>
          <a href="tel:08041692300" className="flex items-start gap-3">
            <Phone className="mt-1 h-4 w-4 flex-none" aria-hidden="true" />
            080 - 41692300 / 080 - 43751024
          </a>
        </div>
        <a
          href="#"
          className="mt-6 inline-flex rounded-full bg-primary px-8 py-2 text-sm font-semibold text-white transition hover:bg-secondary"
        >
          Enquiry Now
        </a>
      </div>
    </aside>
  )
}

function CapabilityCard({ item }) {
  return (
    <article
      className={`group rounded-[10px] border border-border px-8 py-12 transition duration-300 hover:scale-[1.02] ${
        item.tone === 'white' ? 'bg-white hover:bg-primary' : 'bg-background hover:bg-white'
      }`}
    >
      <h3 className="text-[24px] font-semibold leading-tight text-secondary group-hover:text-white">
        {item.title}
      </h3>
      <ul className="mt-5 list-disc space-y-3 pl-5 text-[16px] leading-7 text-text group-hover:text-white">
        {item.points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
    </article>
  )
}

function SingleProduct() {
  return (
    <main className="bg-white">
      <section
        className="relative flex min-h-125 items-end bg-cover bg-center px-5 pb-16 pt-40"
        style={{
          backgroundImage: `linear-gradient(rgba(18, 28, 69, 0.3), rgba(18, 28, 69, 0.3)), url(${heroBackground})`,
        }}
      >
        <div className="mx-auto w-full max-w-350">
          <div className="mb-4 flex items-center gap-3 text-[15px] font-medium text-white">
            <a href="/" className="transition hover:text-primary">
              Home
            </a>
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
            <a href="/products/video-surveillance" className="transition hover:text-primary">
              Products
            </a>
          </div>
          <Reveal
            as="h1"
            className="-ml-1 font-heading text-[70px] font-bold leading-none text-white max-md:text-[45px]"
          >
            Video Surveillance
          </Reveal>
        </div>
      </section>

      <section className="mx-auto grid max-w-350 gap-8 px-5 py-20 lg:grid-cols-[25%_1fr]">
        <Reveal>
          <ProductSidebar />
        </Reveal>

        <article>
          <Reveal as="img"
            src={productImage}
            alt="CCTV camera monitoring a commercial building"
            className="h-125 w-full object-cover max-md:h-75"
          />

          <Reveal as="h2" className="pt-5 text-[46px] font-semibold leading-tight text-secondary max-md:text-[32px]">
            Enterprise IP Video Surveillance Solutions
          </Reveal>
          <Reveal as="h3" className="py-2 text-[18px] font-semibold leading-[1.4] text-secondary/80">
            High-definition visual monitoring paired with intelligent analytics to secure your most
            critical environments.
          </Reveal>
          <Reveal as="p" className="text-[16px] leading-8 text-text">
            Total situational awareness requires more than passive recording. ASSIPL deploys
            advanced IP camera networks featuring robust system control, reducing false alarms, and
            enhancing investigation efficiency while ensuring compliance with stringent
            cybersecurity protocols.
          </Reveal>

          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {capabilities.slice(0, 2).map((item, index) => (
              <Reveal key={item.title} delay={index * 100}>
                <CapabilityCard item={item} />
              </Reveal>
            ))}
          </div>
          <div className="mt-5 grid gap-5 md:grid-cols-2 md:[direction:rtl]">
            {capabilities.slice(2).map((item, index) => (
              <Reveal key={item.title} className="[direction:ltr]" delay={index * 100}>
                <CapabilityCard item={item} />
              </Reveal>
            ))}
          </div>

          <div className="mt-8">
            <Reveal as="h2" className="text-[46px] font-semibold leading-tight text-secondary max-md:text-[32px]">
              Most commonly used in
            </Reveal>
          </div>

          <div className="mt-8 grid gap-0 md:grid-cols-4">
            {useCases.map((useCase, index) => (
              <Reveal
                as="article"
                key={useCase.title}
                delay={index * 100}
                className={`px-2 first:pl-0 last:pr-0 ${
                  index < useCases.length - 1 ? 'border-r border-border' : ''
                } max-md:border-r-0 max-md:border-b max-md:py-4`}
              >
                <img src={useCase.image} alt="" className="h-38 w-full object-cover" />
                <h3 className="pt-4 text-center text-[18px] font-semibold leading-snug text-secondary">
                  {useCase.title}
                </h3>
              </Reveal>
            ))}
          </div>

          <Reveal
            as="a"
            href="#"
            className="mt-12 inline-flex items-center gap-2 rounded-full bg-primary px-8 py-2 text-sm font-semibold text-white transition hover:bg-secondary"
          >
            Enquiry Now
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Reveal>
        </article>
      </section>
    </main>
  )
}

export default SingleProduct
