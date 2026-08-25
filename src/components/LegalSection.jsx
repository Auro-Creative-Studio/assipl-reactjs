function LegalSection({ number, title, blocks }) {
  return (
    <section className="py-8 first:pt-0">
<h2 className="text-[32px] font-bold leading-tight text-secondary md:text-[44px]">
        {number}. {title}
      </h2>
      <div className="mt-4 space-y-4 text-[16px] leading-7 text-text md:text-[18px]">
        {blocks.map((block, index) =>
          block.type === 'ul' ? (
            <ul key={index} className="list-disc space-y-2 pl-5">
              {block.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : (
            <p key={index}>{block.text}</p>
          ),
        )}
      </div>
    </section>
  )
}

export default LegalSection
