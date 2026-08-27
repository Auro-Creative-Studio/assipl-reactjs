import { useEffect, useRef, useState } from 'react'
import EnquiryPopup from '../components/EnquiryPopup'
import heroBg from '../assets/process-page/process-hero-bg.webp'
import ctaBg from '../assets/process-page/process-cta-bg.webp'
import blueprintIcon from '../assets/process-page/blueprint-icon.png'
import blueprintPhoto from '../assets/process-page/blueprint-photo.webp'
import sourcingIcon from '../assets/process-page/sourcing-icon.png'
import sourcingPhoto from '../assets/process-page/sourcing-photo.webp'
import executionIcon from '../assets/process-page/execution-icon.png'
import executionPhoto from '../assets/process-page/execution-photo.webp'
import handoverIcon from '../assets/process-page/handover-icon.png'
import handoverPhoto from '../assets/process-page/handover-photo.webp'
import { fetchProcess, getMediaUrl } from '../lib/processApi'

const defaultProcessSteps = [
  {
    icon: blueprintIcon,
    image: blueprintPhoto,
    title: 'Strategic Blueprinting',
    points: [
      {
        label: 'Site & Threat Audits:',
        text: 'We conduct meticulous audits to capture your exact enterprise requirements and facility vulnerabilities.',
      },
      {
        label: 'Custom Blueprints:',
        text: 'Raw spatial dimensions are transformed into highly detailed, scalable security architecture designs.',
      },
      {
        label: 'Transparent Estimation:',
        text: 'You receive a comprehensive Bill of Quantities (BOQ) and clear cost structures, ensuring complete financial clarity before deployment begins.',
      },
    ],
  },
  {
    icon: sourcingIcon,
    image: sourcingPhoto,
    title: 'Precision Sourcing',
    points: [
      {
        label: 'OEM Allocation:',
        text: 'Upon project kick-off, we immediately activate our global supply chain network.',
      },
      {
        label: 'Certified Inventory:',
        text: 'We procure and allocate authentic, certified components directly from our strategic technology manufacturing partners, matching your exact site requirements to the letter.',
      },
    ],
  },
  {
    icon: executionIcon,
    image: executionPhoto,
    title: 'Field Execution',
    points: [
      {
        label: 'Synchronized Dispatch:',
        text: 'Hardware logistics are tightly controlled, ensuring components arrive at your facility exactly when our installation teams are ready to deploy.',
      },
      {
        label: 'On-Site Integration:',
        text: 'Factory-trained specialists execute device mounting, structured cabling, and rigorous terminal calibration with strict adherence to enterprise safety protocols.',
      },
    ],
  },
  {
    icon: handoverIcon,
    image: handoverPhoto,
    title: 'Handover & Continuity',
    points: [
      {
        label: 'System Validation:',
        text: 'We deliver exhaustive performance reports, proving the architecture is fully optimized, compliant, and ready for use.',
      },
      {
        label: 'Project Closeout:',
        text: 'We facilitate official project sign-off and the immediate activation of your hardware warranties.',
      },
    ],
  },
]

function ProcessStep({ step, index, isActive, markerRef }) {
  const reversed = index % 2 === 1

  const contentCard = (mode = 'desktop') => (
    <div
      className={`relative rounded-[18px] bg-background ${
        mode === 'mobile'
          ? 'flex min-h-[478px] flex-col justify-center px-[30px] py-[20px]'
          : 'flex min-h-[365px] flex-col justify-center px-[34px] py-[54px] md:px-[50px]'
      } ${
        mode === 'mobile'
          ? 'before:absolute before:left-[-18px] before:top-[16px] before:h-0 before:w-0 before:border-y-[15px] before:border-r-[18px] before:border-y-transparent before:border-r-background'
          : reversed
            ? 'lg:ml-[18px] lg:before:absolute lg:before:left-[-22px] lg:before:top-[24px] lg:before:h-0 lg:before:w-0 lg:before:border-y-[18px] lg:before:border-r-[22px] lg:before:border-y-transparent lg:before:border-r-background'
            : 'lg:mr-[18px] lg:after:absolute lg:after:right-[-22px] lg:after:top-[24px] lg:after:h-0 lg:after:w-0 lg:after:border-y-[18px] lg:after:border-l-[22px] lg:after:border-y-transparent lg:after:border-l-background'
      }`}
    >
      <h2 className="font-body text-[23px] font-medium leading-[1.25] text-black md:text-[26px]">
        {step.title}
      </h2>
      <ul className="mt-4 list-disc space-y-[6px] pl-5">
        {step.points.map((point, pointIndex) => (
          <li key={`${point.label}-${pointIndex}`} className="text-[16px] font-normal leading-[1.6] text-text md:text-[17px]">
            <span className="font-semibold text-secondary">{point.label}</span> {point.text}
          </li>
        ))}
      </ul>
    </div>
  )

  const imagePanel = (
    <img
      src={step.image}
      alt=""
      className="h-[340px] w-full rounded-[12px] object-cover md:h-[365px]"
    />
  )

  return (
    <article className="relative grid grid-cols-[64px_minmax(0,1fr)] items-start gap-x-4 gap-y-6 lg:grid-cols-[1fr_90px_1fr] lg:gap-6">
      <div
        ref={markerRef}
        className="relative z-10 col-start-1 row-start-1 flex justify-center lg:col-start-2 lg:row-start-1"
      >
        <div
          className={`flex h-[60px] w-[60px] items-center justify-center rounded-full transition-colors duration-500 ease-out ${
            isActive ? 'bg-secondary' : 'bg-primary'
          }`}
        >
          <img src={step.icon} alt="" className="h-[40px] w-[40px] object-contain brightness-0 invert" />
        </div>
      </div>

      <div className="relative col-start-2 row-start-1 lg:hidden">{contentCard('mobile')}</div>

      <div className="relative hidden lg:col-start-1 lg:row-start-1 lg:block">
        {reversed ? imagePanel : contentCard()}
      </div>

      <div className="relative hidden lg:col-start-3 lg:row-start-1 lg:block">
        {reversed ? contentCard() : imagePanel}
      </div>
    </article>
  )
}

function Process() {
  const timelineRef = useRef(null)
  const markerRefs = useRef([])
  const [activeStep, setActiveStep] = useState(0)
  const [lineMetrics, setLineMetrics] = useState({ top: 30, height: 0, progress: 0 })
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false)
  const [processData, setProcessData] = useState(null)

  useEffect(() => {
    let isMounted = true

    fetchProcess()
      .then((data) => {
        if (isMounted) setProcessData(data)
      })
      .catch(() => {})

    return () => {
      isMounted = false
    }
  }, [])

  const heroBackgroundImage = processData?.hero_background_image
    ? getMediaUrl(processData.hero_background_image)
    : heroBg
  const heroTitle = processData?.hero_title || 'Process'
  const introHeading = processData?.intro_heading || 'Engineered for Absolute Accountability'
  const introDescription =
    processData?.intro_description ||
    `Executing multi-site security rollouts requires more than advanced hardware; it
    demands an unbreakable operational framework. From initial site audit to final
    handover, our structured deployment journey eliminates bottlenecks, ensures complete
    transparency, and guarantees your critical infrastructure is delivered on time, every
    time.`
  const processSteps = processData?.steps?.length
    ? processData.steps.map((step, index) => ({
        icon: step.icon ? getMediaUrl(step.icon) : defaultProcessSteps[index % defaultProcessSteps.length].icon,
        image: step.image ? getMediaUrl(step.image) : defaultProcessSteps[index % defaultProcessSteps.length].image,
        title: step.title || '',
        points: step.points?.length ? step.points : [],
      }))
    : defaultProcessSteps
  const ctaBackgroundImage = processData?.cta_background_image
    ? getMediaUrl(processData.cta_background_image)
    : ctaBg
  const ctaHeading = processData?.cta_heading || 'Experience Seamless Project Execution'
  const ctaDescription =
    processData?.cta_description ||
    'Connect with our integration experts to discuss how our disciplined deployment process can secure your next enterprise rollout.'
  const ctaButtonLabel = processData?.cta_button_label || 'Consult Our Engineering Team'

  useEffect(() => {
    const updateTimeline = () => {
      const timeline = timelineRef.current
      const markers = markerRefs.current.filter(Boolean)

      if (!timeline || markers.length === 0) {
        return
      }

      const timelineRect = timeline.getBoundingClientRect()
      const viewportCenter = window.innerHeight / 2
      const markerCenters = markers.map((marker) => {
        const markerRect = marker.getBoundingClientRect()
        return {
          local: markerRect.top + markerRect.height / 2 - timelineRect.top,
          viewport: markerRect.top + markerRect.height / 2,
        }
      })
      const firstMarker = markerCenters[0].local
      const lastMarker = markerCenters[markerCenters.length - 1].local
      const passedIndex = markerCenters.reduce(
        (lastPassed, marker, markerIndex) =>
          marker.viewport <= viewportCenter ? markerIndex : lastPassed,
        0,
      )
      const progress = Math.min(
        Math.max(viewportCenter - timelineRect.top - firstMarker, 0),
        lastMarker - firstMarker,
      )

      setActiveStep(passedIndex)
      setLineMetrics({
        top: firstMarker,
        height: lastMarker - firstMarker,
        progress,
      })
    }

    updateTimeline()
    window.addEventListener('scroll', updateTimeline, { passive: true })
    window.addEventListener('resize', updateTimeline)

    return () => {
      window.removeEventListener('scroll', updateTimeline)
      window.removeEventListener('resize', updateTimeline)
    }
  }, [processSteps.length])

  return (
    <div className="bg-white font-body">
      <main>
        <section
          className="relative flex min-h-100 items-start bg-cover bg-center px-5 pt-48 sm:px-10 md:min-h-125 md:px-8 md:pt-60 xl:px-60 xl:pt-52"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,.3),rgba(0,0,0,.3)), url(${heroBackgroundImage})`,
          }}
        >
          <div className="mx-auto w-full max-w-[1200px] pt-[2px]">
            <a href="/" className="font-kumbh text-[20px] font-semibold capitalize leading-[1.5] text-background transition-colors hover:text-[var(--color-white)]">
              Home
            </a>
            <h1
              className="-ml-1 mt-[10px] text-[45px] font-semibold leading-[1.05] md:text-[70px]"
              style={{ color: 'var(--color-white)' }}
            >
              {heroTitle}
            </h1>
          </div>
        </section>

        <section className="px-5 py-[80px]">
          <div className="mx-auto max-w-[1200px] text-center">
            <h1 className="mx-auto max-w-[980px] text-[32px] font-semibold leading-[1.125] text-secondary md:text-[45px]">
              {introHeading}
            </h1>
            <p className="mx-auto mt-[20px] max-w-[1180px] text-justify text-[18px] font-normal leading-[1.5] text-text md:text-center">
              {introDescription}
            </p>
          </div>

          <div ref={timelineRef} className="relative mx-auto mt-[70px] max-w-[1400px] space-y-[12px]">
            <div
              className="pointer-events-none absolute left-[30px] w-px bg-[#b8b8b8] lg:left-1/2 lg:-translate-x-1/2"
              style={{ top: `${lineMetrics.top}px`, height: `${lineMetrics.height}px` }}
            >
              <div
                className="w-px bg-secondary transition-[height] duration-500 ease-out will-change-[height]"
                style={{ height: `${lineMetrics.progress}px` }}
              />
            </div>
            {processSteps.map((step, index) => (
              <ProcessStep
                key={`${step.title}-${index}`}
                step={step}
                index={index}
                isActive={index <= activeStep}
                markerRef={(node) => {
                  markerRefs.current[index] = node
                }}
              />
            ))}
          </div>
        </section>

        <section className="pb-0">
          <div
            className="min-h-[415px] bg-cover bg-center px-5 py-[80px] md:px-0"
            style={{
              backgroundImage: `linear-gradient(rgba(18,28,69,.28),rgba(18,28,69,.28)), url(${ctaBackgroundImage})`,
            }}
          >
            <div className="mx-auto flex min-h-[255px] max-w-[1680px] flex-col items-start justify-center gap-8 md:flex-row md:items-center md:justify-between">
              <div className="max-w-[720px] text-left">
                <h2
                  className="text-[32px] font-semibold leading-[1.125] md:text-[45px]"
                  style={{ color: 'var(--color-white)' }}
                >
                  {ctaHeading}
                </h2>
                <p
                  className="mt-[20px] max-w-[720px] text-[16px] font-normal leading-[1.67]"
                  style={{ color: 'var(--color-white)' }}
                >
                  {ctaDescription}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsEnquiryOpen(true)}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-[40px] py-[14px] text-[18px] font-medium capitalize leading-[1.5] text-[var(--color-white)] transition hover:bg-secondary hover:text-[var(--color-white)] md:mr-[20px]"
              >
                {ctaButtonLabel}
              </button>
            </div>
          </div>
        </section>
      </main>

      <EnquiryPopup isOpen={isEnquiryOpen} onClose={() => setIsEnquiryOpen(false)} />
    </div>
  )
}

export default Process
