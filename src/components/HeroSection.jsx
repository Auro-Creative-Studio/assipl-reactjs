import heroImage from '../assets/hero.png'

const stats = ['15+ Years Experience', '3000+ Projects Delivered', 'ISO 9001:2015 Certified', 'Pan-India Operations']

function HeroSection() {
  return (
    <section id="home" className="relative min-h-[680px] overflow-hidden bg-secondary pt-28 text-white">
      <img src={heroImage} alt="Security systems in operation" className="absolute inset-0 h-full w-full object-cover opacity-35" />
      <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/90 to-secondary/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-secondary via-transparent to-transparent" />
      <div className="relative mx-auto flex min-h-[590px] max-w-[1440px] items-center px-5 py-20 sm:px-8 lg:px-12">
        <div className="max-w-5xl">
          <p className="mb-6 inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/80">Automation Systems and Solutions</p>
          <h1 className="max-w-5xl text-4xl font-bold leading-[1.05] !text-white sm:text-5xl md:text-6xl lg:text-[78px]">Integrated Security Solutions for BFSI, IT Parks, Industries, and Critical Infrastructure.</h1>
          <p className="mt-7 max-w-2xl text-base leading-7 text-white/65 sm:text-lg">Engineering reliable and scalable security infrastructure across India through intelligent system integration.</p>
          <a id="glow" href="#contact" className="mt-9 inline-flex items-center rounded-full bg-primary px-7 py-4 text-sm font-semibold text-white transition hover:-translate-y-1">Consult an Integration Expert <span className="ml-2">↗</span></a>
          <div className="mt-14 grid max-w-4xl grid-cols-2 gap-6 border-t border-white/15 pt-8 sm:grid-cols-4">{stats.map((stat) => <div key={stat} className="text-sm font-medium leading-5 text-white/70">{stat}</div>)}</div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
