function SectionHeading({ eyebrow, title, description, light = false, center = false }) {
  return <div className={`max-w-3xl ${center ? 'mx-auto text-center' : ''}`}>
    {eyebrow && <p className={`mb-3 text-xs font-semibold uppercase tracking-[0.2em] ${light ? 'text-blue-200' : 'text-primary'}`}>{eyebrow}</p>}
    <h2 className={`text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl ${light ? 'text-white!' : ''}`}>{title}</h2>
    {description && <p className={`mt-5 text-base leading-7 sm:text-lg ${light ? 'text-white/65' : 'text-text'}`}>{description}</p>}
  </div>
}
export default SectionHeading
