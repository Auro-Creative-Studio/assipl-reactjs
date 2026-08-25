import { services } from '../data'
import SectionHeading from './SectionHeading'

function ServicesSection() {
  return <section id="services" className="bg-secondary py-20 sm:py-24 lg:py-32"><div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12"><div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20"><div><SectionHeading light eyebrow="End-to-End Integration Services" title="We deliver operational readiness, not just hardware." description="By managing the complete project lifecycle internally, ASSIPL ensures that complex security architectures are deployed seamlessly and maintained reliably." /><a href="#contact" className="mt-8 inline-flex items-center rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-secondary">Explore Our Services <span className="ml-2">↗</span></a></div><div className="grid gap-4">{services.map((service) => <article key={service.number} className="grid gap-5 rounded-[24px] border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:bg-white/10 sm:grid-cols-[70px_1fr] sm:p-7"><div className="text-sm font-semibold text-blue-300">{service.number}</div><div><h3 className="text-xl font-semibold !text-white sm:text-2xl">{service.title}</h3><p className="mt-3 text-sm leading-7 text-white/60">{service.description}</p></div></article>)}</div></div></div></section>
}
export default ServicesSection
