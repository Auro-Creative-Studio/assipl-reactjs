import axios from 'axios'

const API_ROOT = (
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000/api'
).replace(/\/$/, '')

const BACKEND_ORIGIN = (import.meta.env.VITE_MEDIA_BASE_URL || API_ROOT.replace(/\/api$/, '')).replace(/\/$/, '')
const POSITIONS_ENDPOINT = `${API_ROOT}/career-positions`
const APPLICATIONS_ENDPOINT = `${API_ROOT}/career-forms`
const UPLOAD_ENDPOINT = `${API_ROOT}/uploads`

export const getMediaUrl = (value = '') => {
  const textValue = String(value || '').trim()

  if (!textValue) return ''
  if (textValue.startsWith('http') || textValue.startsWith('blob:') || textValue.startsWith('data:')) {
    return textValue
  }

  return `${BACKEND_ORIGIN}/${textValue.replace(/^\//, '')}`
}

export const fetchActiveCareerPositions = async () => {
  const response = await axios.get(POSITIONS_ENDPOINT)
  const items = response.data?.data || []

  return items
    .filter((item) => item.status !== false)
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
}

export const uploadResume = async (file) => {
  const formData = new FormData()
  formData.append('file', file)

  const response = await axios.post(UPLOAD_ENDPOINT, formData)
  return response.data?.data?.url || response.data?.data?.path || ''
}

export const submitCareerApplication = async (payload) => {
  const response = await axios.post(APPLICATIONS_ENDPOINT, payload)
  return response.data?.data || null
}
