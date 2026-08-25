function PartnersStrip() {
  const partners = ['Hikvision', 'Honeywell', 'Bosch', 'Johnson Controls', 'Dahua', 'Axis']
  return <section className="border-b border-black/5 bg-white py-8"><div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12"><p className="mb-7 text-center text-xs font-semibold uppercase tracking-[0.18em] text-text">Powered by the World&apos;s Leading Manufacturers</p><div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">{partners.map((partner) => <div key={partner} className="flex h-16 items-center justify-center rounded-xl bg-background px-5 text-center font-heading text-lg font-bold text-secondary/60">{partner}</div>)}</div></div></section>
}
export default PartnersStrip
