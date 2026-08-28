import axios from 'axios'

const API_ROOT = (
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000/api'
).replace(/\/$/, '')

const COOKIE_CONSENT_ENDPOINT = `${API_ROOT}/cookie-consents`

export const saveCookieConsent = async (payload) => {
  const response = await axios.post(COOKIE_CONSENT_ENDPOINT, payload)
  return response.data?.data || response.data
}
