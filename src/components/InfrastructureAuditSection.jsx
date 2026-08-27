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
      className={`h-[39px] w-full rounded-[2px] border border-[#737373] bg-white px-4 text-[14px] leading-[1.5] text-[#667085] outline-none transition placeholder:text-[#667085] focus:border-primary ${className}`}
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
    <section id="audit-form" className="bg-white px-5 pt-0 pb-20">
      <div
        className="relative mx-auto min-h-[708px] max-w-[1400px] overflow-hidden rounded-[24px] bg-cover bg-center px-5 py-10 sm:px-8 sm:py-12 lg:px-[112px] lg:py-[50px]"
        style={{
          backgroundImage: `linear-gradient(rgba(18,28,69,.25),rgba(18,28,69,.25)), url(${auditBackground})`,
        }}
      >
        <div className="grid min-h-[608px] gap-8 lg:grid-cols-[1fr_491px] lg:items-start lg:gap-[50px]">
          <Reveal className="max-w-[650px] lg:pt-[38px]">
            <h2 className="max-w-[400px] text-[38px] font-semibold leading-[1.22] text-white sm:text-[44px]">
              Initiate an Infrastructure Audit
            </h2>
            <p className="mt-6 max-w-[650px] text-justify text-[16px] font-normal leading-[1.5] text-[#f5f5f5] md:text-left sm:text-[18px]">
              Your enterprise operates on a national scale, and so do we. With our central operations and regional
              hubs clearly established across India, ASSIPL guarantees rapid field response times, unified
              engineering standards, and seamless multi-site rollouts nationwide.
            </p>
          </Reveal>

          <Reveal
            as="form"
            delay={150}
            onSubmit={handleSubmit}
            className="mx-auto w-full max-w-[491px] rounded-[20px] bg-white px-5 py-8 shadow-none sm:px-[50px] lg:mx-0 lg:justify-self-end lg:px-[81px] lg:py-[50px]"
          >
            <div className="space-y-[11px]">
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
                className="h-[227px] resize-y py-3"
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
              className="mt-[30px] inline-flex h-[44px] items-center rounded-full bg-primary px-[31px] text-[14px] font-semibold text-white transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-60"
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
