import { ChevronRight } from 'lucide-react'
import Reveal from '../components/Reveal'
import heroBackground from '../assets/services/occm-hero.webp'
import contactBackground from '../assets/services/occm-contact-bg.webp'
import ctaBackground from '../assets/services/occm-cta-bg.webp'
import mainImage from '../assets/services/occm-main.webp'
import comprehensiveImage from '../assets/services/occm-amc-comprehensive.webp'
import nonComprehensiveImage from '../assets/services/occm-amc-non-comprehensive.webp'

const serviceLinks = [
  { title: 'Strategic Planning & Design', href: '#' },
  { title: 'Core Project Execution (SITC)', href: '#' },
  { title: 'Operational Continuity & Maintenance', href: '/services/operational-continuity-maintenance' },
]

const advantages = [
  {
    title: 'Pan-India Rapid Response',
    tone: 'white',
    text: 'With 15+ regional service locations, our field engineers are positioned to deliver rapid on-site interventions across the country, ensuring your remote branches are never left vulnerable.',
  },
  {
    title: 'OEM-Certified Expertise',
    tone: 'muted',
    text: 'Our technicians are factory-trained directly by our global technology partners (Bosch, Honeywell, HID). We diagnose complex software and hardware issues faster and more accurately than third-party generalists.',
  },
  {
    title: 'ISO 9001:2015 Rigor',
    tone: 'muted',
    text: 'Every service call, diagnostic test, and maintenance routine is governed by strict ISO-certified quality management processes, ensuring uniform service standards at every facility.',
  },
  {
    title: 'Dedicated SLA Compliance',
    tone: 'white',
    text: 'We operate under strict Service Level Agreements (SLAs) with clear escalation matrices. When you log a critical fault, our response is guaranteed, measured, and immediate.',
  },
]

const amcPlans = [
  {
    title: 'Comprehensive AMC (Total Peace of Mind)',
    image: comprehensiveImage,
    points: [
      {
        label: 'Full Hardware Coverage',
        text: 'Includes the cost of all spare parts, component repairs, and total hardware replacements in the event of a failure.',
      },
      {
        label: 'Zero Hidden Costs',
        text: 'One fixed annual fee covers everything, protecting your enterprise from sudden, unbudgeted capital expenditures (CAPEX).',
      },
      {
        label: 'Priority Labor & Dispatch',
        text: 'Unlimited emergency breakdown visits and highly prioritized field engineer dispatches.',
      },
      {
        label: 'Ideal For',
        text: 'Banking Currency Chests, Data Centres, Corporate Headquarters, and high-security vaults where continuous operation is non-negotiable.',
      },
    ],
  },
  {
    title: 'Non-Comprehensive AMC (Flexible & Preventative)',
    image: nonComprehensiveImage,
    points: [
      {
        label: 'Expert Labor Covered',
        text: 'Covers all service charges, technician labor, and routine preventative maintenance visits.',
      },
      {
        label: 'Parts Billed at Actuals',
        text: 'In the event of a hardware failure, spare parts and component replacements are quoted and billed separately as needed.',
      },
      {
        label: 'Scheduled Health Checks',
        text: 'Includes the same rigorous system calibrations, software updates, and diagnostic checks as our comprehensive model.',
      },
      {
        label: 'Ideal For',
        text: 'Newly deployed systems still under OEM warranty, multi-tenant commercial real estate, or enterprises with flexible operational maintenance budgets.',
      },
    ],
  },
]

const checklistPoints = [
  {
    label: 'Physical Audits',
    text: 'Detailed cleaning of camera lenses, housing checks for environmental damage, and inspection of all low-voltage structural cabling.',
  },
  {
    label: 'Software & Firmware',
    text: 'Execution of critical OEM firmware updates to patch cybersecurity vulnerabilities and optimize system speed.',
  },
  {
    label: 'Calibration Testing',
    text: 'Re-aligning access control readers, testing fire alarm panel trigger responses, and verifying camera focus fields.',
  },
  {
    label: 'System Backups',
    text: 'Verifying that your Command Centre DVR/NVR storage drives are healthy and archiving data correctly without corruption.',
  },
]

function ServiceSidebar({ className = '' }) {
  return (
    <aside className={`grid gap-12 md:grid-cols-2 lg:grid-cols-1 lg:sticky lg:top-12 lg:self-start ${className}`}>
      <Reveal className="overflow-hidden rounded-3xl border border-border bg-white px-5 py-8">
        <nav aria-label="Services">
          <ul className="space-y-2">
            {serviceLinks.map((link) => {
              const isActive = link.title === 'Operational Continuity & Maintenance'

              return (
                <li key={link.title}>
                  <a
                    href={link.href}
                    className={`block rounded-xl px-2 py-3 text-lg transition ${
                      isActive
                        ? 'bg-secondary text-white'
                        : 'text-secondary hover:bg-secondary hover:text-white'
                    }`}
                  >
                    {link.title}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>
      </Reveal>

      <Reveal
        delay={100}
        className="relative isolate flex h-125 flex-col items-center overflow-hidden rounded-2xl px-6 pb-8 pt-10 text-center text-white"
      >
        <img
          src={contactBackground}
          alt=""
          className="absolute inset-0 -z-20 h-full w-full object-cover grayscale"
        />
        <div className="absolute inset-0 -z-10 bg-linear-to-t from-black via-black/50 to-black/0" />

        <div className="mt-auto">
          <h3 className="text-[28px] font-semibold leading-tight text-white">Get in Touch</h3>
          <div className="mx-auto my-4 h-px w-12 bg-white/50" />
          <div className="space-y-1 text-[15px] leading-7 text-white">
            <a href="mailto:assipl@automationsystems.co.in" className="block">
              assipl@automationsystems.co.in
            </a>
            <a href="tel:08041692300" className="block">
              080 – 41692300 / 080 – 43751024
            </a>
          </div>
          <a
            href="#"
            className="mt-6 inline-flex rounded-full bg-primary px-8 py-2 text-sm font-semibold text-white transition hover:bg-secondary"
          >
            Enquiry Now
          </a>
        </div>
      </Reveal>
    </aside>
  )
}

function AdvantageCard({ item }) {
  return (
    <article
      className={`flex h-full flex-col rounded-[10px] border border-accent px-8 py-12 transition-[background-color,transform] duration-300 hover:scale-[1.02] ${
        item.tone === 'white' ? 'bg-white hover:bg-background' : 'bg-background hover:bg-white'
      }`}
    >
      <h3 className="text-[24px] font-semibold leading-tight text-secondary">{item.title}</h3>
      <p className="mt-5 text-[16px] leading-7 text-text">{item.text}</p>
    </article>
  )
}

function AmcPlan({ plan }) {
  return (
    <article className="h-full rounded-2xl border border-accent bg-white p-6">
      <img src={plan.image} alt="" className="h-56 w-full rounded-xl object-cover" />
      <h2 className="pt-5 text-[26px] font-semibold leading-tight text-secondary">{plan.title}</h2>
      <ul className="mt-4 list-disc space-y-3 pl-5 text-[16px] leading-7 text-text">
        {plan.points.map((point) => (
          <li key={point.label}>
            <strong className="text-secondary">{point.label}:</strong> {point.text}
          </li>
        ))}
      </ul>
    </article>
  )
}

function SingleService() {
  return (
    <main className="bg-white">
      <section
        className="relative flex min-h-100 items-start bg-cover bg-center px-5 pt-48 sm:px-10 md:min-h-125 md:px-8 md:pt-60 xl:px-60 xl:pt-52"
        style={{
          backgroundImage: `linear-gradient(rgba(18, 28, 69, 0.3), rgba(18, 28, 69, 0.3)), url(${heroBackground})`,
        }}
      >
        <div className="mx-auto w-full max-w-350">
          <div className="mb-4 flex items-center gap-3 text-base font-medium text-white md:text-xl">
            <a href="/" className="transition hover:text-primary">
              Home
            </a>
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
            <a href="/services" className="transition hover:text-primary">
              Services
            </a>
          </div>
          <Reveal
            as="h1"
            className="-ml-1 font-heading text-[32px] font-semibold leading-tight text-white sm:text-[40px] md:text-[52px] xl:text-[70px] xl:leading-none"
          >
            Operational Continuity & Maintenance
          </Reveal>
        </div>
      </section>

      <section className="mx-auto grid max-w-350 gap-8 px-5 py-20 lg:grid-cols-[25%_1fr]">
        <ServiceSidebar className="order-2 lg:order-1" />

        <article className="order-1 lg:order-2">
          <Reveal as="img"
            src={mainImage}
            alt="Technician monitoring maintenance status on a tablet"
            className="h-125 w-full object-cover max-md:h-75 rounded-2xl"
          />

          <Reveal as="h1" className="pt-5 text-[46px] font-semibold leading-tight text-secondary max-md:text-[32px]">
            Operational Continuity & Maintenance
          </Reveal>
          <Reveal as="h2" className="py-2 text-[18px] font-semibold leading-[1.4] text-black">
            Maximizing system uptime and protecting your technological investments with customized
            Annual Maintenance Contracts (AMC).
          </Reveal>
          <Reveal as="p" className="text-[16px] leading-8 text-text">
            Enterprise security is not a one-time installation; it is a continuous operational
            mandate. A security system is only as reliable as its maintenance. Once your
            architecture is commissioned, ASSIPL remains your dedicated partner to guarantee
            maximum uptime, strict regulatory compliance, and sustained performance. We don't just
            fix breakdowns—we prevent them.
          </Reveal>

          <Reveal
            as="h2"
            className="pt-12 text-[46px] font-semibold leading-tight text-secondary max-md:text-[32px]"
          >
            The ASSIPL Maintenance Advantage
          </Reveal>
          <Reveal as="p" className="text-[16px] leading-8 text-text">
            Why do India's top financial institutions and commercial enterprises trust ASSIPL with
            their post-sales maintenance? Because we deliver accountability at scale.
          </Reveal>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {advantages.slice(0, 2).map((item, index) => (
              <Reveal key={item.title} delay={index * 100}>
                <AdvantageCard item={item} />
              </Reveal>
            ))}
          </div>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            {advantages.slice(2).map((item, index) => (
              <Reveal key={item.title} delay={index * 100}>
                <AdvantageCard item={item} />
              </Reveal>
            ))}
          </div>

          <Reveal
            as="h2"
            className="pt-12 text-[46px] font-semibold leading-tight text-secondary max-md:text-[32px]"
          >
            Flexible AMC Models Built for Enterprise
          </Reveal>
          <Reveal as="p" className="text-[16px] leading-8 text-text">
            We understand that different facilities require different financial and operational
            strategies. ASSIPL offers highly structured maintenance contracts to align perfectly
            with your corporate OPEX budgets and risk profiles.
          </Reveal>

          <div className="mt-8 grid gap-8 md:grid-cols-2">
            {amcPlans.map((plan, index) => (
              <Reveal key={plan.title} delay={index * 100}>
                <AmcPlan plan={plan} />
              </Reveal>
            ))}
          </div>

          <Reveal
            as="h2"
            className="pt-12 text-[46px] font-semibold leading-tight text-secondary max-md:text-[32px]"
          >
            Our Preventative Maintenance Checklist
          </Reveal>
          <ul className="mt-4 list-disc space-y-3 pl-5 text-[16px] leading-7 text-text">
            {checklistPoints.map((point) => (
              <Reveal as="li" key={point.label}>
                <strong className="text-secondary">{point.label}:</strong> {point.text}
              </Reveal>
            ))}
          </ul>

          <Reveal
            className="relative mt-12 isolate flex flex-col items-start gap-6 overflow-hidden rounded-2xl px-10 py-12 text-white"
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.35)), url(${ctaBackground})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="max-w-140">
              <h3 className="text-[44px] font-semibold leading-tight text-white">
                Secure Your Operational Continuity
              </h3>
              <p className="mt-3 text-[16px] leading-7 text-white/90">
                Do not wait for a critical system failure. Contact our support specialists today to
                audit your current infrastructure and design a tailored AMC program.
              </p>
            </div>
            <a
              href="#"
              className="inline-flex flex-none items-center gap-2 rounded-full bg-primary px-8 py-3 text-sm font-semibold text-white transition hover:bg-secondary"
            >
              Request an AMC Consultation
            </a>
          </Reveal>
        </article>
      </section>
    </main>
  )
}

export default SingleService
