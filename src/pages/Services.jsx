import heroBg from '../assets/services/service-hero-bg.webp'
import strategicBg from '../assets/services/strategic-bg.webp'
import ctaBg from '../assets/services/cta-bg.webp'
import formIcon from '../assets/services/form.png'
import planningIcon from '../assets/services/planning.png'
import supplyIcon from '../assets/services/supply.png'
import installationIcon from '../assets/services/easy-installation.png'
import testingIcon from '../assets/services/testing.png'
import commissioningIcon from '../assets/services/discount.png'
import trainingImg from '../assets/services/training.webp'
import serviceImg from '../assets/services/service.webp'
import maintenanceImg from '../assets/services/maintenance.webp'

const planItems = [
  {
    icon: formIcon,
    title: 'Site Surveys - System Configuration And Designing',
    text: 'Every successful deployment begins with a comprehensive initial physical property audit and threat matrix evaluation. Our engineers execute precise system configurations tailored to your specific facility dimensions and strict regulatory compliance requirements.',
  },
  {
    icon: planningIcon,
    title: 'Planning & Project Management',
    text: 'We provide dedicated project management to ensure seamless cross-departmental coordination. By implementing rigid milestone scheduling and resource allocation, we mitigate structural delivery risks and maintain strict alignment with corporate client timelines for large scale, nationwide deployments.',
  },
]

const executionItems = [
  {
    number: '01',
    icon: supplyIcon,
    title: 'Supply (S)',
    text: 'Procurement of authentic, certified hardware components directly from our global OEM technology partners.',
  },
  {
    number: '02',
    icon: installationIcon,
    title: 'Installation (I)',
    text: 'Precision physical deployment, terminal mounting, and structural wiring executed by factory-trained field engineers.',
  },
  {
    number: '03',
    icon: testingIcon,
    title: 'Testing (T)',
    text: 'Rigorous software calibration, signal diagnostics, and integration optimization to eliminate blind spots.',
  },
  {
    number: '04',
    icon: commissioningIcon,
    title: 'Commissioning (C)',
    text: 'Live power-on validation, system activation, and formal project handover to the client.',
  },
]

const continuityItems = [
  {
    image: trainingImg,
    title: 'Training on System Operations',
    text: 'We deliver hands-on technical walkthroughs to ensure your internal security staff is fully fluent with the hardware, software dashboards, and alarm reset protocols.',
  },
  {
    image: serviceImg,
    title: 'Post-sales Maintenance & Warranties',
    text: 'ASSIPL manages meticulous hardware warranty tracking, remote diagnostics, and highly responsive field replacement services to minimize system downtime.',
  },
  {
    image: maintenanceImg,
    title: 'Annual Maintenance Services',
    text: 'We execute proactive, scheduled preventative maintenance routines designed to maximize system uptime, update firmware, and protect your long-term technological investments.',
  },
]

function Services() {
  return (
    <div className="bg-white font-body">
      <main>
        <section
          className="relative flex min-h-120 items-center bg-cover bg-center px-5 pt-28"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,.3),rgba(0,0,0,.3)), url(${heroBg})`,
          }}
        >
          <div className="mx-auto w-full max-w-300 pt-0.5">
            <a href="/" className="font-kumbh text-[20px] font-semibold capitalize leading-normal text-background transition-colors hover:text-white">
              Home
            </a>
            <h1
              className="-ml-1 mt-2 text-[45px] font-semibold leading-[1.05] md:text-[70px]"
              style={{ color: 'var(--color-white)' }}
            >
              Services
            </h1>
          </div>
        </section>

        <section className="px-5 py-20">
          <div className="mx-auto max-w-300 text-center">
            <h2 className="mx-auto max-w-245 text-[32px] font-semibold leading-[1.125] text-secondary md:text-[45px]">
              End-to-End Enterprise Integration Services
            </h2>
            <p className="mx-auto mt-5 max-w-295 text-[18px] font-normal leading-normal text-text">
              We deliver complete operational readiness. We operate within a disciplined,
              sequential execution framework that bridges the gap between raw blueprints and active
              field deployment. From the first structural audit to ongoing preventative maintenance,
              our engineering squads guarantee that your critical infrastructure performs
              flawlessly.
            </p>
          </div>

          <div className="mx-auto mt-15 grid max-w-350 gap-10 lg:grid-cols-[680px_1fr]">
            <div
              className="min-h-105 rounded-2xl bg-cover bg-center md:min-h-138"
              style={{ backgroundImage: `url(${strategicBg})` }}
            />
            <div className="flex flex-col justify-center lg:pl-0">
              <h2 className="text-[32px] font-semibold leading-[1.125] text-secondary md:text-[45px]">
                Strategic Planning & Design
              </h2>
              <div className="mt-8 space-y-8">
                {planItems.map((item, index) => (
                  <article key={item.title} className="flex gap-6">
                    <div className="flex h-21 min-w-21 items-center justify-center rounded-full border border-accent">
                      <img src={item.icon} alt="" className="h-14 w-14 object-contain" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-[22px] font-semibold leading-[1.45] text-secondary">
                        {item.title}
                      </h3>
                      <p className="mt-2 max-w-155 text-[18px] font-normal leading-normal text-text">{item.text}</p>
                      {index === 1 && (
                        <a
                          href="#"
                          className="mt-6 inline-flex rounded-full bg-primary px-7.5 py-2.5 text-[15px] font-semibold capitalize leading-[1.43] text-white transition hover:bg-secondary"
                        >
                          Learn More
                        </a>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-background px-5 py-20">
          <div className="mx-auto max-w-350">
            <div className="mx-auto max-w-295 text-center">
              <h2 className="text-[32px] font-semibold leading-[1.125] text-secondary md:text-[45px]">
                Core Project Execution (SITC)
              </h2>
              <p className="mx-auto mt-6 max-w-280 text-[18px] font-normal leading-normal text-text">
                At the core of our deployment methodology is our comprehensive execution capability.
                We take absolute accountability for the complete Supply, Installation, Testing &
                commissioning of your security architecture.
              </p>
            </div>
            <div className="mt-15 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {executionItems.map((item) => (
                <article
                  key={item.title}
                  className="rounded-xl border border-accent bg-background px-8 py-8"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-22.5 w-22.5 items-center justify-center rounded-full border border-accent bg-background">
                      <img src={item.icon} alt="" className="h-11 w-11 object-contain" />
                    </div>
                    <span className="text-[58px] font-semibold leading-none text-accent">{item.number}</span>
                  </div>
                  <h3 className="mt-8 text-[32px] font-semibold leading-snug text-secondary">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-[16px] font-normal leading-[1.67] text-text">{item.text}</p>
                </article>
              ))}
            </div>
            <div className="mt-12 text-center">
              <a
                href="#"
                className="inline-flex rounded-full bg-primary px-8 py-2.5 text-[15px] font-semibold capitalize leading-[1.43] text-white transition hover:bg-secondary"
              >
                Know More
              </a>
            </div>
          </div>
        </section>

        <section className="bg-white px-5 py-20">
          <div className="mx-auto max-w-350">
            <div className="flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
              <h2 className="max-w-230 text-[32px] font-semibold leading-[1.125] text-secondary md:text-[45px]">
                Operational Continuity & Maintenance
              </h2>
              <a
                href="/services/operational-continuity-maintenance"
                className="inline-flex rounded-full bg-primary px-8 py-2.5 text-[15px] font-semibold capitalize leading-[1.43] text-white transition hover:bg-secondary"
              >
                Read More
              </a>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {continuityItems.map((item) => (
                <article key={item.title} className="rounded-[18px] border border-accent bg-white p-5">
                  <img
                    src={item.image}
                    alt=""
                    className="h-68 w-full rounded-[14px] object-cover"
                  />
                  <h3 className="mt-8 text-[32px] font-semibold leading-snug text-secondary">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-[16px] font-normal leading-[1.67] text-text">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="pb-0">
          <div
            className="min-h-104 bg-cover bg-center px-5 py-20 md:px-0"
            style={{
              backgroundImage: `linear-gradient(rgba(18,28,69,.28),rgba(18,28,69,.28)), url(${ctaBg})`,
            }}
          >
            <div className="mx-auto flex min-h-64 max-w-[1680px] flex-col items-start justify-center gap-8 md:flex-row md:items-center md:justify-between">
              <div className="max-w-180 text-left">
                <h2
                  className="text-[32px] font-semibold leading-[1.125] md:text-[45px]"
                  style={{ color: 'var(--color-white)' }}
                >
                  Ready to Standardize Your Enterprise Infrastructure?
                </h2>
                <p
                  className="mt-5 max-w-180 text-[16px] font-normal leading-[1.67]"
                  style={{ color: 'var(--color-white)' }}
                >
                  Connect with our systems integration experts to discuss multi-site rollouts, vault
                  security, and scalable safety architectures.
                </p>
              </div>
              <a
                href="mailto:assipl@automationsystems.co.in"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-10 py-3.5 text-[18px] font-medium capitalize leading-normal text-white transition hover:bg-secondary hover:text-white md:mr-5"
              >
                Contact Our Engineering Team
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Services
