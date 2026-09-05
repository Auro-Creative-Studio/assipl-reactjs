import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Reveal from './Reveal'
import { fetchPublishedProducts, getMediaUrl } from '../lib/productsApi'

function ProductsSection() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    let isMounted = true

    fetchPublishedProducts()
      .then((items) => {
        if (!isMounted) return

        setProducts(
          items.map((item) => ({
            title: item.title,
            description: item.excerpt || '',
            frontImage: getMediaUrl(item.front_image),
            rearImage: getMediaUrl(item.rear_image),
            href: `/products/${item.slug}`,
          }))
        )
      })
      .catch(() => {})

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <section id="products" className="bg-white py-20 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-360 px-5 sm:px-8 lg:px-12">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product, index) => (
            <Reveal
              key={product.title}
              delay={(index % 3) * 100}
              className="group relative block aspect-6/5 overflow-hidden rounded-2xl"
            >
              <img
                src={product.frontImage}
                alt={product.title}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <img
                src={product.rearImage}
                alt=""
                className="absolute left-1/2 top-1/2 h-[45%] w-[45%] -translate-x-1/2 -translate-y-1/2 scale-75 rounded-xl object-cover opacity-0 transition-all duration-500 ease-out group-hover:h-full group-hover:w-full group-hover:scale-100 group-hover:rounded-2xl group-hover:opacity-100"
                aria-hidden="true"
              />
              <div className="absolute inset-0 bg-[#121C454F] transition-colors duration-300 group-hover:bg-[#121C4595]" />
              <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center">
                <h3 className="text-xl font-bold leading-snug text-white drop-shadow-lg sm:text-2xl">
                  {product.title}
                </h3>
                <div className="grid grid-rows-[0fr] transition-all duration-300 group-hover:mt-3 group-hover:grid-rows-[1fr]">
                  <div className="min-h-0 overflow-hidden">
                    <p className="text-left text-sm leading-6 text-white/85 md:text-center">{product.description}</p>
                  </div>
                </div>
                <Link
                  to={product.href}
                  className="mt-4 translate-y-0 text-sm font-semibold text-white underline opacity-100 transition-all duration-300 md:mt-0 md:translate-y-2 md:opacity-0 md:group-hover:mt-4 md:group-hover:translate-y-0 md:group-hover:opacity-100"
                >
                  Read More
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProductsSection
