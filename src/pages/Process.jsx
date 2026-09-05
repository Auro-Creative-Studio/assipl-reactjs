import { useEffect, useRef, useState } from 'react'
import EnquiryPopup from '../components/EnquiryPopup'
import Reveal from '../components/Reveal'
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
import { useSeoMeta } from '../hooks/useSeoMeta'

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
          ? 'flex min-h-119.5 flex-col justify-center px-7.5 py-5'
          : 'flex min-h-91.25 flex-col justify-center px-8.5 py-13.5 md:px-12.5'
      } ${
        mode === 'mobile'
          ? 'before:absolute before:-left-4.5 before:top-4 before:h-0 before:w-0 before:border-y-15 before:border-r-18 before:border-y-transparent before:border-r-background'
          : reversed
            ? 'lg:ml-4.5 lg:before:absolute lg:before:-left-5.5 lg:before:top-6 lg:before:h-0 lg:before:w-0 lg:before:border-y-18 lg:before:border-r-22 lg:before:border-y-transparent lg:before:border-r-background'
            : 'lg:mr-4.5 lg:after:absolute lg:after:-right-5.5 lg:after:top-6 lg:after:h-0 lg:after:w-0 lg:after:border-y-18 lg:after:border-l-22 lg:after:border-y-transparent lg:after:border-l-background'
      }`}
    >
      <h2 className="font-body text-[23px] font-medium leading-tight text-black md:text-[26px]">
        {step.title}
      </h2>
      <ul className="mt-4 list-disc space-y-1.5 pl-5">
        {step.points.map((point, pointIndex) => (
          <li key={`${point.label}-${pointIndex}`} className="text-body font-normal text-text">
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
      className="h-85 w-full rounded-xl object-cover md:h-91.25"
    />
  )

  return (
    <Reveal as="article" className="relative grid grid-cols-[64px_minmax(0,1fr)] items-start gap-x-4 gap-y-6 lg:grid-cols-[1fr_90px_1fr] lg:gap-6">
      <div
        ref={markerRef}
        className="relative z-10 col-start-1 row-start-1 flex justify-center lg:col-start-2 lg:row-start-1"
      >
        <div
          className={`flex h-15 w-15 items-center justify-center rounded-full transition-colors duration-500 ease-out ${
            isActive ? 'bg-secondary' : 'bg-primary'
          }`}
        >
          <img src={step.icon} alt="" className="h-10 w-10 object-contain brightness-0 invert" />
        </div>
      </div>

      <div className="relative col-start-2 row-start-1 lg:hidden">{contentCard('mobile')}</div>

      <div className="relative hidden lg:col-start-1 lg:row-start-1 lg:block">
        {reversed ? imagePanel : contentCard()}
      </div>

      <div className="relative hidden lg:col-start-3 lg:row-start-1 lg:block">
        {reversed ? contentCard() : imagePanel}
      </div>
    </Reveal>
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

  useSeoMeta({
    title: processData?.meta_title || 'Process | ASSIPL',
    description:
      processData?.meta_description ||
      'Our structured deployment process for enterprise security rollouts, from strategic blueprinting to handover.',
    keywords: processData?.meta_keywords,
    ogTitle: processData?.og_title,
    ogDescription: processData?.og_description,
    ogImage: processData?.og_image,
    robotsIndex: processData?.robots_index,
    robotsFollow: processData?.robots_follow,
  })

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
          <div className="mx-auto w-full max-w-300 pt-0.5">
            <a href="/" className="text-[20px] font-semibold capitalize leading-normal text-background transition-colors hover:text-white">
              Home
            </a>
            <Reveal
              as="h1"
              className="-ml-1 mt-2.5 text-[45px] font-semibold leading-[1.05] md:text-[70px]"
              style={{ color: 'var(--color-white)' }}
            >
              {heroTitle}
            </Reveal>
          </div>
        </section>

        <section className="px-5 py-20">
          <Reveal className="mx-auto max-w-300 text-center">
            <h1 className="mx-auto max-w-245 text-[32px] font-semibold leading-[1.125] text-secondary md:text-[45px]">
              {introHeading}
            </h1>
            <p className="mx-auto mt-5 max-w-295 text-left text-body font-normal text-text md:text-center">
              {introDescription}
            </p>
          </Reveal>

          <div ref={timelineRef} className="relative mx-auto mt-18 max-w-350 space-y-3">
            <div
              className="pointer-events-none absolute left-7.5 w-px bg-[#b8b8b8] lg:left-1/2 lg:-translate-x-1/2"
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
            className="min-h-103.75 bg-cover bg-center px-5 py-20 md:px-0"
            style={{
              backgroundImage: `linear-gradient(rgba(18,28,69,.28),rgba(18,28,69,.28)), url(${ctaBackgroundImage})`,
            }}
          >
            <Reveal className="mx-auto flex min-h-65 max-w-360 flex-col items-start justify-center gap-8 md:flex-row md:items-center md:justify-between">
              <div className="max-w-180 text-left">
                <h2
                  className="text-[32px] font-semibold leading-[1.125] md:text-[45px]"
                  style={{ color: 'var(--color-white)' }}
                >
                  {ctaHeading}
                </h2>
                <p
                  className="mt-5 max-w-180 text-body font-normal"
                  style={{ color: 'var(--color-white)' }}
                >
                  {ctaDescription}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsEnquiryOpen(true)}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-10 py-3.5 text-[18px] font-medium capitalize leading-normal text-white transition hover:bg-secondary hover:text-white md:mr-5"
              >
                {ctaButtonLabel}
              </button>
            </Reveal>
          </div>
        </section>
      </main>

      <EnquiryPopup isOpen={isEnquiryOpen} onClose={() => setIsEnquiryOpen(false)} />
    </div>
  )
}

export default Process
