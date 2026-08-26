import axios from 'axios'

const API_ROOT = (
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000/api'
).replace(/\/$/, '')

const BACKEND_ORIGIN = API_ROOT.replace(/\/api$/, '')
const PRODUCT_ENDPOINT = `${API_ROOT}/products`

export const getMediaUrl = (value = '') => {
  const textValue = String(value || '').trim()

  if (!textValue) return ''
  if (textValue.startsWith('http') || textValue.startsWith('blob:') || textValue.startsWith('data:')) {
    return textValue
  }

  return `${BACKEND_ORIGIN}/${textValue.replace(/^\//, '')}`
}

export const fetchPublishedProducts = async () => {
  const response = await axios.get(`${PRODUCT_ENDPOINT}/published`)
  return response.data?.data || []
}

export const fetchProductBySlug = async (slug) => {
  const response = await axios.get(`${PRODUCT_ENDPOINT}/slug/${slug}`)
  return response.data?.data || null
}
