import { testimonials } from '../data'

function ClientsSection() {
  return (
    <section className="bg-white py-20 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-360 px-5 sm:px-8 lg:px-12">
        <h2 className="mx-auto w-fit border-l-4 border-secondary pl-6 text-4xl font-bold leading-tight text-secondary sm:text-5xl">
          Major Clients
        </h2>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((item) => (
            <article key={item.company} className="rounded-3xl border border-black/10 bg-white p-7">
              <img src={item.logo} alt={item.company} className="h-8 w-auto object-contain object-left" />
              <p className="mt-6 text-[15px] leading-7 text-secondary/70">&quot; {item.quote} &quot;</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ClientsSection
