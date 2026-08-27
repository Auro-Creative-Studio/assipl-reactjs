import { Autoplay } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import Reveal from './Reveal'
import { testimonials as defaultTestimonials, clientLogos as defaultClientLogos } from '../data'
import { getMediaUrl } from '../lib/homeApi'

function ClientsSection({ data }) {
  const heading = data?.clients_heading || 'Major Clients'

  const testimonials = data?.testimonials?.length
    ? data.testimonials.map((item) => ({
        quote: item.quote || '',
        company: item.company || '',
        logo: getMediaUrl(item.logo),
      }))
    : defaultTestimonials

  const clientLogos = data?.client_logos?.length
    ? data.client_logos.map((item) => ({ name: item.name || '', logo: getMediaUrl(item.logo) }))
    : defaultClientLogos

  const sliderClientLogos = clientLogos
  const testimonialSlides = [...testimonials, ...testimonials]

  return (
    <section className="bg-white pt-13 pb-20.5">
      <div className="mx-auto w-full px-5 sm:px-8 lg:px-5">
        <Reveal as="h2" className="mx-auto w-fit text-4xl font-bold leading-tight text-secondary sm:text-[64px]">
          {heading}
        </Reveal>

        <div className="mt-9.5">
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
        <article className="flex h-full min-h-94.25lex-col justify-between rounded-[22px] border border-[#d5ddeb] bg-white px-8 pt-15.5b-[53px]">
          <p className="text-justify text-[16px] leading-normal text-[#63708a] md:text-left sm:text-[20px]">
            &quot; {item.quote} &quot;
          </p>

          <img
            src={item.logo}
            alt={item.company}
            className="mt-8 h-12 w-auto max-w-47.5 object-contain object-left"
          />
        </article>
      </SwiperSlide>
    ))}
  </Swiper>
</div>

        <div className="mx-auto mt-22.5 max-w-375 overflow-hidden">
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
                <div className="mx-auto flex h-24.5 w-full items-center justify-center">
                  <img src={item.logo} alt={item.name} className="max-h-21.5 w-full object-contain" loading="lazy" />
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
