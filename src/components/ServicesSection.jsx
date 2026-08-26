import { useState } from 'react'
import serviceImage from '../assets/home/services-image.webp'
import { services } from '../data'

function ServicesSection() {
  const [openNumber, setOpenNumber] = useState('01')

  return (
    <section id="services" className="bg-[#F8FAFC] py-20 sm:py-24 lg:py-24">
      <div className="mx-auto max-w-360 px-5 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="text-4xl font-bold leading-tight text-secondary sm:text-5xl">End-to-End Integration Services</h2>
          <p className="mt-5 text-base leading-7 text-text sm:text-lg">
            We do not simply supply security hardware; we deliver absolute operational readiness. By managing the
            complete project lifecycle internally, ASSIPL ensures that complex, multi-site security architectures
            are deployed seamlessly and maintained perfectly.
          </p>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:items-start lg:gap-14">
          <div className="aspect-[4/5] overflow-hidden rounded-2xl">
            <img
              src={serviceImage}
              alt="ASSIPL multi-sensor camera installation"
              className="aspect-4/5 w-full object-cover object-[85%_center]"
            />
          </div>

          <div className="flex h-full flex-col justify-center">
            <div className="grid gap-3">
              {services.map((service) => {
                const isOpen = openNumber === service.number

                return (
                  <div key={service.number}>
                    <button
                      type="button"
                      onClick={() => setOpenNumber(isOpen ? null : service.number)}
                      aria-expanded={isOpen}
                      className={`group flex w-full items-center justify-between gap-4 rounded-[8px] border px-5 py-[18px] text-left transition ${isOpen
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
                      className={`grid overflow-hidden rounded-[8px] border transition-all duration-300 ${isOpen
                          ? 'mt-2 grid-rows-[1fr] border-secondary opacity-100'
                          : 'grid-rows-[0fr] border-transparent opacity-0'
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
              className="mt-7 inline-flex w-fit items-center rounded-full bg-primary px-8 py-3 text-[18px] font-semibold text-white"
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
