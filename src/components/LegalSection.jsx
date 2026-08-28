import Reveal from './Reveal'

const defaultAddressMapHref = 'https://maps.app.goo.gl/APLDUrrqLS96XhFi9'
const toTelHref = (value) => `tel:${value.replace(/[^\d+]/g, '')}`
const toMailHref = (value) => `mailto:${value.trim()}`

function renderListItem(item) {
  const emailMatch = item.match(/^(Email:\s*)(.+)$/i)
  if (emailMatch) {
    return (
      <>
        {emailMatch[1]}
        <a href={toMailHref(emailMatch[2])} className="text-primary underline hover:text-secondary">
          {emailMatch[2]}
        </a>
      </>
    )
  }

  const phoneMatch = item.match(/^(Phone:\s*)(.+)$/i)
  if (phoneMatch) {
    const numbers = phoneMatch[2].split('/').map((part) => part.trim())
    return (
      <>
        {phoneMatch[1]}
        {numbers.map((number, index) => (
          <span key={number}>
            {index > 0 && ' / '}
            <a href={toTelHref(number)} className="text-primary underline hover:text-secondary">
              {number}
            </a>
          </span>
        ))}
      </>
    )
  }

  const addressMatch = item.match(/^(Address:\s*)(.+)$/i)
  if (addressMatch) {
    return (
      <>
        {addressMatch[1]}
        <a
          href={defaultAddressMapHref}
          target="_blank"
          rel="noreferrer"
          className="text-primary underline hover:text-secondary"
        >
          {addressMatch[2]}
        </a>
      </>
    )
  }

  return item
}

function LegalSection({ number, title, blocks }) {
  return (
    <Reveal as="section" className="py-8 first:pt-0">
      <h2 className="text-[32px] font-bold leading-tight text-secondary md:text-[44px]">
        {number}. {title}
      </h2>
      <div className="mt-4 space-y-4 text-[16px] leading-7 text-text md:text-[18px]">
        {blocks.map((block, index) =>
          block.type === 'ul' ? (
            <ul key={index} className="list-disc space-y-2 pl-5">
              {block.items.map((item) => (
                <li key={item}>{renderListItem(item)}</li>
              ))}
            </ul>
          ) : (
            <p key={index}>{block.text}</p>
          ),
        )}
      </div>
    </Reveal>
  )
}

export default LegalSection
