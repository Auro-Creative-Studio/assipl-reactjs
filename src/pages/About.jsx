import { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Autoplay } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import logoAlba from '../assets/about-page/embedded-0.webp'
import logoAditya from '../assets/about-page/embedded-1.png'
import logoTexecom from '../assets/about-page/embedded-2.jpg'
import logoSecurico from '../assets/about-page/embedded-3.jpg'
import logoPrinciples from '../assets/about-page/embedded-4.jpg'
import logoHouston from '../assets/about-page/embedded-5.png'
import logoHoneywell from '../assets/about-page/embedded-6.webp'
import logoBosch from '../assets/about-page/embedded-7.webp'
import logoHid from '../assets/about-page/embedded-8.webp'
import logoPrama from '../assets/about-page/embedded-9.webp'
import logoTyco from '../assets/about-page/embedded-10.png'
import heroBg from '../assets/about-page/embedded-13.webp'
import trustedImage from '../assets/about-page/embedded-14.webp'
import csrSupplies from '../assets/about-page/embedded-15.jpg'
import ctaBg from '../assets/about-page/embedded-16.webp'
import statExperience from '../assets/about-page/embedded-21.png'
import statProjects from '../assets/about-page/embedded-22.png'
import statIso from '../assets/about-page/embedded-23.png'
import statTeam from '../assets/about-page/embedded-24.png'
import statIndia from '../assets/about-page/embedded-25.png'
import statService from '../assets/about-page/embedded-26.png'
import csrDistribution from '../assets/about-page/embedded-27.jpg'
import csrStudents from '../assets/about-page/embedded-28.jpg'
import careerImage from '../assets/about-page/embedded-29.webp'

const manufacturerLogos = [
  { src: logoAlba, alt: 'ALBA Urmet' },
  { src: logoBosch, alt: 'Bosch' },
  { src: logoHoneywell, alt: 'Honeywell' },
  { src: logoPrama, alt: 'Prama' },
  { src: logoTyco, alt: 'Tyco' },
  { src: logoAditya, alt: 'Aditya' },
  { src: logoTexecom, alt: 'Texecom' },
  { src: logoSecurico, alt: 'Securico' },
  { src: logoPrinciples, alt: 'Principles' },
  { src: logoHouston, alt: 'Houston' },
  { src: logoHid, alt: 'HID' },
]

const stats = [
  { icon: statExperience, title: '15+ Years Of Industry Experience.' },
  { icon: statProjects, title: '3000+ Projects Delivered Successfully.' },
  { icon: statIso, title: 'ISO 9001:2015 Certified Quality Management.' },
  { icon: statTeam, title: '40+ Dedicated Professional Team Members.' },
  { icon: statIndia, title: 'Pan-India Operational Reach.' },
  { icon: statService, title: '15+ Regional Service Locations.' },
]

function ButtonLink({ children, className = '', ...props }) {
  return (
    <a
      className={`inline-flex min-h-[46px] items-center justify-center rounded-full bg-primary px-[30px] py-[10px] text-[15px] font-semibold leading-[1.43] text-white transition hover:bg-secondary ${className}`}
      {...props}
    >
      {children}
    </a>
  )
}

function About() {
  const location = useLocation()

  useEffect(() => {
    if (!location.hash) return

    const section = document.querySelector(location.hash)
    if (!section) return

    window.setTimeout(() => {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 0)
  }, [location.hash])

  return (
    <main className="bg-white">
      <section
        className="relative flex min-h-[350px] items-center bg-cover bg-center px-5 pt-[60px] md:min-h-[450px] md:px-5 md:pt-[60px] lg:min-h-[500px] lg:px-0 lg:pt-10"
        style={{ backgroundImage: `url(${heroBg})` }}
      >
        <div className="absolute inset-0 bg-secondary/30" />
        <div className="relative mx-auto w-full max-w-[1200px]">
          <div className="max-w-[760px]">
            <h1 className="pt-5 text-[40px] font-bold leading-[1.12] text-white md:pt-0 md:text-[50px] lg:text-[65px]">
              15+ Years of Integration Excellence.
            </h1>
            <p className="mt-1 max-w-[760px] text-justify text-[18px] font-semibold leading-[1.67] text-white md:mt-4 md:text-left">
              Building resilient, scalable, and compliant safety architectures across India.
            </p>
          </div>
        </div>
      </section>

      <section className="px-5 pt-[50px] pb-0 md:py-[50px] lg:px-5 lg:py-[90px]">
        <div className="mx-auto flex max-w-[1400px] flex-col-reverse gap-12 lg:flex-row lg:items-center lg:gap-16">
          <div
            className="min-h-[256px] w-full rounded-[24px] bg-cover bg-center md:min-h-[420px] lg:w-1/2 lg:min-h-[520px]"
            style={{ backgroundImage: `url(${trustedImage})` }}
            aria-label="ASSIPL digital security infrastructure"
          />
          <div className="w-full lg:w-1/2">
            <h2 className="text-[30px] font-bold leading-[1.18] text-secondary md:text-[35px] lg:text-[45px]">
              India's Trusted Security Infrastructure Partner
            </h2>
            <div className="mt-5 space-y-5 text-justify text-[18px] leading-[1.67] text-text md:text-left">
              <p>
                Automation Systems and Solutions (India) Pvt. Ltd. (ASSIPL) is a leading system
                integrator specializing in electronic security &amp; safety solutions. Established
                in 2009, we have evolved into a premier technology-driven security infrastructure
                partner for the nation's most demanding sectors.
              </p>
              <p>
                We possess the financial and operational stability to execute massive multi-site
                rollouts. We do not just supply hardware; we deliver end-to-end systems
                integration. By managing the complete SITC lifecycle (Supply, Installation,
                Testing, and Commissioning), we ensure that complex security architectures perform
                flawlessly.
              </p>
            </div>
            <ButtonLink
              href="https://automationsystems.co.in/wp-content/uploads/2026/08/ASSIPL-WITH-VERTICAL-LOGO.pdf"
              target="_blank"
              rel="noreferrer"
              className="mt-8"
            >
              Download Brochure
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="overflow-hidden px-5 py-[50px] md:pb-[50px] md:pt-0 lg:px-0 lg:py-[80px]">
        <h2 className="mx-auto max-w-[1100px] text-center text-[30px] font-bold leading-[1.18] text-secondary md:text-[35px] lg:text-[45px]">
          Powered by the World's Leading Manufacturers
        </h2>
        <div className="mt-8 w-full px-3 md:mt-12 md:px-5 lg:px-8">
          <Swiper
            modules={[Autoplay]}
            loop
            speed={500}
            slidesPerGroup={1}
            autoplay={{ delay: 2500, disableOnInteraction: false, pauseOnMouseEnter: true }}
            spaceBetween={56}
            slidesPerView={2}
            breakpoints={{
              768: { slidesPerView: 4, spaceBetween: 76 },
              1024: { slidesPerView: 6, spaceBetween: 120 },
            }}
          >
            {manufacturerLogos.map((logo) => (
              <SwiperSlide key={logo.alt}>
                <div className="mx-auto flex h-[90px] w-[150px] items-center justify-center md:w-[175px] lg:w-[215px]">
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className="max-h-[70px] w-full object-contain"
                  loading="lazy"
                />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      <section className="bg-[#f5f5f5] px-5 py-[50px] md:px-5 md:py-[50px] lg:px-5 lg:py-[80px]">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat, index) => (
            <article
              key={stat.title}
              className={`flex min-h-[272px] flex-col justify-center rounded-[20px] border border-[#d9e1e8] px-[30px] py-[30px] md:min-h-[274px] lg:min-h-[272px] ${
                index % 2 === 0 ? 'bg-transparent' : 'bg-white'
              }`}
            >
              <div
                className={`flex h-[92px] w-[92px] items-center justify-center rounded-full border border-[#d9e1e8] ${
                  index % 2 === 0 ? 'bg-transparent' : 'bg-[#f5f5f5]'
                }`}
              >
                <img src={stat.icon} alt="" className="h-[48px] w-[48px] object-contain" loading="lazy" />
              </div>
              <h3 className="mt-8 max-w-[360px] text-[24px] font-semibold leading-[1.375] text-[#061542] md:text-center lg:text-left">
                {stat.title}
              </h3>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-white px-5 py-[50px] md:py-[50px] lg:px-5 lg:py-[90px]">
        <div className="mx-auto grid max-w-[1400px] gap-12 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-16">
          <div className="max-w-[680px]">
            <h2 className="text-[30px] font-bold leading-[1.18] text-secondary md:text-[35px] lg:text-[45px]">
              Securing the Future. Empowering Communities.
            </h2>
            <p className="mt-6 text-justify text-[18px] leading-[1.67] text-text md:text-left">
              At ASSIPL, we believe that true security extends beyond corporate infrastructure; it
              involves protecting and uplifting the communities in which we operate. Corporate
              Social Responsibility is deeply rooted in our corporate values. We are committed to
              making a tangible, positive impact on societal well-being and environmental
              sustainability.
            </p>
            <Link
              to="/csr"
              className="mt-8 inline-flex min-h-[56px] items-center justify-center rounded-full bg-primary px-10 py-[14px] text-[17px] font-semibold leading-[1.43] text-white transition hover:bg-secondary"
            >
              Discover Our CSR Initiatives
            </Link>
          </div>

          <div className="grid min-h-[318px] gap-6 md:grid-cols-[1fr_1fr]">
            <img
              src={csrSupplies}
              alt="ASSIPL CSR supplies preparation"
              className="h-[318px] w-full rounded-[18px] object-cover md:h-full"
              loading="lazy"
            />
            <div className="grid gap-6">
              <img
                src={csrDistribution}
                alt="ASSIPL CSR school supply distribution"
                className="h-[146px] w-full rounded-[18px] object-cover"
                loading="lazy"
              />
              <img
                src={csrStudents}
                alt="ASSIPL CSR students with learning kits"
                className="h-[146px] w-full rounded-[18px] object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="career" className="scroll-mt-[130px] px-5 pt-[50px] pb-0 md:py-[50px] lg:px-5 lg:py-[90px]">
        <div className="mx-auto flex max-w-[1400px] flex-col-reverse gap-[30px] lg:flex-row lg:items-center lg:gap-16">
          <div className="w-full overflow-hidden rounded-[24px] lg:w-1/2">
            <img
              src={careerImage}
              alt="ASSIPL careers and enterprise security team"
              className="h-[300px] w-full object-cover object-center md:h-[400px] lg:h-[520px]"
              loading="lazy"
            />
          </div>
          <div className="w-full lg:w-1/2">
            <h2 className="text-[30px] font-bold leading-[1.18] text-secondary md:text-[35px] lg:text-[45px]">
              Build the Future of Enterprise Security
            </h2>
            <p className="mt-5 text-justify text-[18px] leading-[1.67] text-text md:text-left">
              Join a dedicated workforce of 40+ professional team members passionate about
              engineering smarter security. As we continue to expand our Pan-India operations
              across our 15+ regional service locations, ASSIPL is actively seeking driven
              integration engineers, project managers, and technical specialists who thrive in
              high-stakes environments.
            </p>
            <Link
              to="/career"
              className="mt-8 inline-flex min-h-[46px] items-center justify-center rounded-full bg-primary px-[30px] py-[10px] text-[15px] font-semibold leading-[1.43] text-white transition hover:bg-secondary"
            >
              Join Our Team
            </Link>
          </div>
        </div>
      </section>

      <section className="pb-0">
        <div
          className="min-h-[415px] bg-cover bg-center px-5 py-[80px] md:px-0"
          style={{
            backgroundImage: `linear-gradient(rgba(18,28,69,.28),rgba(18,28,69,.28)), url(${ctaBg})`,
          }}
        >
          <div className="mx-auto flex min-h-[255px] max-w-[1680px] flex-col items-start justify-center gap-8 md:flex-row md:items-center md:justify-between">
            <div className="max-w-[720px] text-left">
              <h3 className="text-[32px] font-semibold leading-[1.125] md:text-[45px] text-white">
                Ready to Standardize Your Enterprise Infrastructure?
              </h3>
              <p className="mt-[20px] max-w-[720px] text-justify text-[18px] font-normal leading-[1.67] text-white md:text-left">
                Connect with our systems integration experts to discuss multi-site rollouts, vault
                security, and scalable safety architectures.
              </p>
            </div>
            <Link
              to="/contact-us"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-[40px] py-[14px] text-[18px] font-medium capitalize leading-[1.5] text-white transition hover:bg-secondary hover:text-white md:mr-[20px]"
            >
              Contact Our Engineering Team
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}

export default About
