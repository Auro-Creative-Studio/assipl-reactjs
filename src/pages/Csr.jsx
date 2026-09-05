
import axios from 'axios'
import { useEffect, useState } from 'react'
import { Autoplay, Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import Reveal from '../components/Reveal'
import { useSeoMeta } from '../hooks/useSeoMeta'

import bodhgayaRation from '../assets/csr/bodhgaya-provides-ration.jpg'
import drawingChildrens from '../assets/csr/drawing-childrens.jpg'
import eveningSchool from '../assets/csr/evening-school.jpg'
import foodProvides from '../assets/csr/food-provides.jpg'
import happyFamily from '../assets/csr/happy-family.jpg'
import happyKids from '../assets/csr/happy-kids.webp'
import mealDonate from '../assets/csr/meal-donate.jpg'
import pankhSchoolThree from '../assets/csr/pankh-evening-school-3.jpg'
import pankhSchoolFive from '../assets/csr/pankh-evening-school-5.jpg'
import readingChildrens from '../assets/csr/reading-childrens.jpg'

const FALLBACK_CSR = {
  banner_image: eveningSchool,
  intro_title: 'Securing the Future. Empowering Communities.',
  intro_description:
    '<p>At ASSIPL, our core mission is to protect enterprise infrastructure, but our deepest responsibility is to uplift the communities in which we operate. We believe that true corporate success is measured not just by technological deployment, but by the tangible, positive impact we leave on society.</p>',
  project_title: 'Project Sunshine - The Build-Operate-Run (BOR) Methodology',
  project_description: `
    <p>True social responsibility means creating systems that eventually sustain themselves without corporate dependency. To achieve this, ASSIPL applied our enterprise execution framework to philanthropy.</p>
    <p>Project Sunshine was developed using a sustainable Build-Operate-Run (BOR) model. After fully funding the establishment, setting up the infrastructure, and operationalizing the daily educational routines, ASSIPL successfully handed the day-to-day management over to dedicated local leadership.</p>
    <p>This ensures the project remains culturally grounded and locally empowered while consistently delivering the following impact:</p>
    <ul>
      <li><strong>100 Active Learners:</strong> Providing daily educational support and mentorship with absolutely no age restrictions, ensuring anyone seeking knowledge has a seat.</li>
      <li><strong>3 Dedicated Educators:</strong> Fully funding a staff of three full-time, passionate teachers to maintain an excellent student-to-teacher ratio.</li>
      <li><strong>100% Free Resources:</strong> Eliminating financial barriers by providing completely free education, alongside fully subsidized stationery, books, and essential learning supplies.</li>
      <li><strong>10-Month Academic Calendar:</strong> Structured to run actively for 10 months out of the year, ensuring consistent and reliable educational development.</li>
    </ul>
  `.trim(),
  intro_images: [
    { id: 'fallback-intro-1', image: pankhSchoolThree, sort_order: 0, status: true },
    { id: 'fallback-intro-2', image: pankhSchoolFive, sort_order: 1, status: true },
    { id: 'fallback-intro-3', image: bodhgayaRation, sort_order: 2, status: true },
  ],
  slider_images: [
    { id: 'fallback-slide-1', image: happyKids, sort_order: 0, status: true },
    { id: 'fallback-slide-2', image: happyFamily, sort_order: 1, status: true },
    { id: 'fallback-slide-3', image: foodProvides, sort_order: 2, status: true },
    { id: 'fallback-slide-4', image: readingChildrens, sort_order: 3, status: true },
    { id: 'fallback-slide-5', image: drawingChildrens, sort_order: 4, status: true },
    { id: 'fallback-slide-6', image: mealDonate, sort_order: 5, status: true },
  ],
}

const API_ROOT = (
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000/api'
).replace(/\/$/, '')

const BACKEND_ORIGIN = (import.meta.env.VITE_MEDIA_BASE_URL || API_ROOT.replace(/\/api$/, '')).replace(/\/$/, '')
const CSR_ENDPOINT = `${API_ROOT}/csr`

const getMediaUrl = (value = '') => {
  const textValue = String(value || '').trim()

  if (!textValue) return ''
  if (
    textValue.startsWith('http') ||
    textValue.startsWith('blob:') ||
    textValue.startsWith('data:') ||
    textValue.startsWith('/')
  ) {
    return textValue
  }

  return `${BACKEND_ORIGIN}/${textValue}`
}

const sortImages = (items) =>
  (Array.isArray(items) ? items : [])
    .filter((item) => item.status !== false)
    .slice()
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))

function Csr() {
  const [csr, setCsr] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const fetchCsr = async () => {
      try {
        const response = await axios.get(CSR_ENDPOINT)
        const data = response.data?.data
        const record = Array.isArray(data) ? data[0] : data

        if (isMounted) {
          setCsr(record || FALLBACK_CSR)
        }
      } catch {
        if (isMounted) {
          setCsr(FALLBACK_CSR)
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void fetchCsr()

    return () => {
      isMounted = false
    }
  }, [])

  useSeoMeta({
    title: csr?.meta_title || 'CSR | ASSIPL',
    description:
      csr?.meta_description ||
      'Corporate social responsibility initiatives by Automation Systems and Solutions (India) Pvt. Ltd.',
    keywords: csr?.meta_keywords,
    ogTitle: csr?.og_title,
    ogDescription: csr?.og_description,
    ogImage: csr?.og_image,
    robotsIndex: csr?.robots_index,
    robotsFollow: csr?.robots_follow,
  })

  if (isLoading) {
    return (
      <main className="flex min-h-123.75 items-center justify-center bg-white">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-secondary" />
      </main>
    )
  }

  const introImages = sortImages(csr.intro_images)
  const sliderImages = sortImages(csr.slider_images)

  return (
    <main className="bg-white">
      <section className="relative flex min-h-123.75 items-center overflow-hidden px-5 pb-8 pt-28 md:pb-12 lg:pt-32">
        {csr.banner_image && (
          <img
            src={getMediaUrl(csr.banner_image)}
            alt="ASSIPL CSR"
            className="absolute inset-0 h-full w-full object-cover object-top"
          />
        )}

        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(rgba(0,0,0,.3),rgba(0,0,0,.3))' }}
        />

        <div className="relative z-10 mx-auto w-full max-w-297.5">
          <a
            href="/"
            className="text-[24px] font-bold text-white transition hover:text-white"
          >
            Home
          </a>

          <Reveal as="h1" className="mt-5 text-5xl font-bold leading-none text-white! md:text-[64px]">
            CSR
          </Reveal>
        </div>
      </section>

      {(introImages.length > 0 || csr.intro_title || csr.intro_description) && (
        <section className="px-5 py-10 md:py-19.5">
          <div className="mx-auto grid max-w-347.5 gap-6 overflow-hidden bg-white md:grid-cols-[1fr_1fr] md:gap-16">
            {introImages.length > 0 && (
              <div className="relative order-2 min-h-64 overflow-hidden rounded-[20px] md:order-1 md:min-h-118">
                {introImages.map((item, index) => (
                  <img
                    key={item.id || item.image}
                    src={getMediaUrl(item.image)}
                    alt="ASSIPL CSR community initiative"
                    className="absolute inset-0 h-full w-full object-cover opacity-0 animate-[csrHeroFade_15s_ease-in-out_infinite]"
                    style={{ animationDelay: `${index * 5}s` }}
                  />
                ))}
              </div>
            )}

            <Reveal
              delay={150}
              className="order-1 flex items-center bg-white px-0 py-4 md:order-2 md:min-h-118 md:px-0 md:py-10 lg:pr-10"
            >
              <div>
                {csr.intro_title && (
                  <h2 className="text-[30px] font-bold leading-[1.16] text-secondary md:text-[45px]">
                    {csr.intro_title}
                  </h2>
                )}
                {csr.intro_description && (
                  <div
                    className="mt-6 text-left text-body text-text md:text-left [&_p]:mt-4 [&_p:first-child]:mt-0"
                    dangerouslySetInnerHTML={{ __html: csr.intro_description }}
                  />
                )}
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {sliderImages.length > 0 && (
        <section className="bg-background px-2 py-8 md:px-5 md:py-20">
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
              {sliderImages.map((item) => (
                <SwiperSlide key={item.id || item.image}>
                  <figure className="m-0 overflow-hidden rounded-[20px] bg-white">
                    <img
                      src={getMediaUrl(item.image)}
                      alt="ASSIPL CSR gallery"
                      className="-mx-px h-auto w-[calc(100%+2px)] object-contain md:h-110 md:object-cover"
                    />
                  </figure>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>
      )}

      {(csr.project_title || csr.project_description) && (
        <section className="px-5 py-14 md:py-18">
          <Reveal className="mx-auto max-w-350">
            {csr.project_title && (
              <h2 className="w-full text-center text-[30px] font-bold leading-[1.15] text-secondary md:text-[45px]">
                {csr.project_title}
              </h2>
            )}
            {csr.project_description && (
              <div
                className="mt-6 w-full text-left text-body text-text md:text-left [&_li]:mt-0 [&_p]:mt-4 [&_p:first-child]:mt-0 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-5"
                dangerouslySetInnerHTML={{ __html: csr.project_description }}
              />
            )}
          </Reveal>
        </section>
      )}

      <style>{`
        @keyframes csrHeroFade {
          0%, 30% { opacity: 1; }
          36%, 94% { opacity: 0; }
          100% { opacity: 1; }
        }

        .csr-carousel {
          padding: 0 24px;
        }

        @media (min-width: 768px) {
          .csr-carousel {
            padding: 0 34px;
          }
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
