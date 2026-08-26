import { ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Reveal from '../components/Reveal'
import RichText from '../components/RichText'
import contactBackground from '../assets/products/video-surveillance-bg-3.webp'
import { fetchProductBySlug, fetchPublishedProducts, getMediaUrl } from '../lib/productsApi'

function ProductSidebar({ productLinks, currentSlug, className = '' }) {
  return (
    <aside className={`grid gap-12 md:grid-cols-2 lg:grid-cols-1 lg:sticky lg:top-12 lg:self-start ${className}`}>
      <Reveal className="overflow-hidden rounded-3xl border border-border bg-white px-5 py-8">
        <nav aria-label="Products">
          <ul className="space-y-2">
            {productLinks.map((link) => {
              const isActive = link.slug === currentSlug

              return (
                <li key={link.slug}>
                  <Link
                    to={`/products/${link.slug}`}
                    className={`block rounded-xl px-2 py-3 text-lg transition ${
                      isActive
                        ? 'bg-secondary text-white'
                        : 'text-secondary hover:bg-secondary hover:text-white'
                    }`}
                  >
                    {link.title}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </Reveal>

      <Reveal
        delay={100}
        className="relative isolate flex h-125 flex-col items-center overflow-hidden rounded-2xl px-6 pb-8 pt-10 text-center text-white"
      >
        <img
          src={contactBackground}
          alt=""
          className="absolute inset-0 -z-20 h-full w-full object-cover grayscale"
        />
        <div className="absolute inset-0 -z-10 bg-linear-to-t from-black via-black/50 to-black/0" />

        <div className="mt-auto">
          <h3 className="text-[28px] font-semibold leading-tight text-white">Get in Touch</h3>
          <div className="mx-auto my-4 h-px w-12 bg-white/50" />
          <div className="space-y-1 text-[15px] leading-7 text-white">
            <a href="mailto:assipl@automationsystems.co.in" className="block">
              assipl@automationsystems.co.in
            </a>
            <a href="tel:08041692300" className="block">
              080 – 41692300 / 080 – 43751024
            </a>
          </div>
          <a
            href="#"
            className="mt-6 inline-flex rounded-full bg-primary px-8 py-2 text-sm font-semibold text-white transition hover:bg-secondary"
          >
            Enquiry Now
          </a>
        </div>
      </Reveal>
    </aside>
  )
}

function CapabilityCard({ item, index }) {
  const tone = index % 2 === 0 ? 'white' : 'muted'

  return (
    <article
      className={`flex h-full flex-col rounded-[10px] border border-accent px-8 py-12 transition-[background-color,transform] duration-300 hover:scale-[1.02] ${
        tone === 'white' ? 'bg-white hover:bg-background' : 'bg-background hover:bg-white'
      }`}
    >
      <h3 className="text-[24px] font-semibold leading-tight text-secondary">{item.title}</h3>
      <RichText html={item.body} className="mt-5 text-[16px] leading-7 text-text [&_ul]:mt-0" />
    </article>
  )
}

function SingleProduct() {
  const { slug } = useParams()
  const [product, setProduct] = useState(null)
  const [productLinks, setProductLinks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    setIsLoading(true)
    setError('')

    Promise.all([fetchProductBySlug(slug), fetchPublishedProducts()])
      .then(([productData, allProducts]) => {
        if (!isMounted) return

        setProduct(productData)
        setProductLinks(allProducts.map((item) => ({ slug: item.slug, title: item.title })))
      })
      .catch(() => {
        if (isMounted) setError('This product could not be found.')
      })
      .finally(() => {
        if (isMounted) setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [slug])

  if (isLoading) {
    return (
      <main className="flex min-h-150 items-center justify-center bg-white">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-secondary/20 border-t-secondary" />
      </main>
    )
  }

  if (error || !product) {
    return (
      <main className="flex min-h-150 flex-col items-center justify-center gap-4 bg-white px-5 text-center">
        <p className="text-xl font-semibold text-secondary">{error || 'This product could not be found.'}</p>
        <Link to="/products" className="rounded-full bg-primary px-7 py-3 text-sm font-semibold text-white transition hover:bg-secondary">
          Back to Products
        </Link>
      </main>
    )
  }

  const heroBackground = getMediaUrl(product.hero_image || product.front_image)
  const mainImage = getMediaUrl(product.main_image || product.front_image)
  const capabilities = Array.isArray(product.capabilities) ? product.capabilities : []
  const useCases = Array.isArray(product.use_cases) ? product.use_cases : []
  const capabilityRows = [capabilities.slice(0, 2), capabilities.slice(2)]

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
            <Link to="/" className="transition hover:text-primary">
              Home
            </Link>
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
            <Link to="/products" className="transition hover:text-primary">
              Products
            </Link>
          </div>
          <Reveal
            as="h1"
            className="-ml-1 font-heading text-[36px] font-semibold leading-none text-white sm:text-[45px] md:text-[56px] xl:text-[70px]"
          >
            {product.title}
          </Reveal>
        </div>
      </section>

      <section className="mx-auto grid max-w-350 gap-8 px-5 py-20 lg:grid-cols-[25%_1fr]">
        <ProductSidebar productLinks={productLinks} currentSlug={slug} className="order-2 lg:order-1" />

        <article className="order-1 lg:order-2">
          {mainImage && (
            <Reveal as="img"
              src={mainImage}
              alt={product.image_alt_text || product.title}
              className="h-125 w-full object-cover max-md:h-75 rounded-2xl"
            />
          )}

          {product.subtitle && (
            <Reveal as="h2" className="pt-5 text-[46px] font-semibold leading-tight text-secondary max-md:text-[32px]">
              {product.subtitle}
            </Reveal>
          )}

          {product.description && (
            <Reveal as="p" className="text-[16px] leading-8 text-text">
              {product.description}
            </Reveal>
          )}

          {capabilityRows.map(
            (row, rowIndex) =>
              row.length > 0 && (
                <div key={rowIndex} className={`grid gap-5 md:grid-cols-2 ${rowIndex === 0 ? 'mt-12' : 'mt-5'}`}>
                  {row.map((item, index) => (
                    <Reveal key={item.id || item.title} delay={index * 100}>
                      <CapabilityCard item={item} index={rowIndex * 2 + index} />
                    </Reveal>
                  ))}
                </div>
              )
          )}

          {useCases.length > 0 && (
            <>
              <div className="mt-8">
                <Reveal as="h2" className="text-[46px] font-semibold leading-tight text-secondary max-md:text-[32px]">
                  Most commonly used in
                </Reveal>
              </div>

              <div className="mt-8 grid gap-0 md:grid-cols-4">
                {useCases.map((useCase, index) => (
                  <Reveal
                    as="article"
                    key={useCase.id || useCase.title}
                    delay={index * 100}
                    className={`px-2 first:pl-0 last:pr-0 ${
                      index < useCases.length - 1 ? 'border-r border-accent' : ''
                    } max-md:border-r-0 max-md:border-b max-md:py-4`}
                  >
                    <img src={getMediaUrl(useCase.image)} alt="" className="h-38 w-full object-cover rounded-xl" />
                    <h3 className="pt-4 text-center text-[18px] font-semibold leading-snug text-secondary">
                      {useCase.title}
                    </h3>
                  </Reveal>
                ))}
              </div>
            </>
          )}
        </article>
      </section>
    </main>
  )
}

export default SingleProduct
