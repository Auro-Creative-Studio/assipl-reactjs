import Reveal from './Reveal'
import IndiaMap from './IndiaMap'
import { locations } from '../data'

function NationwideSection() {
  return (
    <section id="process" className="bg-white py-20 sm:py-20">
      <div className="mx-auto max-w-360 px-5 sm:px-8 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-12">
          <Reveal>
            <h2 className="text-3xl font-bold leading-tight text-secondary sm:text-4xl lg:text-[54px]">
              Nationwide Scale. Localized Response.
            </h2>
            <p className="mt-6 text-base leading-7 text-text sm:text-[18px]">
              Your enterprise operates on a national scale, and so do we. With our central operations and regional
              hubs clearly established across India, ASSIPL guarantees rapid field response times, unified
              engineering standards, and seamless multi-site rollouts nationwide.
            </p>
            {/* <a
              href="#audit-form"
              className="mt-8 inline-flex items-center rounded-full bg-primary px-7 py-4 text-sm font-semibold text-white"
            >
              Initiate an Infrastructure Audit <span className="ml-2">↗</span>
            </a> */}
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
