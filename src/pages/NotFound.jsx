import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal'
import { useSeoMeta } from '../hooks/useSeoMeta'

function CompassIcon() {
  return (
    <svg viewBox="0 0 32 32" className="h-16 w-16 md:h-20 md:w-20" aria-hidden="true">
      <path
        fill="currentColor"
        d="M16 1.333C7.9 1.333 1.333 7.9 1.333 16S7.9 30.667 16 30.667 30.667 24.1 30.667 16 24.1 1.333 16 1.333zm0 27.334C9.005 28.667 3.333 22.995 3.333 16S9.005 3.333 16 3.333 28.667 9.005 28.667 16 22.995 28.667 16 28.667z"
      />
      <path
        fill="currentColor"
        d="M21.372 9.622l-7.09 3.24a2.667 2.667 0 00-1.32 1.32l-3.24 7.09a1 1 0 001.328 1.328l7.09-3.24a2.667 2.667 0 001.32-1.32l3.24-7.09a1 1 0 00-1.328-1.328zm-4.63 8.052a1.333 1.333 0 111.412-1.412 1.333 1.333 0 01-1.412 1.412z"
      />
    </svg>
  )
}

function NotFound() {
  useSeoMeta({
    title: 'Page Not Found | ASSIPL',
    description: 'The page you are looking for could not be found.',
    robotsIndex: 'noindex',
  })

  return (
    <div className="bg-white font-body">
      <main>
        <section className="relative flex min-h-[calc(100vh-80px)] items-center overflow-hidden bg-background px-5 py-24 sm:px-10 md:px-8 xl:px-60">
          <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/5 md:h-96 md:w-96" />
          <div className="pointer-events-none absolute -bottom-32 -left-16 h-64 w-64 rounded-full bg-secondary/5 md:h-80 md:w-80" />

          <div className="relative mx-auto flex w-full max-w-300 flex-col items-center text-center">
            {/* <Reveal className="flex h-24 w-24 items-center justify-center rounded-full border border-accent bg-white text-primary md:h-28 md:w-28">
              <CompassIcon />
            </Reveal> */}

            <Reveal
              delay={100}
              as="h1"
              className="mt-8 font-heading text-[70px] font-bold leading-none text-secondary md:text-[130px]"
            >
              404
            </Reveal>

            <Reveal
              delay={200}
              as="h2"
              className="mt-2 text-[26px] font-semibold leading-tight text-secondary md:text-[38px]"
            >
              We couldn&apos;t find that page
            </Reveal>

            <Reveal
              delay={300}
              as="p"
              className="mt-3 max-w-130 text-body font-normal text-text"
            >
              The page you&apos;re looking for may have been moved, renamed, or no longer exists.
              Let&apos;s get you back on track.
            </Reveal>

            <Reveal delay={400} className="mt-8 flex flex-col gap-3.5 sm:flex-row">
              <Link
                to="/"
                className="rounded-full bg-primary px-8 py-3.5 text-body font-semibold capitalize text-white transition hover:bg-secondary"
              >
                Back to Home
              </Link>
              <Link
                to="/contact-us"
                className="rounded-full border border-secondary px-8 py-3.5 text-body font-semibold capitalize text-secondary transition hover:bg-secondary hover:text-white"
              >
                Contact Us
              </Link>
            </Reveal>
          </div>
        </section>
      </main>
    </div>
  )
}

export default NotFound
