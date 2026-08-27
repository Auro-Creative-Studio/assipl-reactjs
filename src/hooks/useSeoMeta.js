import { useEffect } from 'react'

const API_ROOT = (
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000/api'
).replace(/\/$/, '')

const BACKEND_ORIGIN = API_ROOT.replace(/\/api$/, '')

const resolveMediaUrl = (value = '') => {
  const textValue = String(value || '').trim()

  if (!textValue) return ''
  if (textValue.startsWith('http') || textValue.startsWith('blob:') || textValue.startsWith('data:')) {
    return textValue
  }

  return `${BACKEND_ORIGIN}/${textValue.replace(/^\//, '')}`
}

const setMetaByName = (name, content) => {
  if (!content) return

  let tag = document.querySelector(`meta[name="${name}"]`)

  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute('name', name)
    document.head.appendChild(tag)
  }

  tag.setAttribute('content', content)
}

const setMetaByProperty = (property, content) => {
  if (!content) return

  let tag = document.querySelector(`meta[property="${property}"]`)

  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute('property', property)
    document.head.appendChild(tag)
  }

  tag.setAttribute('content', content)
}

const setCanonicalLink = (href) => {
  let tag = document.querySelector('link[rel="canonical"]')

  if (!tag) {
    tag = document.createElement('link')
    tag.setAttribute('rel', 'canonical')
    document.head.appendChild(tag)
  }

  tag.setAttribute('href', href)
}

const STRUCTURED_DATA_ID = 'seo-structured-data'

const setStructuredData = (data) => {
  let tag = document.getElementById(STRUCTURED_DATA_ID)

  if (!data) {
    if (tag) tag.remove()
    return
  }

  if (!tag) {
    tag = document.createElement('script')
    tag.type = 'application/ld+json'
    tag.id = STRUCTURED_DATA_ID
    document.head.appendChild(tag)
  }

  tag.textContent = JSON.stringify(data)
}

const DEFAULT_TITLE = 'ASSIPL | Automation Systems and Solutions (India) Pvt. Ltd.'

/**
 * Applies page-level SEO (document title, meta/OG tags, canonical URL, JSON-LD)
 * from CMS meta fields. This mirrors the server-side injection in
 * assipl-node-express (src/utils/renderIndexHtml.js) so tags stay correct
 * across SPA soft-navigation, not just the first server-rendered load.
 * Pass already-resolved fallback strings for pages without a CMS record yet.
 */
export function useSeoMeta({
  title,
  description,
  keywords,
  ogTitle,
  ogDescription,
  ogImage,
  robotsIndex,
  robotsFollow,
  structuredData,
} = {}) {
  useEffect(() => {
    document.title = title || DEFAULT_TITLE

    setMetaByName('description', description)
    setMetaByName('keywords', keywords)

    const robots = [robotsIndex || 'index', robotsFollow || 'follow'].join(', ')
    setMetaByName('robots', robots)

    setCanonicalLink(window.location.origin + window.location.pathname)

    setMetaByProperty('og:type', 'website')
    setMetaByProperty('og:title', ogTitle || title)
    setMetaByProperty('og:description', ogDescription || description)
    setMetaByProperty('og:url', window.location.origin + window.location.pathname)

    const resolvedOgImage = resolveMediaUrl(ogImage)
    if (resolvedOgImage) setMetaByProperty('og:image', resolvedOgImage)

    setStructuredData(structuredData)
  }, [
    title,
    description,
    keywords,
    ogTitle,
    ogDescription,
    ogImage,
    robotsIndex,
    robotsFollow,
    structuredData,
  ])
}
