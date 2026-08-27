import axios from 'axios'

const API_ROOT = (
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000/api'
).replace(/\/$/, '')

const BACKEND_ORIGIN = API_ROOT.replace(/\/api$/, '')
const PROCESS_ENDPOINT = `${API_ROOT}/process`

export const getMediaUrl = (value = '') => {
  const textValue = String(value || '').trim()

  if (!textValue) return ''
  if (textValue.startsWith('http') || textValue.startsWith('blob:') || textValue.startsWith('data:')) {
    return textValue
  }

  return `${BACKEND_ORIGIN}/${textValue.replace(/^\//, '')}`
}

export const fetchProcess = async () => {
  const response = await axios.get(PROCESS_ENDPOINT)
  const data = response.data?.data
  return Array.isArray(data) ? data[0] || null : data || null
}
