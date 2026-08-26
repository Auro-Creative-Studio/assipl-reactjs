import { products } from '../data'
import SectionHeading from './SectionHeading'

function ProductsSection() {
  return (
    <section id="products" className="bg-white py-12 sm:py-12 lg:py-32">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        {/* <SectionHeading
          eyebrow="Integrated Security Products"
          title="Purpose-built systems for secure, resilient operations."
          description="A complete portfolio of electronic security and safety solutions designed for enterprise and critical infrastructure environments."
        /> */}
        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <a
              key={product.title}
              href="/products/video-surveillance"
              className="group relative block aspect-[6/5] overflow-hidden rounded-2xl"
            >
              <img
                src={product.image}
                alt={product.title}
                className="absolute inset-0 h-full w-full object-cover transition duration-500 ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-secondary/0 transition-colors duration-300 group-hover:bg-secondary/80" />
              <div className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center">
                <h3 className="text-xl font-bold leading-snug text-white drop-shadow-lg sm:text-2xl">
                  {product.title}
                </h3>
                <div className="grid grid-rows-[0fr] transition-all duration-300 group-hover:mt-3 group-hover:grid-rows-[1fr]">
                  <div className="min-h-0 overflow-hidden">
                    <p className="text-sm leading-6 text-white/85">{product.description}</p>
                  </div>
                </div>
                <span className="mt-0 translate-y-2 text-sm font-semibold text-white underline opacity-0 transition-all duration-300 group-hover:mt-4 group-hover:translate-y-0 group-hover:opacity-100">
                  Read More
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProductsSection
