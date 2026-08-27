import { X } from 'lucide-react'
import { useEffect, useState } from 'react'
import popupBackground from '../assets/download.png'
import logo from '../assets/logo-light.png'
import { fetchActiveCareerPositions, submitCareerApplication, uploadResume } from '../lib/careerApi'

const initialForm = { full_name: '', email: '', phone_number: '', position_id: '', message: '' }
const MAX_RESUME_SIZE_BYTES = 5 * 1024 * 1024
const RESUME_SIZE_ERROR = 'Resume size max 5 MB.'

const fieldClass =
  'w-full rounded-xl border border-white/25 bg-white/10 px-4 py-3 text-sm text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] backdrop-blur-md placeholder:text-white/55 outline-none transition focus:border-primary/70 focus:bg-white/15 focus:shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_0_0_3px_rgba(59,130,246,0.18)]'

function CareerPopup({ isOpen, onClose }) {
  const [positions, setPositions] = useState([])
  const [formData, setFormData] = useState(initialForm)
  const [resume, setResume] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [appliedPosition, setAppliedPosition] = useState('')

  useEffect(() => {
    if (!isOpen) return

    fetchActiveCareerPositions()
      .then(setPositions)
      .catch(() => {})
  }, [isOpen])

  if (!isOpen) return null

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0] || null

    if (selectedFile && selectedFile.size > MAX_RESUME_SIZE_BYTES) {
      setResume(null)
      setError(RESUME_SIZE_ERROR)
      event.target.value = ''
      return
    }

    setError('')
    setResume(selectedFile)
  }

  const handleClose = () => {
    setError('')
    setIsSuccess(false)
    setAppliedPosition('')
    setFormData(initialForm)
    setResume(null)
    onClose()
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!resume) {
      setError('Please attach your resume.')
      return
    }

    if (resume.size > MAX_RESUME_SIZE_BYTES) {
      setError(RESUME_SIZE_ERROR)
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const resumePath = await uploadResume(resume)

      const application = await submitCareerApplication({
        full_name: formData.full_name,
        email: formData.email,
        phone_number: formData.phone_number,
        position_id: Number(formData.position_id),
        message: formData.message,
        upload_resume: resumePath,
      })

      setAppliedPosition(application?.position?.position_name || '')
      setIsSuccess(true)
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to submit your application.')
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
          aria-label="Close job application form"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>

        <div
          className="max-h-[85vh] overflow-y-auto px-6 py-8 sm:px-8 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/30 [&::-webkit-scrollbar-thumb]:hover:bg-white/45 [&::-webkit-scrollbar-track]:bg-transparent"
          style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.3) transparent' }}
        >
          <img src={logo} alt="ASSIPL" className="mx-auto h-14 w-auto object-contain" />
          <h2 className="mt-4 text-center text-[25px] font-bold text-white">Job Application</h2>

          {isSuccess ? (
            <div className="mt-10 text-center text-white">
              <p className="text-lg font-semibold">Thank you for applying!</p>
              <p className="mt-2 text-sm text-white/70">
                {appliedPosition
                  ? `Your application for ${appliedPosition} has been received.`
                  : 'Your application has been received.'}{' '}
                Our HR team will review it and reach out if there&apos;s a match.
              </p>
              <button
                type="button"
                onClick={handleClose}
                className="mt-8 inline-flex rounded-full bg-primary px-7 py-3 text-sm font-semibold text-white transition hover:bg-secondary"
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="Full Name"
                required
                className={fieldClass}
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                required
                className={fieldClass}
              />
              <input
                type="tel"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                placeholder="Phone Number"
                required
                className={fieldClass}
              />
              <select
                name="position_id"
                value={formData.position_id}
                onChange={handleChange}
                required
                className={`${fieldClass} ${formData.position_id ? '' : 'text-white/55'}`}
              >
                <option value="" disabled className="bg-secondary text-white/60">
                  Select a position
                </option>
                {positions.map((position) => (
                  <option key={position.id} value={position.id} className="bg-secondary text-white">
                    {position.position_name}
                  </option>
                ))}
              </select>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Briefly describe your experience and skills"
                rows={9}
                className={`${fieldClass} resize-y`}
              />

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-white">
                  Upload Resume <span className="text-red-300">*</span>
                </label>
                <input
                  type="file"
                  name="resume"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  required
                  className="w-full rounded-xl border border-white/25 bg-white/10 px-3 py-2.5 text-sm text-white/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] backdrop-blur-md outline-none transition file:mr-3 file:rounded-md file:border file:border-white/25 file:bg-white/15 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-white/25 focus:border-primary/70 focus:bg-white/15"
                />
              </div>

              {error && <p className="text-sm font-semibold text-red-300">{error}</p>}

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center rounded-full bg-primary px-7 py-3 text-sm font-semibold text-white transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? 'Submitting…' : 'Submit Application'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default CareerPopup

