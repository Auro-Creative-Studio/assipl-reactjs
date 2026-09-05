function RichText({ html, className = '' }) {
  if (!html) return null

  return (
    <div
      className={`space-y-4 text-body text-text [&_strong]:font-bold [&_strong]:text-secondary [&_b]:font-bold [&_b]:text-secondary [&_ul]:list-disc [&_ul]:space-y-3 [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:space-y-3 [&_ol]:pl-5 [&_a]:font-bold [&_a]:text-primary [&_a]:underline [&_h2]:text-[24px] [&_h2]:font-semibold [&_h2]:text-secondary ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

export default RichText
