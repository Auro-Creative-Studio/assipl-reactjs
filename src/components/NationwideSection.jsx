import Reveal from './Reveal'
import IndiaMap from './IndiaMap'
import { locations as defaultLocations } from '../data'

function NationwideSection({ data }) {
  const heading = data?.nationwide_heading || 'Nationwide Scale. Localized Response.'
  const description =
    data?.nationwide_description ||
    `Your enterprise operates on a national scale, and so do we. With our central operations and regional
    hubs clearly established across India, ASSIPL guarantees rapid field response times, unified
    engineering standards, and seamless multi-site rollouts nationwide.`
  const locations = data?.locations?.length ? data.locations : defaultLocations

  return (
    <section id="process" className="bg-white pt-[126px] pb-[72px]">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-0">
        <div className="grid gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:gap-[42px]">
          <Reveal>
            <h2 className="max-w-[760px] text-3xl font-bold leading-tight text-secondary sm:text-4xl lg:text-[54px]">
              {heading}
            </h2>
            <p className="mt-[26px] max-w-[880px] text-left text-body text-[#63708a] md:text-left">
              {description}
            </p>
          </Reveal>
          <Reveal delay={150}>
            <IndiaMap locations={locations} />
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export default NationwideSection
