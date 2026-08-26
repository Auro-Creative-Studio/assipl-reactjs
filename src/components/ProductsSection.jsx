import Reveal from './Reveal'
import { products } from '../data'

function ProductsSection() {
  return (
    <section id="products" className="bg-white py-20 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-360 px-5 sm:px-8 lg:px-12">
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product, index) => (
            <Reveal key={product.title} as="a"
              href={product.href}
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
              {/* <div className="absolute inset-0 bg-secondary/40 transition-colors duration-300 group-hover:bg-secondary/80" /> */}
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
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ProductsSection
