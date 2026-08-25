import { ArrowRight, LayoutGrid } from 'lucide-react'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import heroImg from '../assets/hero.png'

const slides = [
  {
    title: 'Modern React foundation',
    description: 'Vite, React Router, Tailwind, SEO tags, icons, and slider support are wired in.',
    image: heroImg,
  },
  {
    title: 'Ready for pages',
    description: 'Add public pages, landing sections, and nested routes without changing the root setup.',
    image: heroImg,
  },
  {
    title: 'Reusable UI packages',
    description: 'Lucide icons and Swiper are available for buttons, features, banners, and galleries.',
    image: heroImg,
  },
]

function Home() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
        <section className="grid items-center gap-8 md:grid-cols-[1fr_420px]">
          <div>
            <p className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase text-primary">
              <LayoutGrid className="h-4 w-4" aria-hidden="true" />
              Project setup complete
            </p>
            <h1 className="max-w-3xl text-4xl font-bold leading-tight text-secondary md:text-6xl">
              React app foundation with the core packages installed.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-text">
              Tailwind handles styling, React Router handles pages, Lucide provides icons, and
              Swiper is ready for carousels.
            </p>
            <a
              href="#carousel"
              className="mt-8 inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-primary/90"
            >
              View carousel
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
          <div id="carousel" className="overflow-hidden rounded-lg border border-border bg-white shadow-sm">
            <Swiper
              modules={[Autoplay, Navigation, Pagination]}
              autoplay={{ delay: 3500, disableOnInteraction: false }}
              loop
              navigation
              pagination={{ clickable: true }}
            >
              {slides.map((slide) => (
                <SwiperSlide key={slide.title}>
                  <article className="min-h-98 p-6">
                    <div className="flex aspect-video items-center justify-center rounded-md bg-background">
                      <img src={slide.image} alt="" className="h-32 w-32 object-contain" />
                    </div>
                    <h2 className="mt-6 text-2xl font-semibold text-secondary">{slide.title}</h2>
                    <p className="mt-3 leading-7 text-text">{slide.description}</p>
                  </article>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>
    </main>
  )
}

export default Home
