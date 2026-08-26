import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal'
import ProductsSection from '../components/ProductsSection'
import heroBackground from '../assets/products/products-hero-bg.webp'

function Products() {
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
          </div>
          <Reveal
            as="h1"
            className="-ml-1 font-heading text-[32px] font-semibold leading-tight text-white sm:text-[40px] md:text-[52px] xl:text-[70px] xl:leading-none"
          >
            Products
          </Reveal>
        </div>
      </section>

      <ProductsSection />
    </main>
  )
}

export default Products
