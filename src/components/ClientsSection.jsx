import { Autoplay } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import Reveal from './Reveal'
import { testimonials, clientLogos } from '../data'

const featuredLogoOrder = ['Union Bank of India', 'SBI', 'Shell Global', 'Axis Bank']
const featuredClientLogos = featuredLogoOrder
  .map((name) => clientLogos.find((logo) => logo.name === name))
  .filter(Boolean)
const sliderClientLogos = [
  ...featuredClientLogos,
  ...clientLogos.filter((logo) => !featuredLogoOrder.includes(logo.name)),
]
const testimonialSlides = [...testimonials, ...testimonials]

function ClientsSection() {
  return (
    <section className="bg-white pt-[52px] pb-[82px]">
      <div className="mx-auto w-full px-5 sm:px-8 lg:px-5">
        <Reveal as="h2" className="mx-auto w-fit text-4xl font-bold leading-tight text-secondary sm:text-[64px]">
          Major Clients
        </Reveal>

        <div className="mt-[38px]">
  <Swiper
    className="[&_.swiper-wrapper]:items-stretch [&_.swiper-slide]:h-auto"
    modules={[Autoplay]}
    loop={true}
    speed={700}
    autoplay={{
      delay: 2500,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    }}
    spaceBetween={24}
    slidesPerView={1.1}
    slidesPerGroup={1}
    grabCursor={true}
    allowTouchMove={true}
    breakpoints={{
      640: {
        slidesPerView: 1.6,
        spaceBetween: 24,
      },
      768: {
        slidesPerView: 2.2,
        spaceBetween: 26,
      },
      1024: {
        slidesPerView: 4,
        spaceBetween: 24,
      },
    }}
  >
    {testimonialSlides.map((item, index) => (
      <SwiperSlide key={`${item.company}-${index}`}>
        <article className="flex h-full min-h-[377px] flex-col justify-between rounded-[22px] border border-[#d5ddeb] bg-white px-8 pt-[62px] pb-[53px]">
          <p className="text-justify text-[16px] leading-[1.5] text-[#63708a] md:text-left sm:text-[20px]">
            &quot; {item.quote} &quot;
          </p>

          <img
            src={item.logo}
            alt={item.company}
            className="mt-8 h-[48px] w-auto max-w-[190px] object-contain object-left"
          />
        </article>
      </SwiperSlide>
    ))}
  </Swiper>
</div>

        <div className="mx-auto mt-[90px] max-w-[1500px] overflow-hidden">
        <Swiper
  modules={[Autoplay]}
  loop={true}
  speed={800}
  autoplay={{
    delay: 2500,
    disableOnInteraction: false,
    pauseOnMouseEnter: true,
  }}
  spaceBetween={40}
  slidesPerView={2}
  slidesPerGroup={1}
  allowTouchMove={true}
  grabCursor={true}
  breakpoints={{
    640: {
      slidesPerView: 3,
      spaceBetween: 40,
    },
    1024: {
      slidesPerView: 4,
      spaceBetween: 70,
    },
  }}
>
            {sliderClientLogos.map((item) => (
              <SwiperSlide key={item.name}>
                <div className="mx-auto flex h-[98px] w-full items-center justify-center">
                  <img src={item.logo} alt={item.name} className="max-h-[86px] w-full object-contain" loading="lazy" />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  )
}

export default ClientsSection
