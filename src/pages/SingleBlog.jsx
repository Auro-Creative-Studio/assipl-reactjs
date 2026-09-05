import { ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Reveal from '../components/Reveal'
import RichText from '../components/RichText'
import { fetchBlogBySlug, getMediaUrl } from '../lib/blogsApi'
import { useSeoMeta } from '../hooks/useSeoMeta'

function ImageSection({ image, title, body, reverse = false }) {
  return (
    <section className="mx-auto max-w-300 px-5 py-5">
      <div className={`flex flex-col items-center gap-8 md:gap-7.5 lg:flex-row ${reverse ? 'lg:flex-row-reverse' : ''}`}>
        <Reveal className="w-full lg:w-1/2">
          <img src={image} alt={title} className="w-full rounded-2xl object-cover" />
        </Reveal>
        <Reveal delay={100} className="w-full pt-2.5 lg:w-1/2">
          {title && (
            <h2 className="text-[28px] font-semibold leading-[1.23] tracking-[-0.015em] text-secondary md:text-[32px]">
              {title}
            </h2>
          )}
          <RichText html={body} className="mt-4" />
        </Reveal>
      </div>
    </section>
  )
}

function TextSection({ title, body }) {
  return (
    <section className="mx-auto max-w-300 px-5 py-5">
      <Reveal>
        {title && (
          <h2 className="text-[28px] font-semibold leading-[1.23] tracking-[-0.015em] text-secondary md:text-[32px]">
            {title}
          </h2>
        )}
        <RichText html={body} className="mt-4" />
      </Reveal>
    </section>
  )
}

function SingleBlog() {
  const { slug } = useParams()
  const [blog, setBlog] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    setIsLoading(true)
    setError('')

    fetchBlogBySlug(slug)
      .then((data) => {
        if (isMounted) setBlog(data)
      })
      .catch(() => {
        if (isMounted) setError('This blog could not be found.')
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [slug])

  useSeoMeta({
    title: blog?.meta_title || (blog?.title ? `${blog.title} | ASSIPL` : undefined),
    description: blog?.meta_description || blog?.excerpt,
    keywords: blog?.meta_keywords,
    ogTitle: blog?.og_title,
    ogDescription: blog?.og_description,
    ogImage: blog?.og_image || blog?.featured_image,
    robotsIndex: blog?.robots_index,
    robotsFollow: blog?.robots_follow,
    structuredData: blog
      ? {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: blog.title,
          description: blog.excerpt || undefined,
          image: getMediaUrl(blog.hero_image || blog.featured_image) || undefined,
          datePublished: blog.created_at,
          dateModified: blog.updated_at,
          mainEntityOfPage: window.location.href,
          publisher: {
            '@type': 'Organization',
            name: 'ASSIPL',
            logo: { '@type': 'ImageObject', url: `${window.location.origin}/favicon.webp` },
          },
        }
      : undefined,
  })

  if (isLoading) {
    return (
      <main className="flex min-h-150 items-center justify-center bg-white">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-secondary/20 border-t-secondary" />
      </main>
    )
  }

  if (error || !blog) {
    return (
      <main className="flex min-h-150 flex-col items-center justify-center gap-4 bg-white px-5 text-center">
        <p className="text-xl font-semibold text-secondary">{error || 'This blog could not be found.'}</p>
        <Link to="/blogs" className="rounded-full bg-primary px-7 py-3 text-body font-semibold text-white transition hover:bg-secondary">
          Back to Blogs
        </Link>
      </main>
    )
  }

  const heroBackground = getMediaUrl(blog.hero_image || blog.featured_image)
  const contentBlocks = Array.isArray(blog.content_blocks) ? blog.content_blocks : []

  return (
    <main className="bg-white">
      <section
        className="relative flex min-h-100 items-start bg-cover bg-center px-5 pt-48 sm:px-10 md:min-h-125 md:px-8 md:pt-60 xl:px-60 xl:pt-52"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${heroBackground})`,
        }}
      >
        <div className="mx-auto w-full max-w-300">
          <div className="mb-4 flex items-center gap-3 text-base font-medium text-white md:text-xl">
            <a href="/" className="transition hover:text-primary">
              Home
            </a>
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
            <Link to="/blogs" className="transition hover:text-primary">
              Blogs
            </Link>
          </div>
          <Reveal
            as="h1"
            className="-ml-1 max-w-260 font-heading text-[32px] font-semibold leading-tight text-white sm:text-[40px] md:text-[52px] xl:text-[60px] xl:leading-tight"
          >
            {blog.title}
          </Reveal>
        </div>
      </section>

      {blog.description && (
        <section className="mx-auto max-w-300 px-5 pt-16 pb-5">
          <Reveal>
            <p className="text-body text-text">{blog.description}</p>
          </Reveal>
        </section>
      )}

      {contentBlocks.map((block, index) =>
        block.type === 'image_text' ? (
          <ImageSection
            key={block.id || index}
            image={getMediaUrl(block.image)}
            title={block.heading}
            body={block.body}
            reverse={block.image_position === 'right'}
          />
        ) : (
          <TextSection key={block.id || index} title={block.heading} body={block.body} />
        )
      )}

      <div className="pb-20" />
    </main>
  )
}

export default SingleBlog
