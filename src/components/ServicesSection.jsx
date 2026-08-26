import { useState } from 'react'
import serviceImage from '../assets/home/services-image.webp'
import { services } from '../data'

function ServicesSection() {
  const [openNumber, setOpenNumber] = useState('02')

  return (
    <section id="services" className="bg-background py-20 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-360 px-5 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-bold leading-tight text-secondary sm:text-5xl">End-to-End Integration Services</h2>
          <p className="mt-5 text-base leading-7 text-text sm:text-lg">
            We do not simply supply security hardware; we deliver absolute operational readiness. By managing the
            complete project lifecycle internally, ASSIPL ensures that complex, multi-site security architectures
            are deployed seamlessly and maintained perfectly.
          </p>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-16">
          <div className="overflow-hidden rounded-2xl">
            <img
              src={serviceImage}
              alt="ASSIPL multi-sensor camera installation"
              className="aspect-4/5 w-full object-cover object-[85%_center]"
            />
          </div>

          <div>
            <div className="grid gap-3">
              {services.map((service) => {
                const isOpen = openNumber === service.number

                return (
                  <div key={service.number}>
                    <button
                      type="button"
                      onClick={() => setOpenNumber(isOpen ? null : service.number)}
                      aria-expanded={isOpen}
                      className={`flex w-full items-center justify-between gap-4 rounded-xl border bg-white px-6 py-5 text-left transition ${
                        isOpen ? 'border-primary/40' : 'border-black/10'
                      }`}
                    >
                      <span className="text-base font-semibold text-secondary sm:text-lg">{service.title}</span>
                      <span className="text-xl font-light leading-none text-primary" aria-hidden="true">
                        {isOpen ? '−' : '+'}
                      </span>
                    </button>
                    <div
                      className={`grid overflow-hidden rounded-xl border transition-all duration-300 ${
                        isOpen ? 'mt-3 grid-rows-[1fr] border-primary/40 opacity-100' : 'grid-rows-[0fr] border-transparent opacity-0'
                      }`}
                    >
                      <div className="min-h-0">
                        <p className="p-5 text-sm leading-7 text-text sm:text-base">{service.description}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <a
              href="/service"
              className="mt-8 inline-flex items-center rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-secondary"
            >
              Explore Our Services
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ServicesSection
