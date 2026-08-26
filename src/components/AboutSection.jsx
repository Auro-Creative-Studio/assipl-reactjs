import aboutImage from '../assets/home/about-image.webp'

function AboutSection() {
  return (
    <section id="about" className="bg-white py-8 lg:py-8">
      <div className="mx-auto grid max-w-360 gap-12 px-5 sm:px-8 lg:grid-cols-2 lg:items-center lg:gap-20 lg:px-12">
        <div className="overflow-hidden rounded-2xl">
          <img src={aboutImage} alt="ASSIPL ceiling-mounted security camera" className="aspect-4/3 h-full w-full object-cover" />
        </div>
        <div>
          <h2 className="text-3xl font-bold leading-tight text-secondary sm:text-4xl lg:text-[42px]">
            Precision Engineering. Nationwide Support.
          </h2>
          <p className="mt-6 text-base leading-8 text-text sm:text-lg">
            Automation Systems and Solutions (India) Pvt. Ltd. (ASSIPL) specializes in low voltage system
            integration delivering robust electronic security &amp; safety solutions. We excel in complex,
            multi-site rollouts and critical infrastructure for India&apos;s most demanding sectors. Our scalable
            architecture ensures your infrastructure is protected today and primed for future integrations,
            including AI Analytics and Smart Building integration.
          </p>
          <a
            href="/about"
            className="mt-8 inline-flex items-center rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-secondary"
          >
            Know More
          </a>
        </div>
      </div>
    </section>
  )
}

export default AboutSection
