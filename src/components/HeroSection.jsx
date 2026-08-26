import heroImage from '../assets/home-hero.webp';

const stats = ['15+ Years Experience', '3000+ Projects Delivered', 'ISO 9001:2015 Certified', 'Pan-India Operations']

function HeroSection() {
  return (
    <section id="home" className="relative min-h-[680px] overflow-hidden pt-28 text-white">
      <img src={heroImage} alt="Security systems in operation" className="absolute inset-0 h-full w-full object-cover" />
      {/* <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/90 to-secondary/20" /> */}
      {/* <div className="absolute inset-0 bg-gradient-to-t from-secondary via-transparent to-transparent" /> */}
      <div className="relative mx-auto flex min-h-[590px] max-w-[1440px] items-center px-5 py-20 sm:px-8 lg:px-12">
        <div className="max-w-6xl">
          <h1 className=" text-4xl font-bold leading-[1.1] !text-white sm:text-5xl md:text-7xl lg:text-[108px]">Automation Systems and Solutions</h1>
          <p className="mt-7 max-w-3xl pl-7 text-base font-semibold leading-7 text-white sm:text-[26px]">Integrated Security Solutions for BFSI, IT Parks, Industries, and Critical Infrastructure.</p>
          <ul className="mt-8 list-disc space-y-2 pl-7 marker:text-white/50 text-base text-white sm:text-[20px]">
            {stats.map((stat) => <li key={stat}>{stat}</li>)}
          </ul>
<a
  href="#contact"
  className="mt-9 ml-7 inline-flex items-center rounded-full bg-primary px-7 py-4 text-[18px] font-semibold text-white"
>
  Consult An Integration Expert
</a>        </div>
      </div>
    </section>
  )
}

export default HeroSection
