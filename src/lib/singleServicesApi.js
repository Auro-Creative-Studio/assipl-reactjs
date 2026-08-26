import axios from 'axios'

const API_ROOT = (
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000/api'
).replace(/\/$/, '')

const BACKEND_ORIGIN = API_ROOT.replace(/\/api$/, '')
const SERVICE_ENDPOINT = `${API_ROOT}/single-services`

export const getMediaUrl = (value = '') => {
  const textValue = String(value || '').trim()

  if (!textValue) return ''
  if (textValue.startsWith('http') || textValue.startsWith('blob:') || textValue.startsWith('data:')) {
    return textValue
  }

  return `${BACKEND_ORIGIN}/${textValue.replace(/^\//, '')}`
}

export const fetchPublishedSingleServices = async () => {
  const response = await axios.get(SERVICE_ENDPOINT)
  const items = response.data?.data || []

  return items.filter((item) => item.status !== false)
}

export const fetchSingleServiceBySlug = async (slug) => {
  const response = await axios.get(`${SERVICE_ENDPOINT}/slug/${slug}`)
  return response.data?.data || null
}
