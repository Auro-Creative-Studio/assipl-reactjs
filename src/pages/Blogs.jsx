import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal'
import heroBackground from '../assets/blogs/blogs-hero-bg.webp'
import { fetchPublishedBlogs, getMediaUrl } from '../lib/blogsApi'

function BlogCard({ post }) {
  return (
    <article className="group rounded-[10px] bg-white shadow-[9.899px_9.899px_30px_0_rgba(0,0,0,0.1)] transition-all duration-400">
      <Link to={`/blogs/${post.slug}`} className="block overflow-hidden rounded-[10px] p-5">
        <img
          src={post.image}
          alt={post.title}
          className="w-full rounded-[10px] object-cover transition-transform duration-400 ease-out group-hover:rotate-2 group-hover:scale-105"
        />
      </Link>
      <div className="px-10 pb-10 pt-0">
        <h2 className="mb-2.5 text-left text-[25px] font-semibold leading-snug text-secondary">
          <Link to={`/blogs/${post.slug}`} className="transition hover:opacity-80">
            {post.title}
          </Link>
        </h2>
        <p className="text-left text-[16px] leading-7 text-text">{post.excerpt}</p>
        <Link
          to={`/blogs/${post.slug}`}
          className="mt-6 inline-flex rounded-full bg-primary px-7.5 py-3.75 text-[15px] font-semibold text-white transition-all duration-400 hover:bg-secondary"
        >
          Read More
        </Link>
      </div>
    </article>
  )
}

function Blogs() {
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    fetchPublishedBlogs()
      .then((blogs) => {
        if (!isMounted) return

        setPosts(
          blogs.map((blog) => ({
            slug: blog.slug,
            title: blog.title,
            excerpt: blog.excerpt || '',
            image: getMediaUrl(blog.featured_image),
          }))
        )
      })
      .catch(() => {
        if (isMounted) setError('Unable to load blogs right now.')
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

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
        {error && (
          <p className="mb-8 text-center text-base font-semibold text-red-600">{error}</p>
        )}

        {!isLoading && !error && posts.length === 0 && (
          <p className="text-center text-lg text-text/70">No blogs published yet.</p>
        )}

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <Reveal key={post.slug} delay={index * 100}>
              <BlogCard post={post} />
            </Reveal>
          ))}
        </div>
      </section>
    </main>
  )
}

export default Blogs
