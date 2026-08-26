import { Autoplay } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import Reveal from './Reveal'
import { testimonials, clientLogos } from '../data'

function ClientsSection() {
  return (
    <section className="bg-white py-20 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-360 px-5 sm:px-8 lg:px-12">
        <Reveal as="h2" className="mx-auto w-fit border-l-4 border-secondary pl-6 text-4xl font-bold leading-tight text-secondary sm:text-5xl">
          Major Clients
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((item, index) => (
            <Reveal as="article" key={item.company} delay={(index % 4) * 100} className="flex flex-col rounded-3xl border border-black/10 bg-white p-7">
              <p className="text-[15px] leading-7 text-secondary/70">&quot; {item.quote} &quot;</p>
              <img src={item.logo} alt={item.company} className="mt-6 h-12 w-auto object-contain object-left" />
            </Reveal>
          ))}
        </div>

        <div className="mt-14 overflow-hidden">
          <Swiper
            modules={[Autoplay]}
            loop
            speed={4000}
            slidesPerGroup={1}
            autoplay={{ delay: 0, disableOnInteraction: false, pauseOnMouseEnter: true }}
            spaceBetween={64}
            slidesPerView={2}
            allowTouchMove={false}
            breakpoints={{
              640: { slidesPerView: 3, spaceBetween: 80 },
              1024: { slidesPerView: 5, spaceBetween: 100 },
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
