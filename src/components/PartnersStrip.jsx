
import Reveal from './Reveal'
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
import { Autoplay } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'

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
function PartnersStrip() {
  return (
    <section className="overflow-hidden bg-white px-5 py-12 md:pb-12 md:pt-0 lg:px-0 lg:py-20">
      <Reveal as="h2" className="mx-auto max-w-275 text-center text-[30px] font-bold leading-[1.18] text-secondary md:text-[35px] lg:text-[45px]">
        Powered by the World&apos;s Leading Manufacturers
      </Reveal>
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
              <div className="mx-auto flex h-22 w-38 items-center justify-center md:w-44 lg:w-54">
                <img src={logo.src} alt={logo.alt} className="max-h-14 w-full object-contain" loading="lazy" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}

export default PartnersStrip
