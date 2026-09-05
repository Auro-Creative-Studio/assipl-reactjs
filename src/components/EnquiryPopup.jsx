import axios from 'axios'
import { X } from 'lucide-react'
import { useState } from 'react'
import popupBackground from '../assets/download.png'
import logo from '../assets/logo-light.png'

const API_ROOT = (
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000/api'
).replace(/\/$/, '')

const ENQUIRY_ENDPOINT = `${API_ROOT}/enquiries`

const initialForm = { name: '', company_name: '', email: '', mobile_number: '', message: '' }

const fieldClass =
  'w-full rounded-xl border border-white/25 bg-white/10 px-4 py-3 text-sm text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] backdrop-blur-md placeholder:text-white/55 outline-none transition focus:border-primary/70 focus:bg-white/15 focus:shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_0_0_3px_rgba(59,130,246,0.18)]'

function EnquiryPopup({ isOpen, onClose }) {
  const [formData, setFormData] = useState(initialForm)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  if (!isOpen) return null

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleClose = () => {
    setError('')
    setIsSuccess(false)
    setFormData(initialForm)
    onClose()
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      await axios.post(ENQUIRY_ENDPOINT, {
        ...formData,
        service_needed: formData.message.trim() || 'General Enquiry',
      })
      setIsSuccess(true)
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to send your enquiry.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/30 px-5 py-10 backdrop-blur-[2px]"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-105 overflow-hidden rounded-2xl shadow-2xl"
        onClick={(event) => event.stopPropagation()}
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(6, 20, 39, 0.88) 0%, rgba(3, 45, 105, 0.88) 100%), url(${popupBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close enquiry form"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>

        <div
          className="max-h-[85vh] overflow-y-auto px-6 py-8 sm:px-8 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/30 [&::-webkit-scrollbar-thumb]:hover:bg-white/45 [&::-webkit-scrollbar-track]:bg-transparent"
          style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.3) transparent' }}
        >
          <img src={logo} alt="ASSIPL" className="mx-auto h-14 w-auto object-contain" />

          {isSuccess ? (
            <div className="mt-10 text-center text-white">
              <p className="text-lg font-semibold">Thank you! Your enquiry has been received.</p>
              <p className="mt-2 text-sm text-white/70">Our team will get back to you shortly.</p>
              <button
                type="button"
                onClick={handleClose}
                className="mt-8 inline-flex rounded-full bg-primary px-7 py-3 text-body font-semibold text-white transition hover:bg-secondary"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                required
                className={fieldClass}
              />
              <input
                type="text"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                placeholder="Company Name"
                className={fieldClass}
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                required
                className={fieldClass}
              />
              <input
                type="tel"
                name="mobile_number"
                value={formData.mobile_number}
                onChange={handleChange}
                placeholder="Contact Number"
                className={fieldClass}
              />
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Message"
                rows={6}
                className={`${fieldClass} resize-y`}
              />

              {error && <p className="text-sm font-semibold text-red-300">{error}</p>}

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center rounded-full bg-primary px-7 py-3 text-body font-semibold text-white transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? 'Sending…' : 'Submit'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default EnquiryPopup

