import { Autoplay, Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'

import bodhgayaRation from '../assets/csr/bodhgaya-provides-ration.jpg'
import drawingChildrens from '../assets/csr/drawing-childrens.jpg'
import foodProvides from '../assets/csr/food-provides.jpg'
import happyFamily from '../assets/csr/happy-family.jpg'
import happyKids from '../assets/csr/happy-kids.webp'
import mealDonate from '../assets/csr/meal-donate.jpg'
import pankhSchoolThree from '../assets/csr/pankh-evening-school-3.jpg'
import pankhSchoolFive from '../assets/csr/pankh-evening-school-5.jpg'
import readingChildrens from '../assets/csr/reading-childrens.jpg'
import csrHero from '../assets/csr/evening-school.jpg'

const heroSlides = [pankhSchoolThree, pankhSchoolFive, bodhgayaRation]

const galleryImages = [
  { src: happyKids, alt: 'Happy kids' },
  { src: happyFamily, alt: 'Happy Family' },
  { src: foodProvides, alt: 'Food Provides' },
  { src: readingChildrens, alt: 'Reading Childrens' },
  { src: drawingChildrens, alt: 'Drawing Childrens' },
  { src: mealDonate, alt: 'Meal Donate' },
]

const impactItems = [
  {
    title: '100 Active Learners:',
    text: 'Providing daily educational support and mentorship with absolutely no age restrictions, ensuring anyone seeking knowledge has a seat.',
  },
  {
    title: '3 Dedicated Educators:',
    text: 'Fully funding a staff of three full-time, passionate teachers to maintain an excellent student-to-teacher ratio.',
  },
  {
    title: '100% Free Resources:',
    text: 'Eliminating financial barriers by providing completely free education, alongside fully subsidized stationery, books, and essential learning supplies.',
  },
  {
    title: '10-Month Academic Calendar:',
    text: 'Structured to run actively for 10 months out of the year, ensuring consistent and reliable educational development.',
  },
]

function Csr() {
  return (
    <main className="bg-white">
      <section className="relative flex min-h-100 items-start overflow-hidden bg-cover bg-center px-5 pt-48 sm:px-10 md:min-h-125 md:px-8 md:pt-60 xl:px-60 xl:pt-52">
        <img
          src={csrHero}
          alt="ASSIPL CSR"
          className="absolute inset-0 h-full w-full object-cover object-top"
        />

        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(rgba(0,0,0,.3),rgba(0,0,0,.3))' }}
        />

        <div className="relative z-10 mx-auto w-full max-w-350">
          <div className="mb-4 flex items-center gap-3 text-base font-medium text-white md:text-xl">
            <a href="/" className="transition hover:text-primary">
              Home
            </a>
          </div>

          <h1 className="-ml-1 font-heading text-[32px] font-semibold leading-tight text-white sm:text-[40px] md:text-[52px] xl:text-[70px] xl:leading-none">
            CSR
          </h1>
        </div>
      </section>

      <section className="px-5 py-14 md:py-19.5">
        <div className="mx-auto grid max-w-347.5 gap-8 overflow-hidden bg-white md:grid-cols-[1fr_1fr] md:gap-16 lg:gap-16">
          <div className="relative order-2 min-h-108 overflow-hidden rounded-[20px] md:order-1 md:min-h-118">
            {heroSlides.map((image, index) => (
              <img
                key={image}
                src={image}
                alt="ASSIPL CSR community initiative"
                className="absolute inset-0 h-full w-full object-cover opacity-0 animate-[csrHeroFade_15s_ease-in-out_infinite]"
                style={{ animationDelay: `${index * 5}s` }}
              />
            ))}
          </div>

          <div className="order-1 flex bg-white px-0 py-0 md:order-2 md:min-h-118 md:items-center md:px-0 md:py-10 lg:pr-10">
            <div>
              <h2 className="text-[34px] font-bold leading-[1.16] text-secondary md:text-[42px]">
                Securing the Future. Empowering Communities.
              </h2>
              <p className="mt-6 text-justify text-[16px] leading-8 text-text md:text-left md:text-[18px]">
                At ASSIPL, our core mission is to protect enterprise infrastructure, but our deepest
                responsibility is to uplift the communities in which we operate. We believe that true
                corporate success is measured not just by technological deployment, but by the
                tangible, positive impact we leave on society.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background px-5 py-16 md:py-20">
        <div className="mx-auto max-w-340">
          <Swiper
            modules={[Autoplay, Navigation]}
            navigation
            autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
            loop
            speed={500}
            spaceBetween={40}
            slidesPerView={1}
            breakpoints={{ 768: { slidesPerView: 2 } }}
            className="csr-carousel"
          >
            {galleryImages.map((image) => (
              <SwiperSlide key={image.alt}>
                <figure className="m-0 overflow-hidden rounded-[20px] bg-white">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="-mx-px h-90 w-[calc(100%+2px)] object-cover md:h-110"
                  />
                </figure>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      <section className="px-5 py-14 md:py-18">
        <div className="mx-auto max-w-350">
          <h2 className="w-full text-center text-[34px] font-bold leading-[1.15] text-secondary md:text-[45px]">
  Project Sunshine - The Build-Operate-Run (BOR) Methodology
</h2>
          <div className="mt-6 w-full text-justify text-[16px] leading-[1.75] text-text md:text-left md:text-[18px]">
            <p>
              True social responsibility means creating systems that eventually sustain themselves
              without corporate dependency. To achieve this, ASSIPL applied our enterprise execution
              framework to philanthropy. Project Sunshine was developed using a sustainable
              Build-Operate-Run (BOR) model. After fully funding the establishment, setting up the
              infrastructure, and operationalizing the daily educational routines, ASSIPL
              successfully handed the day-to-day management over to dedicated local leadership.
              This ensures the project remains culturally grounded and locally empowered while
              consistently delivering the following impact:
            </p>
          </div>

          <ul className="mt-4 w-full list-disc space-y-0 pl-5 text-justify text-[16px] leading-[1.75] text-text md:text-left md:text-[18px]">
            {impactItems.map((item) => (
              <li key={item.title}>
                <strong className="font-bold text-text">{item.title}</strong> {item.text}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <style>{`
        @keyframes csrHeroFade {
          0%, 30% { opacity: 1; }
          36%, 94% { opacity: 0; }
          100% { opacity: 1; }
        }

        .csr-carousel {
          padding: 0 34px;
        }

        .csr-carousel .swiper-button-prev,
        .csr-carousel .swiper-button-next {
          color: #121c45;
          width: 14px;
          height: 24px;
        }

        .csr-carousel .swiper-button-prev::after,
        .csr-carousel .swiper-button-next::after {
          font-size: 14px;
          font-weight: 700;
        }
      `}</style>
    </main>
  )
}

export default Csr
