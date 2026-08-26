import axios from 'axios'
import { useState } from 'react'
import Reveal from './Reveal'
import auditBackground from '../assets/services/audit-cta-bg.webp'

const API_ROOT = (
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  'http://localhost:5000/api'
).replace(/\/$/, '')

const ENQUIRY_ENDPOINT = `${API_ROOT}/enquiries`

const initialForm = { name: '', company_name: '', email: '', mobile_number: '', message: '' }

function AuditField({ as = 'input', className = '', ...props }) {
  const Component = as

  return (
    <Component
      className={`w-full rounded-lg border border-accent bg-white px-5 py-3 text-[15px] leading-normal text-text outline-none transition placeholder:text-text/60 focus:border-primary ${className}`}
      {...props}
    />
  )
}

function InfrastructureAuditSection() {
  const [formData, setFormData] = useState(initialForm)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
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
      setFormData(initialForm)
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to send your enquiry.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="audit-form" className="bg-white px-4 py-12 sm:px-5 sm:py-16 lg:py-20">
      <div
        className="relative mx-auto max-w-360 overflow-hidden rounded-[20px] bg-cover bg-center px-5 py-10 sm:rounded-[28px] sm:px-8 sm:py-14 lg:px-16 lg:py-20"
        style={{
          backgroundImage: `linear-gradient(rgba(18,28,69,.55),rgba(18,28,69,.55)), url(${auditBackground})`,
        }}
      >
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-12">
          <Reveal className="max-w-lg">
            <h2 className="text-[32px] font-bold leading-[1.15] text-white sm:text-4xl lg:text-5xl">
              Initiate an Infrastructure Audit
            </h2>
            <p className="mt-6 text-base leading-7 text-white/85 sm:text-lg">
              Your enterprise operates on a national scale, and so do we. With our central operations and regional
              hubs clearly established across India, ASSIPL guarantees rapid field response times, unified
              engineering standards, and seamless multi-site rollouts nationwide.
            </p>
          </Reveal>

          <Reveal
            as="form"
            delay={150}
            onSubmit={handleSubmit}
            className="mx-auto w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl sm:p-7 lg:mx-0 lg:justify-self-center lg:p-8"
          >
            <div className="space-y-4">
              <AuditField
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                aria-label="Name"
                required
              />
              <AuditField
                type="text"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                placeholder="Company Name"
                aria-label="Company Name"
              />
              <AuditField
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                aria-label="Email"
                required
              />
              <AuditField
                type="tel"
                name="mobile_number"
                value={formData.mobile_number}
                onChange={handleChange}
                placeholder="Contact Number"
                aria-label="Contact Number"
              />
              <AuditField
                as="textarea"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={5}
                placeholder="Message"
                aria-label="Message"
                className="resize-y"
              />
            </div>

            {isSuccess && (
              <p className="mt-4 text-sm font-semibold text-emerald-600">
                Thank you! Your enquiry has been received.
              </p>
            )}
            {error && <p className="mt-4 text-sm font-semibold text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-6 inline-flex items-center rounded-full bg-primary px-8 py-3 text-sm font-semibold text-white transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Sending…' : 'Submit'}
            </button>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export default InfrastructureAuditSection
