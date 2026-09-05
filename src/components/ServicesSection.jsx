import { useState } from 'react'
import Reveal from './Reveal'
import serviceImage from '../assets/home/services-image.webp'
import { services as defaultServices } from '../data'
import { getMediaUrl } from '../lib/homeApi'

function ServicesSection({ data }) {
  const [openNumber, setOpenNumber] = useState('01')

  const heading = data?.services_heading || 'End-to-End Integration Services'
  const description =
    data?.services_description ||
    `We do not simply supply security hardware; we deliver absolute operational readiness. By managing the
    complete project lifecycle internally, ASSIPL ensures that complex, multi-site security architectures
    are deployed seamlessly and maintained perfectly.`
  const image = data?.services_image ? getMediaUrl(data.services_image) : serviceImage
  const services = data?.services?.length
    ? data.services.map((item, index) => ({
        number: String(index + 1).padStart(2, '0'),
        title: item.title || '',
        description: item.description || '',
      }))
    : defaultServices
  const ctaLabel = data?.services_cta_label || 'Explore Our Services'
  const ctaHref = data?.services_cta_href || '/service'

  return (
    <section id="services" className="bg-[#F8FAFC] py-20 sm:py-24 lg:py-24">
      <div className="mx-auto max-w-360 px-5 sm:px-8 lg:px-12">
        <Reveal className="mx-auto max-w-6xl text-center">
          <h2 className="text-4xl font-bold leading-tight text-secondary sm:text-5xl">{heading}</h2>
          <p className="mt-5 text-left text-base leading-7 text-text md:text-center sm:text-lg">{description}</p>
        </Reveal>

        <div className="mt-14 grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-start lg:gap-14">
          <Reveal className="aspect-4/5 overflow-hidden rounded-2xl">
            <img
              src={image}
              alt="ASSIPL multi-sensor camera installation"
              className="aspect-4/5 w-full object-cover object-[85%_center]"
            />
          </Reveal>

          <Reveal delay={150} className="flex h-full flex-col justify-center">
            <div className="grid gap-3">
              {services.map((service) => {
                const isOpen = openNumber === service.number

                return (
                  <div key={service.number}>
                    <button
                      type="button"
                      onClick={() => setOpenNumber(isOpen ? null : service.number)}
                      aria-expanded={isOpen}
                      className={`group flex w-full items-center justify-between gap-4 rounded-lg border px-5 py-6 text-left transition cursor-pointer ${isOpen
                          ? 'border-secondary '
                          : 'border-[#D6DEE8] bg-transparent'
                        }`}
                    >
                      <span className="text-base font-semibold text-secondary sm:text-[20px]">{service.title}</span>
                      <span
                        className={`text-[30px] font-light leading-none transition-colors ${isOpen ? 'text-black' : 'text-primary group-hover:text-black'
                          }`}
                        aria-hidden="true"
                      >
                        {isOpen ? '−' : '+'}
                      </span>
                    </button>
                    <div
                      className={`grid overflow-hidden rounded-lg border transition-all duration-300 ${isOpen
                          ? 'mt-2 grid-rows-[1fr] border-secondary opacity-100'
                          : 'grid-rows-[0fr] border-transparent opacity-0'
                        }`}
                    >
                      <div className="min-h-0">
                        <p className="p-5 text-left text-sm leading-7 text-text md:text-left sm:text-base">{service.description}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <a
              href={ctaHref}
              className="mt-7 inline-flex w-fit items-center rounded-full bg-primary px-8 py-3 text-[18px] font-semibold text-white"
            >
              {ctaLabel}
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export default ServicesSection
