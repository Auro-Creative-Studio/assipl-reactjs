import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import EnquiryPopup from '../components/EnquiryPopup'
import Reveal from '../components/Reveal'
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
import { useSeoMeta } from '../hooks/useSeoMeta'

const FALLBACK_SERVICES_PAGE = {
  banner_image: heroBg,
  services_title: 'End-to-End Enterprise Integration Services',
  services_description:
    'We deliver complete operational readiness. We operate within a disciplined, sequential execution framework that bridges the gap between raw blueprints and active field deployment. From the first structural audit to ongoing preventative maintenance, our engineering squads guarantee that your critical infrastructure performs flawlessly.',

  strategic_image: strategicBg,
  strategic_title: 'Strategic Planning & Design',
  learn_more_link: '/strategic-planning-design',
  strategic_items: [
    {
      icon: formIcon,
      heading: 'Site Surveys - System Configuration And Designing',
      description:
        'Every successful deployment begins with a comprehensive initial physical property audit and threat matrix evaluation. Our engineers execute precise system configurations tailored to your specific facility dimensions and strict regulatory compliance requirements.',
      sort_order: 0,
    },
    {
      icon: planningIcon,
      heading: 'Planning & Project Management',
      description:
        'We provide dedicated project management to ensure seamless cross-departmental coordination. By implementing rigid milestone scheduling and resource allocation, we mitigate structural delivery risks and maintain strict alignment with corporate client timelines for large scale, nationwide deployments.',
      sort_order: 1,
    },
  ],

  core_project_title: 'Core Project Execution (SITC)',
  core_project_description:
    'At the core of our deployment methodology is our comprehensive execution capability. We take absolute accountability for the complete Supply, Installation, Testing & commissioning of your security architecture.',
  know_more_link: '/core-project-execution-sitc',
  core_projects: [
    {
      icon: supplyIcon,
      heading: 'Supply (S)',
      description: 'Procurement of authentic, certified hardware components directly from our global OEM technology partners.',
      sort_order: 0,
    },
    {
      icon: installationIcon,
      heading: 'Installation (I)',
      description: 'Precision physical deployment, terminal mounting, and structural wiring executed by factory-trained field engineers.',
      sort_order: 1,
    },
    {
      icon: testingIcon,
      heading: 'Testing (T)',
      description: 'Rigorous software calibration, signal diagnostics, and integration optimization to eliminate blind spots.',
      sort_order: 2,
    },
    {
      icon: commissioningIcon,
      heading: 'Commissioning (C)',
      description: 'Live power-on validation, system activation, and formal project handover to the client.',
      sort_order: 3,
    },
  ],

  maintenance_title: 'Operational Continuity & Maintenance',
  read_more_link: '/services/operational-continuity-maintenance',
  maintenance_items: [
    {
      image: trainingImg,
      heading: 'Training on System Operations',
      description:
        'We deliver hands-on technical walkthroughs to ensure your internal security staff is fully fluent with the hardware, software dashboards, and alarm reset protocols.',
      sort_order: 0,
    },
    {
      image: serviceImg,
      heading: 'Post-sales Maintenance & Warranties',
      description:
        'ASSIPL manages meticulous hardware warranty tracking, remote diagnostics, and highly responsive field replacement services to minimize system downtime.',
      sort_order: 1,
    },
    {
      image: maintenanceImg,
      heading: 'Annual Maintenance Services',
      description:
        'We execute proactive, scheduled preventative maintenance routines designed to maximize system uptime, update firmware, and protect your long-term technological investments.',
      sort_order: 2,
    },
  ],
}

const API_ROOT = (
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000/api'
).replace(/\/$/, '')

const BACKEND_ORIGIN = (import.meta.env.VITE_MEDIA_BASE_URL || API_ROOT.replace(/\/api$/, '')).replace(/\/$/, '')
const SERVICES_PAGE_ENDPOINT = `${API_ROOT}/services-page`

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

function Services() {
  const [page, setPage] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false)

  useEffect(() => {
    let isMounted = true

    const fetchServicesPage = async () => {
      try {
        const response = await axios.get(SERVICES_PAGE_ENDPOINT)
        const data = response.data?.data
        const record = Array.isArray(data) ? data[0] : data

        if (isMounted) {
          setPage(record || FALLBACK_SERVICES_PAGE)
        }
      } catch {
        if (isMounted) {
          setPage(FALLBACK_SERVICES_PAGE)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void fetchServicesPage()

    return () => {
      isMounted = false
    }
  }, [])

  useSeoMeta({
    title: page?.meta_title || 'Services | ASSIPL',
    description:
      page?.meta_description ||
      'End-to-end enterprise integration services from ASSIPL, from strategic planning to lifecycle maintenance.',
    keywords: page?.meta_keywords,
    ogTitle: page?.og_title,
    ogDescription: page?.og_description,
    ogImage: page?.og_image,
    robotsIndex: page?.robots_index,
    robotsFollow: page?.robots_follow,
  })

  if (isLoading) {
    return (
      <div className="flex min-h-150 items-center justify-center bg-white">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-secondary" />
      </div>
    )
  }

  if (!page) {
    return null
  }

  const strategicItems = sortByOrder(page.strategic_items)
  const coreProjects = sortByOrder(page.core_projects)
  const maintenanceItems = sortByOrder(page.maintenance_items)

  return (
    <div className="bg-white font-body">
      <main>
        <section
          className="relative flex min-h-100 items-start bg-cover bg-center px-5 pt-48 sm:px-10 md:min-h-125 md:px-8 md:pt-60 xl:px-60 xl:pt-52"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,.3),rgba(0,0,0,.3)), url(${getMediaUrl(page.banner_image)})`,
          }}
        >
          <div className="mx-auto w-full max-w-300 pt-0.5">
            <a href="/" className="font-kumbh text-[20px] font-semibold capitalize leading-normal text-background transition-colors hover:text-white">
              Home
            </a>
            <Reveal
              as="h1"
              className="-ml-1 mt-2 text-[45px] font-semibold leading-[1.05] md:text-[70px]"
              style={{ color: 'var(--color-white)' }}
            >
              Services
            </Reveal>
          </div>
        </section>

        {(page.services_title || page.services_description || strategicItems.length > 0) && (
          <section className="px-5 py-20">
            {(page.services_title || page.services_description) && (
              <Reveal className="mx-auto max-w-300 text-center">
                {page.services_title && (
                  <h2 className="mx-auto max-w-245 text-[32px] font-semibold leading-[1.125] text-secondary md:text-[45px]">
                    {page.services_title}
                  </h2>
                )}
                {page.services_description && (
                  <div
                    className="mx-auto mt-5 max-w-295 text-left text-body font-normal text-text md:text-center [&_p]:mt-4 [&_p:first-child]:mt-0"
                    dangerouslySetInnerHTML={{ __html: page.services_description }}
                  />
                )}
              </Reveal>
            )}

            <div className="mx-auto mt-15 grid max-w-350 gap-10 lg:grid-cols-[680px_1fr]">
              {page.strategic_image && (
                <Reveal
                  className="min-h-105 rounded-2xl bg-cover bg-center md:min-h-138"
                  style={{ backgroundImage: `url(${getMediaUrl(page.strategic_image)})` }}
                />
              )}
              <div className="flex flex-col justify-center lg:pl-0">
                {page.strategic_title && (
                  <h2 className="text-[32px] font-semibold leading-[1.125] text-secondary md:text-[45px]">
                    {page.strategic_title}
                  </h2>
                )}
                <div className="mt-8 space-y-8">
                  {strategicItems.map((item, index) => (
                    <Reveal key={item.id || index} as="article" delay={index * 100} className="flex gap-6">
                      {item.icon && (
                        <div className="flex h-21 min-w-21 items-center justify-center rounded-full border border-accent">
                          <img src={getMediaUrl(item.icon)} alt="" className="h-14 w-14 object-contain" />
                        </div>
                      )}
                      <div className="flex-1">
                        {item.heading && (
                          <h3 className="text-[22px] font-semibold leading-[1.45] text-secondary">
                            {item.heading}
                          </h3>
                        )}
                        {item.description && (
                          <p className="mt-2 max-w-155 text-left text-body font-normal text-text md:text-left">
                            {item.description}
                          </p>
                        )}
                        {index === strategicItems.length - 1 && page.learn_more_link && (
                          <Link
                            to={page.learn_more_link}
                            className="mt-6 inline-flex rounded-full bg-primary px-7.5 py-2.5 text-[15px] font-semibold capitalize leading-[1.43] text-white transition hover:bg-secondary"
                          >
                            Learn More
                          </Link>
                        )}
                      </div>
                    </Reveal>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {(page.core_project_title || page.core_project_description || coreProjects.length > 0) && (
          <section className="bg-background px-5 py-20">
            <div className="mx-auto max-w-350">
              {(page.core_project_title || page.core_project_description) && (
                <Reveal className="mx-auto max-w-295 text-center">
                  {page.core_project_title && (
                    <h2 className="text-[32px] font-semibold leading-[1.125] text-secondary md:text-[45px]">
                      {page.core_project_title}
                    </h2>
                  )}
                  {page.core_project_description && (
                    <div
                      className="mx-auto mt-6 max-w-280 text-left text-body font-normal text-text md:text-center [&_p]:mt-4 [&_p:first-child]:mt-0"
                      dangerouslySetInnerHTML={{ __html: page.core_project_description }}
                    />
                  )}
                </Reveal>
              )}
              <div className="mt-15 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {coreProjects.map((item, index) => (
                  <Reveal
                    key={item.id || index}
                    as="article"
                    delay={index * 100}
                    className="rounded-xl border border-accent bg-background px-8 py-8"
                  >
                    <div className="flex items-start justify-between gap-4">
                      {item.icon && (
                        <div className="flex h-22.5 w-22.5 items-center justify-center rounded-full border border-accent bg-background">
                          <img src={getMediaUrl(item.icon)} alt="" className="h-11 w-11 object-contain" />
                        </div>
                      )}
                      <span className="text-[58px] font-semibold leading-none text-accent">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>
                    {item.heading && (
                      <h3 className="mt-8 text-[32px] font-semibold leading-snug text-secondary">
                        {item.heading}
                      </h3>
                    )}
                    {item.description && (
                      <p className="mt-3 text-left text-body font-normal text-text md:text-left">
                        {item.description}
                      </p>
                    )}
                  </Reveal>
                ))}
              </div>
              {page.know_more_link && (
                <div className="mt-12 text-center">
                  <Link
                    to={page.know_more_link}
                    className="inline-flex rounded-full bg-primary px-8 py-2.5 text-[15px] font-semibold capitalize leading-[1.43] text-white transition hover:bg-secondary"
                  >
                    Know More
                  </Link>
                </div>
              )}
            </div>
          </section>
        )}

        {(page.maintenance_title || maintenanceItems.length > 0) && (
          <section className="bg-white px-5 py-20">
            <div className="mx-auto max-w-350">
              <Reveal className="flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
                {page.maintenance_title && (
                  <h2 className="max-w-230 text-[32px] font-semibold leading-[1.125] text-secondary md:text-[45px]">
                    {page.maintenance_title}
                  </h2>
                )}
                {page.read_more_link && (
                  <a
                    href={page.read_more_link}
                    className="inline-flex rounded-full bg-primary px-8 py-2.5 text-[15px] font-semibold capitalize leading-[1.43] text-white transition hover:bg-secondary"
                  >
                    Read More
                  </a>
                )}
              </Reveal>
              <div className="mt-12 grid gap-6 md:grid-cols-3">
                {maintenanceItems.map((item, index) => (
                  <Reveal
                    key={item.id || index}
                    as="article"
                    delay={index * 100}
                    className="rounded-[18px] border border-accent bg-white p-5"
                  >
                    {item.image && (
                      <img
                        src={getMediaUrl(item.image)}
                        alt=""
                        className="h-68 w-full rounded-[14px] object-cover"
                      />
                    )}
                    {item.heading && (
                      <h3 className="mt-8 text-[32px] font-semibold leading-snug text-secondary">
                        {item.heading}
                      </h3>
                    )}
                    {item.description && (
                      <p className="mt-3 text-left text-body font-normal text-text md:text-left">
                        {item.description}
                      </p>
                    )}
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="pb-0">
          <div
            className="min-h-104 bg-cover bg-center px-5 py-20 md:px-0"
            style={{
              backgroundImage: `linear-gradient(rgba(18,28,69,.28),rgba(18,28,69,.28)), url(${ctaBg})`,
            }}
          >
            <Reveal className="mx-auto flex min-h-64 max-w-360 flex-col items-start justify-center gap-8 md:flex-row md:items-center md:justify-between">
              <div className="max-w-180 text-left">
                <h2
                  className="text-[32px] font-semibold leading-[1.125] md:text-[45px]"
                  style={{ color: 'var(--color-white)' }}
                >
                  Ready to Standardize Your Enterprise Infrastructure?
                </h2>
                <p
                  className="mt-5 max-w-180 text-left text-body font-normal md:text-left"
                  style={{ color: 'var(--color-white)' }}
                >
                  Connect with our systems integration experts to discuss multi-site rollouts, vault
                  security, and scalable safety architectures.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsEnquiryOpen(true)}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-10 py-3.5 text-[18px] font-medium capitalize leading-normal text-white transition hover:bg-secondary hover:text-white md:mr-5"
              >
                Contact Our Engineering Team
              </button>
            </Reveal>
          </div>
        </section>
      </main>

      <EnquiryPopup isOpen={isEnquiryOpen} onClose={() => setIsEnquiryOpen(false)} />
    </div>
  )
}

export default Services

