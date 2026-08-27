import axios from 'axios'

const API_ROOT = (
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000/api'
).replace(/\/$/, '')

const CONTACT_PAGE_ENDPOINT = `${API_ROOT}/contact-page`

export const fetchContactPage = async () => {
  try {
    const response = await axios.get(`${CONTACT_PAGE_ENDPOINT}/latest`)
    return response.data?.data || null
  } catch (err) {
    if (err.response?.status !== 404) throw err
    return null
  }
}
