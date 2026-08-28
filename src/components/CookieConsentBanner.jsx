import { Cookie, SlidersHorizontal, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { saveCookieConsent } from '../lib/cookieConsentApi'

const CONSENT_STORAGE_KEY = 'assipl_cookie_consent'
const SESSION_STORAGE_KEY = 'assipl_cookie_session_id'

const cookieCategories = [
  {
    key: 'necessary',
    label: 'Necessary',
    description: 'Required for security, navigation, and forms.',
    required: true,
  },
  {
    key: 'analytics',
    label: 'Analytics',
    description: 'Helps us improve page performance and journeys.',
  },
  {
    key: 'preferences',
    label: 'Preferences',
    description: 'Remembers region, language, and display choices.',
  },
]

const getStoredConsent = () => {
  try {
    return localStorage.getItem(CONSENT_STORAGE_KEY)
  } catch {
    return null
  }
}

const storeConsent = (value) => {
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, value)
  } catch {
    // The API record is still the source of truth if browser storage is blocked.
  }
}

const createSessionId = () => {
  const randomValue =
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`

  return `sess_${randomValue}`
}

const getSessionId = () => {
  try {
    const existingSession = sessionStorage.getItem(SESSION_STORAGE_KEY)
    if (existingSession) return existingSession

    const nextSession = createSessionId()
    sessionStorage.setItem(SESSION_STORAGE_KEY, nextSession)
    return nextSession
  } catch {
    return createSessionId()
  }
}

const getDeviceType = () => {
  const userAgent = navigator.userAgent || ''

  if (/tablet|ipad|playbook|silk/i.test(userAgent)) return 'tablet'
  if (/mobi|android|iphone|ipod/i.test(userAgent)) return 'mobile'

  return 'desktop'
}


const buildConsentPayload = (consentType) => ({
  session_id: getSessionId(),
  country: '',
  city: '',
  consent_timestamp: new Date().toISOString(),
  consent_type: consentType,
  latitude: '',
  longitude: '',
  device: getDeviceType(),
  language: navigator.language || '',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || '',
})

export default function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const [isCustomizing, setIsCustomizing] = useState(false)
  const [selectedCategories, setSelectedCategories] = useState({
    necessary: true,
    analytics: true,
    preferences: true,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setIsVisible(!getStoredConsent())
  }, [])

  const selectedOptionalCount = useMemo(
    () =>
      cookieCategories.filter(
        (category) => !category.required && selectedCategories[category.key]
      ).length,
    [selectedCategories]
  )

  const handleCategoryChange = (key) => {
    setSelectedCategories((currentCategories) => ({
      ...currentCategories,
      [key]: !currentCategories[key],
    }))
  }

  const submitConsent = async (consentType) => {
    setIsSubmitting(true)
    setError('')

    try {
      const payload = buildConsentPayload(consentType)
      await saveCookieConsent(payload)
      storeConsent(consentType)
      setIsVisible(false)
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          'Unable to save your cookie preference. Please try again.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveCustom = () => {
    const hasOptionalConsent = cookieCategories.some(
      (category) => !category.required && selectedCategories[category.key]
    )

    submitConsent(hasOptionalConsent ? 'customized' : 'rejected')
  }

  if (!isVisible) return null

  return (
    <section
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-50 px-3 pb-3 sm:px-5 sm:pb-5"
    >
      <div className="mx-auto max-w-6xl rounded-lg border border-slate-200 bg-white shadow-[0_18px_55px_rgba(18,28,69,0.2)]">
        <div className="pt-4 px-4 sm:pt-5 sm:px-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary text-white">
              <Cookie className="h-5 w-5" aria-hidden="true" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-bold uppercase leading-none tracking-[0.18em] text-primary">
                Privacy Preference
              </p>
              <h2 className="mt-2 text-lg font-semibold leading-tight text-secondary sm:text-xl">
                We use cookies to improve your ASSIPL experience.
              </h2>
              <p className="mt-1.5 max-w-3xl text-sm leading-5 text-text">
                Choose how we can use optional cookies. Necessary cookies stay active to keep the site secure and working properly.
              </p>
            </div>
          </div>

          {isCustomizing && (
            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              {cookieCategories.map((category) => (
                <label
                  key={category.key}
                  className="flex min-h-[96px] cursor-pointer flex-col justify-between rounded-lg border border-slate-200 bg-slate-50 p-3 transition hover:border-primary"
                >
                  <span>
                    <span className="flex items-center justify-between gap-3">
                      <span className="text-sm font-semibold leading-5 text-secondary">
                        {category.label}
                      </span>
                      <input
                        type="checkbox"
                        checked={selectedCategories[category.key]}
                        disabled={category.required || isSubmitting}
                        onChange={() => handleCategoryChange(category.key)}
                        className="h-4 w-4 accent-primary"
                      />
                    </span>
                    <span className="mt-1.5 block text-xs leading-4 text-text">
                      {category.description}
                    </span>
                  </span>
                  {category.required && (
                    <span className="mt-2 text-xs font-semibold leading-4 text-primary">
                      Always active
                    </span>
                  )}
                </label>
              ))}
            </div>
          )}

          {error && (
            <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700">
              {error}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2 p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4">
          <p className="text-xs font-semibold leading-5 text-text sm:max-w-sm">
            {isCustomizing
              ? `${selectedOptionalCount} optional category selected.`
              : 'Your choice is recorded securely.'}
          </p>

          <div className="grid gap-2 sm:flex sm:justify-end">
            {isCustomizing ? (
              <>
                <button
                  type="button"
                  onClick={() => setIsCustomizing(false)}
                  disabled={isSubmitting}
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-secondary transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-70 sm:min-w-32"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleSaveCustom}
                  disabled={isSubmitting}
                  className="inline-flex min-h-10 items-center justify-center rounded-lg bg-primary px-5 text-sm font-semibold text-white transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-70 sm:min-w-40"
                >
                  {isSubmitting ? 'Saving...' : 'Save Preferences'}
                </button>
              </>
            ) : (
              <>
                {/* <button
                  type="button"
                  onClick={() => setIsCustomizing(true)}
                  disabled={isSubmitting}
                  className="inline-flex min-h-9 items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-4 text-sm font-semibold text-secondary transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-70 sm:min-w-32"
                >
                  <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
                  Customize
                </button> */}
                <button
                  type="button"
                  onClick={() => submitConsent('rejected')}
                  disabled={isSubmitting}
                  className="inline-flex min-h-9 items-center justify-center rounded-full border border-slate-300 bg-white px-4 text-sm font-semibold text-secondary transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-70 sm:min-w-40"
                >
                  Reject Optional
                </button>
                <button
                  type="button"
                  onClick={() => submitConsent('accepted')}
                  disabled={isSubmitting}
                  className="inline-flex min-h-9 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-white transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-70 sm:min-w-32"
                >
                  {isSubmitting ? 'Saving...' : 'Accept All'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
