import { Autoplay } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import Reveal from './Reveal'
import { testimonials, clientLogos } from '../data'

function ClientsSection() {
  return (
    <section className="bg-white py-20 ">
      <div className="mx-auto max-w-360 px-5 sm:px-8 lg:px-12">
        <Reveal as="h2" className="mx-auto w-fit text-4xl font-bold leading-tight text-secondary sm:text-[64px]">
          Major Clients
        </Reveal>

        <div className="mt-14">
  <Swiper
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
        slidesPerView: 3,
        spaceBetween: 28,
      },
    }}
  >
    {testimonials.map((item) => (
      <SwiperSlide key={item.company}>
        <article className="flex h-full min-h-[260px] flex-col justify-between rounded-3xl border border-black/10 bg-white p-8">
          <p className="text-[17px] leading-7 text-secondary/70">
            &quot; {item.quote} &quot;
          </p>

          <img
            src={item.logo}
            alt={item.company}
            className="mt-8 h-[70px] w-auto max-w-[190px] object-contain object-left"
          />
        </article>
      </SwiperSlide>
    ))}
  </Swiper>
</div>

        <div className="mt-14 overflow-hidden">
        <Swiper
  modules={[Autoplay]}
  loop={true}
  speed={800}
  autoplay={{
    delay: 2500,
    disableOnInteraction: false,
    pauseOnMouseEnter: true,
  }}
  spaceBetween={30}
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
      slidesPerView: 5,
      spaceBetween: 60,
    },
  }}
>
            {clientLogos.map((item) => (
              <SwiperSlide key={item.name}>
                <div className="mx-auto flex h-16 w-40 items-center justify-center">
                  <img src={item.logo} alt={item.name} className="max-h-14 w-full object-contain" loading="lazy" />
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
