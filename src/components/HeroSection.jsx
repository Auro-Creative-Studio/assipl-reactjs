import heroImage from '../assets/home/hero-bg.webp'
import Reveal from './Reveal'

const stats = ['15+ Years Experience', '3000+ Projects Delivered', 'ISO 9001:2015 Certified', 'Pan-India Operations']

function HeroSection() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden bg-white pt-40 pb-16 sm:pt-44 lg:pt-48"
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(27,26,23,0.7) 68%, rgba(255,255,255,1) 100%), url(${heroImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="relative mx-auto w-full max-w-350 px-5">
        <Reveal
          as="h1"
          className="-ml-1 max-w-260 font-heading text-[32px] font-semibold leading-tight text-white sm:text-[44px] md:text-[64px] xl:text-[80px] xl:leading-none"
        >
          Automation Systems and Solutions
        </Reveal>
        <Reveal
          as="p"
          delay={100}
          className="mt-6 max-w-190 text-[18px] font-semibold leading-normal text-white sm:text-[26px]"
        >
          Integrated Security Solutions for BFSI, IT Parks, Industries, and Critical Infrastructure.
        </Reveal>
        <Reveal delay={150}>
          <ul className="mt-7 list-disc space-y-2 pl-5 text-[16px] text-white marker:text-white/60 sm:text-[18px]">
            {stats.map((stat) => (
              <li key={stat}>{stat}</li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={200}>
          <a
            href="/contact-us"
            className="mt-9 inline-flex items-center rounded-full bg-primary px-8 py-3.5 text-[16px] font-semibold text-white transition hover:bg-secondary sm:text-[18px]"
          >
            Consult an Integration Expert
          </a>
        </Reveal>
      </div>
    </section>
  )
}

export default HeroSection
