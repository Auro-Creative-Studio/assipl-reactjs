import Reveal from './Reveal'
import aboutImage from '../assets/home/about-image.webp'
import { getMediaUrl } from '../lib/homeApi'

function AboutSection({ data }) {
  const image = data?.about_image ? getMediaUrl(data.about_image) : aboutImage
  const heading = data?.about_heading || 'Precision Engineering. Nationwide Support.'
  const description =
    data?.about_description ||
    `Automation Systems and Solutions (India) Pvt. Ltd. (ASSIPL) specializes in low voltage system
    integration delivering robust electronic security & safety solutions. We excel in complex,
    multi-site rollouts and critical infrastructure for India's most demanding sectors. Our scalable
    architecture ensures your infrastructure is protected today and primed for future integrations,
    including AI Analytics and Smart Building integration.`
  const ctaLabel = data?.about_cta_label || 'Know More'
  const ctaHref = data?.about_cta_href || '/about'

  return (
    <section id="about" className="bg-white py-8 lg:py-8">
      <div className="mx-auto grid max-w-360 gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:items-center lg:gap-20 lg:px-12">
        <Reveal className="overflow-hidden rounded-2xl">
          <img src={image} alt="ASSIPL ceiling-mounted security camera" className="aspect-4/3 h-full w-full object-cover" />
        </Reveal>
        <Reveal delay={150}>
          <h2 className="text-3xl font-bold leading-tight text-secondary sm:text-4xl lg:text-[42px]">{heading}</h2>
          <p
            className="mt-6 text-justify text-base leading-8 text-text md:text-left sm:text-lg"
            dangerouslySetInnerHTML={{ __html: description }}
          />
          <a
            href={ctaHref}
            className="mt-8 inline-flex items-center rounded-full bg-primary px-7 py-3.5 text-[18px] font-semibold text-white transition hover:bg-secondary"
          >
            {ctaLabel}
          </a>
        </Reveal>
      </div>
    </section>
  )
}

export default AboutSection
