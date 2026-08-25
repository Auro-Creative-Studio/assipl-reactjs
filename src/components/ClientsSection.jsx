import { testimonials } from '../data'
import SectionHeading from './SectionHeading'

function ClientsSection() {
  return <section className="bg-background py-20 sm:py-24 lg:py-32"><div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12"><div className="grid gap-8 lg:grid-cols-2 lg:items-end"><SectionHeading eyebrow="Major Clients" title="Trusted for systems that cannot afford downtime." /><p className="max-w-xl text-base leading-7 text-text lg:ml-auto">Long-term client relationships are built on dependable delivery, professional support, and consistent system uptime.</p></div><div className="mt-12 grid gap-6 lg:grid-cols-2">{testimonials.map((item) => <article key={item.company} className="rounded-[28px] border border-black/5 bg-white p-7 sm:p-9"><div className="font-heading text-6xl font-bold leading-none text-primary/20">“</div><p className="mt-2 text-base leading-8 text-secondary/80 sm:text-lg">{item.quote}</p><div className="mt-7 border-t border-black/5 pt-5 text-sm font-semibold text-text">{item.company}</div></article>)}</div></div></section>
}
export default ClientsSection
