import heroImage from '../assets/products/video-surveillance-1.webp'

const stats = ['15+ Years Experience', '3000+ Projects Delivered', 'ISO 9001:2015 Certified', 'Pan-India Operations']

function HeroSection() {
  return (
    <section id="home" className="relative min-h-[680px] overflow-hidden bg-secondary pt-28 text-white">
      <img src={heroImage} alt="Security systems in operation" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/90 to-secondary/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-secondary via-transparent to-transparent" />
      <div className="relative mx-auto flex min-h-[590px] max-w-[1440px] items-center px-5 py-20 sm:px-8 lg:px-12">
        <div className="max-w-3xl">
          <h1 className="border-l-4 border-white/80 pl-6 text-4xl font-bold leading-[1.1] !text-white sm:text-5xl md:text-6xl lg:text-[64px]">Automation Systems and Solutions</h1>
          <p className="mt-7 max-w-2xl pl-7 text-base leading-7 text-white/70 sm:text-lg">Integrated Security Solutions for BFSI, IT Parks, Industries, and Critical Infrastructure.</p>
          <ul className="mt-8 list-disc space-y-2 pl-7 marker:text-white/50 text-sm text-white/85 sm:text-base">
            {stats.map((stat) => <li key={stat}>{stat}</li>)}
          </ul>
          <a id="glow" href="#contact" className="mt-9 ml-7 inline-flex items-center rounded-full bg-primary px-7 py-4 text-sm font-semibold text-white transition hover:-translate-y-1">Consult An Integration Expert</a>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
