import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal'
import heroBackground from '../assets/blogs/blogs-hero-bg.webp'
import cctvImage from '../assets/blogs/cctv-surveillance-systems-for-commercial-security.webp'
import gateImage from '../assets/blogs/6-ways-automated-gate-barriers-keep-you-safe.webp'
import fireAlarmImage from '../assets/blogs/best-fire-alarm-system-for-flat-buildings.webp'

const posts = [
  {
    image: cctvImage,
    title: 'CCTV Surveillance Systems for Commercial Security',
    excerpt: 'CCTV surveillance systems have moved beyond simple recording today, they…',
    href: '/blogs/cctv-surveillance-systems-for-commercial-security',
  },
  {
    image: gateImage,
    title: '6 Ways Automated Gate Barriers Keep You Safe',
    excerpt: 'Discover 6 ways automated gate barriers improve vehicle security, prevent…',
    href: 'https://automationsystems.co.in/2026/07/30/6-ways-automated-gate-barriers-keep-you-safe/',
  },
  {
    image: fireAlarmImage,
    title: 'Best Fire Alarm System for Flat Buildings',
    excerpt: 'Choosing the best fire alarm system for flat buildings is…',
    href: 'https://automationsystems.co.in/2026/07/29/best-fire-alarm-system-for-flat-buildings/',
  },
]

function BlogCard({ post }) {
  const isInternal = post.href.startsWith('/')
  const LinkTag = isInternal ? Link : 'a'
  const linkProps = isInternal
    ? { to: post.href }
    : { href: post.href, target: '_blank', rel: 'noreferrer' }

  return (
    <article className="group rounded-[10px] bg-white shadow-[9.899px_9.899px_30px_0_rgba(0,0,0,0.1)] transition-all duration-400">
      <LinkTag {...linkProps} className="block overflow-hidden rounded-[10px] p-5">
        <img
          src={post.image}
          alt={post.title}
          className="w-full rounded-[10px] object-cover transition-transform duration-400 ease-out group-hover:rotate-2 group-hover:scale-105"
        />
      </LinkTag>
      <div className="px-10 pb-10 pt-0">
        <h2 className="mb-2.5 text-left text-[25px] font-semibold leading-snug text-secondary">
          <LinkTag {...linkProps} className="transition hover:opacity-80">
            {post.title}
          </LinkTag>
        </h2>
        <p className="text-left text-[16px] leading-7 text-text">{post.excerpt}</p>
        <LinkTag
          {...linkProps}
          className="mt-6 inline-flex rounded-full bg-primary px-7.5 py-3.75 text-[15px] font-semibold text-white transition-all duration-400 hover:bg-secondary"
        >
          Read More
        </LinkTag>
      </div>
    </article>
  )
}

function Blogs() {
  return (
    <main className="bg-white">
      <section
        className="relative flex min-h-100 items-start bg-cover bg-center px-5 pt-48 sm:px-10 md:min-h-125 md:px-8 md:pt-60 xl:px-60 xl:pt-52"
        style={{
          backgroundImage: `linear-gradient(rgba(18, 28, 69, 0.3), rgba(18, 28, 69, 0.3)), url(${heroBackground})`,
        }}
      >
        <div className="mx-auto w-full max-w-350">
          <div className="mb-4 flex items-center gap-3 text-base font-medium text-white md:text-xl">
            <a href="/" className="transition hover:text-primary">
              Home
            </a>
          </div>
          <Reveal
            as="h1"
            className="-ml-1 font-heading text-[32px] font-semibold leading-tight text-white sm:text-[40px] md:text-[52px] xl:text-[70px] xl:leading-none"
          >
            Blogs
          </Reveal>
        </div>
      </section>

      <section className="mx-auto max-w-350 px-5 py-20">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <Reveal key={post.title} delay={index * 100}>
              <BlogCard post={post} />
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  )
}

export default Blogs
