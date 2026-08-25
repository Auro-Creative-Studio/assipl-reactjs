import { Image, Search } from 'lucide-react'

function About() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-10">
        <section className="max-w-3xl">
          <p className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase text-primary">
            <Search className="h-4 w-4" aria-hidden="true" />
            Page routing
          </p>
          <h1 className="text-4xl font-bold text-secondary">About this setup</h1>
          <p className="mt-5 text-lg leading-8 text-text">
            This page proves React Router is working. Use this pattern to add more routes as the
            site grows.
          </p>
          <div className="mt-8 inline-flex items-center gap-3 rounded-lg border border-border bg-white px-5 py-4 text-text">
            <Image className="h-5 w-5 text-primary" aria-hidden="true" />
            Carousel and image slider support is available through Swiper.
          </div>
        </section>
    </main>
  )
}

export default About
