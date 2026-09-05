import { useEffect, useRef, useState } from 'react'

function LazyMount({ children, className = '', rootMargin = '600px 0px' }) {
  const ref = useRef(null)
  const [shouldRender, setShouldRender] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldRender(true)
          observer.unobserve(node)
        }
      },
      { rootMargin }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={className}>
      {shouldRender ? children : null}
    </div>
  )
}

export default LazyMount
