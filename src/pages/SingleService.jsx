import { ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import EnquiryPopup from '../components/EnquiryPopup'
import Reveal from '../components/Reveal'
import RichText from '../components/RichText'
import heroFallback from '../assets/services/occm-hero.webp'
import contactBackground from '../assets/services/occm-contact-bg.webp'
import ctaFallback from '../assets/services/occm-cta-bg.webp'
import mainImageFallback from '../assets/services/occm-main.webp'
import modelImageFallbackA from '../assets/services/occm-amc-comprehensive.webp'
import modelImageFallbackB from '../assets/services/occm-amc-non-comprehensive.webp'
import { fetchPublishedSingleServices, fetchSingleServiceBySlug, getMediaUrl } from '../lib/singleServicesApi'

const modelImageFallbacks = [modelImageFallbackA, modelImageFallbackB]

function ServiceSidebar({ links, currentSlug, onEnquiryClick, className = '' }) {
  return (
    <aside className={`grid gap-12 md:grid-cols-2 lg:grid-cols-1 lg:sticky lg:top-12 lg:self-start ${className}`}>
      {links.length > 0 && (
        <Reveal className="overflow-hidden rounded-3xl border border-border bg-white px-5 py-8">
          <nav aria-label="Services">
            <ul className="space-y-2">
              {links.map((link) => {
                const isActive = link.slug === currentSlug

                return (
                  <li key={link.slug}>
                    <Link
                      to={`/services/${link.slug}`}
                      className={`block rounded-xl px-2 py-3 text-lg transition ${
                        isActive
                          ? 'bg-secondary text-white'
                          : 'text-secondary hover:bg-secondary hover:text-white'
                      }`}
                    >
                      {link.title}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        </Reveal>
      )}

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
          <button
            type="button"
            onClick={onEnquiryClick}
            className="mt-6 inline-flex rounded-full bg-primary px-8 py-2 text-sm font-semibold text-white transition hover:bg-secondary"
          >
            Enquiry Now
          </button>
        </div>
      </Reveal>
    </aside>
  )
}

function AdvantageCard({ item, tone }) {
  return (
    <article
      className={`flex h-full flex-col rounded-[10px] border border-accent px-8 py-12 transition-[background-color,transform] duration-300 hover:scale-[1.02] ${
        tone === 'white' ? 'bg-white hover:bg-background' : 'bg-background hover:bg-white'
      }`}
    >
      <h3 className="text-[24px] font-semibold leading-tight text-secondary">{item.title}</h3>
      <p className="mt-5 text-justify text-[16px] leading-7 text-text md:text-left">{item.description}</p>
    </article>
  )
}

function FeatureList({ items }) {
  return (
    <ul className="mt-6 space-y-4">
      {items.map((item) => (
        <li key={item.id} className="flex gap-3 text-justify text-[16px] leading-7 text-text md:text-left">
          <span className="mt-2.5 h-1.5 w-1.5 flex-none rounded-full bg-text/60" aria-hidden="true" />
          <p>
            <span className="font-semibold text-secondary">{item.title}:</span> {item.description}
          </p>
        </li>
      ))}
    </ul>
  )
}

function ModelCard({ model, fallbackImage }) {
  return (
    <article className="h-full rounded-2xl border border-accent bg-white p-6">
      <img
        src={getMediaUrl(model.image) || fallbackImage}
        alt={model.title}
        className="h-56 w-full rounded-xl object-cover"
      />
      <h2 className="pt-5 text-[26px] font-semibold leading-tight text-secondary">{model.title}</h2>
      <RichText html={model.description} className="mt-4 text-justify text-[16px] leading-7 text-text md:text-left [&_ul]:mt-0" />
    </article>
  )
}

function SingleService({ routeSlug = null }) {
  const { slug: paramSlug } = useParams()
  const slug = routeSlug || paramSlug
  const [service, setService] = useState(null)
  const [serviceLinks, setServiceLinks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false)

  useEffect(() => {
    let isMounted = true

    setIsLoading(true)
    setError('')

    Promise.all([fetchSingleServiceBySlug(slug), fetchPublishedSingleServices()])
      .then(([serviceData, allServices]) => {
        if (!isMounted) return

        setService(serviceData)
        setServiceLinks(allServices.map((item) => ({ slug: item.slug, title: item.title })))
      })
      .catch(() => {
        if (isMounted) setError('This service could not be found.')
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [slug])

  if (isLoading) {
    return (
      <main className="flex min-h-150 items-center justify-center bg-white">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-secondary/20 border-t-secondary" />
      </main>
    )
  }

  if (error || !service) {
    return (
      <main className="flex min-h-150 flex-col items-center justify-center gap-4 bg-white px-5 text-center">
        <p className="text-xl font-semibold text-secondary">{error || 'This service could not be found.'}</p>
        <Link
          to="/services"
          className="rounded-full bg-primary px-7 py-3 text-sm font-semibold text-white transition hover:bg-secondary"
        >
          Back to Services
        </Link>
      </main>
    )
  }

  const heroBackground = getMediaUrl(service.banner_image) || heroFallback
  const mainImage = getMediaUrl(service.featured_image) || mainImageFallback
  const ctaBackground = getMediaUrl(service.cta_image) || ctaFallback
  const advantages = [...(service.advantages || [])].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
  const models = [...(service.models || [])].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
  const features = [...(service.features || [])].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))

  return (
    <main className="bg-white">
      <section
        className="relative flex min-h-100 items-start bg-cover bg-center px-5 pt-48 sm:px-10 md:min-h-125 md:px-8 md:pt-60 xl:px-60 xl:pt-52"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${heroBackground})`,
        }}
      >
        <div className="mx-auto w-full max-w-350">
          <div className="mb-4 flex items-center gap-3 text-base font-medium text-white md:text-xl">
            <Link to="/" className="transition hover:text-primary">
              Home
            </Link>
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
            <Link to="/services" className="transition hover:text-primary">
              Services
            </Link>
            {/* {service.breadcrumb_title && (
              <>
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
                <span className="text-white/70">{service.breadcrumb_title}</span>
              </>
            )} */}
          </div>
          <Reveal
            as="h1"
            className="-ml-1 font-heading text-[32px] font-semibold leading-tight text-white sm:text-[40px] md:text-[52px] xl:text-[70px] xl:leading-none"
          >
            {service.banner_title || service.title}
          </Reveal>
        </div>
      </section>

      <section className="mx-auto grid max-w-350 gap-8 px-5 py-20 lg:grid-cols-[25%_1fr]">
        <ServiceSidebar
          links={serviceLinks}
          currentSlug={slug}
          onEnquiryClick={() => setIsEnquiryOpen(true)}
          className="order-2 lg:order-1"
        />

        <article className="order-1 lg:order-2">
          <Reveal
            as="img"
            src={mainImage}
            alt={service.title}
            className="h-125 w-full rounded-2xl object-cover max-md:h-75"
          />

          {service.overview_title && (
            <Reveal as="h1" className="pt-5 text-[46px] font-semibold leading-tight text-secondary max-md:text-[32px]">
              {service.overview_title}
            </Reveal>
          )}
          <RichText html={service.overview_description} className="text-justify text-[16px] leading-8 text-text md:text-left [&_ul]:mt-0" />

          {advantages.length > 0 && (
            <>
              {service.service_advantages_title && (
                <Reveal
                  as="h2"
                  className="pt-12 text-[46px] font-semibold leading-tight text-secondary max-md:text-[32px]"
                >
                  {service.service_advantages_title}
                </Reveal>
              )}
              {service.service_advantages_description && (
                <Reveal as="p" className="text-justify text-[16px] leading-8 text-text md:text-left">
                  {service.service_advantages_description}
                </Reveal>
              )}

              <div className="mt-8 grid gap-5 md:grid-cols-2">
                {advantages.map((item, index) => {
                  const row = Math.floor(index / 2)
                  const col = index % 2
                  const tone = (row + col) % 2 === 0 ? 'white' : 'muted'

                  return (
                    <Reveal key={item.id} delay={col * 100}>
                      <AdvantageCard item={item} tone={tone} />
                    </Reveal>
                  )
                })}
              </div>
            </>
          )}

          {models.length > 0 && (
            <>
              {service.service_models_title && (
                <Reveal
                  as="h2"
                  className="pt-12 text-[46px] font-semibold leading-tight text-secondary max-md:text-[32px]"
                >
                  {service.service_models_title}
                </Reveal>
              )}
              {service.service_models_description && (
                <Reveal as="p" className="text-justify text-[16px] leading-8 text-text md:text-left">
                  {service.service_models_description}
                </Reveal>
              )}

              <div className="mt-8 grid gap-8 md:grid-cols-2">
                {models.map((model, index) => (
                  <Reveal key={model.id} delay={index * 100}>
                    <ModelCard model={model} fallbackImage={modelImageFallbacks[index % modelImageFallbacks.length]} />
                  </Reveal>
                ))}
              </div>
            </>
          )}

          {features.length > 0 && (
            <>
              {service.service_features_title && (
                <Reveal
                  as="h2"
                  className="pt-12 text-[46px] font-semibold leading-tight text-secondary max-md:text-[32px]"
                >
                  {service.service_features_title}
                </Reveal>
              )}

              <FeatureList items={features} />
            </>
          )}

          {(service.cta_title || service.cta_description) && (
            <Reveal
              className="relative mt-12 isolate flex flex-col items-start gap-6 overflow-hidden rounded-2xl px-10 py-12 text-white"
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.35), rgba(0, 0, 0, 0.35)), url(${ctaBackground})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="max-w-140">
                {service.cta_title && (
                  <h3 className="text-[44px] font-semibold leading-tight text-white">{service.cta_title}</h3>
                )}
                {service.cta_description && (
                  <p className="mt-3 text-justify text-[16px] leading-7 text-white/90 md:text-left">{service.cta_description}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setIsEnquiryOpen(true)}
                className="inline-flex flex-none items-center gap-2 rounded-full bg-primary px-8 py-3 text-sm font-semibold text-white transition hover:bg-secondary"
              >
                Get in Touch
              </button>
            </Reveal>
          )}
        </article>
      </section>

      <EnquiryPopup isOpen={isEnquiryOpen} onClose={() => setIsEnquiryOpen(false)} />
    </main>
  )
}

export default SingleService

