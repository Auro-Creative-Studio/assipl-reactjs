import mapImage from '../assets/products/video-surveillance-bg-2.webp'
import { locations } from '../data'
import SectionHeading from './SectionHeading'

function NationwideSection() {
  return <section id="process" className="bg-white py-20 sm:py-24 lg:py-32"><div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12"><div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-20"><div><SectionHeading eyebrow="Nationwide Scale. Localized Response." title="One engineering standard across every location." description="Your enterprise operates on a national scale, and so do we. ASSIPL supports complex multi-site implementations across India with unified engineering standards and responsive regional support." /><a href="#contact" className="mt-8 inline-flex items-center rounded-full bg-primary px-7 py-4 text-sm font-semibold text-white">Initiate an Infrastructure Audit <span className="ml-2">↗</span></a></div><div className="overflow-hidden rounded-[32px] bg-background p-6 sm:p-8"><img src={mapImage} alt="Pan India Operations" className="mx-auto max-h-[360px] w-full object-contain" /><div className="mt-8 flex flex-wrap gap-2">{locations.map((location) => <span key={location} className="rounded-full border border-secondary/10 bg-white px-3 py-2 text-xs font-medium text-secondary">{location}</span>)}</div></div></div></div></section>
}
export default NationwideSection
