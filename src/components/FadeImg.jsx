import { useState } from 'react'

function FadeImg({ className = '', onLoad, ...props }) {
  const [loaded, setLoaded] = useState(false)

  return (
    <img
      {...props}
      onLoad={(event) => {
        setLoaded(true)
        onLoad?.(event)
      }}
      className={`transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'} ${className}`}
    />
  )
}

export default FadeImg
