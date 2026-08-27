import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/logo-light.png'
import Reveal from './Reveal'
import { fetchPublishedProducts } from '../lib/productsApi'
import { fetchContactPage } from '../lib/contactApi'
import { FaLinkedinIn } from 'react-icons/fa'

const defaultPhoneNumbers = ['080 – 41692300', '080 – 43751024']
const defaultEmail = 'assipl@automationsystems.co.in'
const defaultAddressText = 'House No: 2497, GF, 17th Main, HAL 2nd Stage, Indiranagar, Bangalore – 560008.'
const defaultAddressMapHref = 'https://maps.app.goo.gl/APLDUrrqLS96XhFi9'
const defaultLinkedinLink = 'https://www.linkedin.com/company/automation-systems-solutions-pvt-ltd/'

const toTelHref = (value) => `tel:${value.replace(/[^\d+]/g, '')}`
const toMailHref = (value) => `mailto:${value.trim()}`

const fallbackProducts = [
  { label: 'Video Surveillance', to: '/products/video-surveillance' },
  { label: 'Access Control', to: '/products/access-control' },
  { label: 'Fire Detection System', to: '/products/fire-detection-system' },
  { label: 'Intrusion Detection System', to: '/products/intrusion-detection-systems' },
  { label: 'Gate Automation & Control Barriers', to: '/products/gate-automation-control-barriers' },
  { label: 'Gas Suppression System', to: '/products/gas-suppression-system' },
]

function Footer() {
  const currentYear = new Date().getFullYear()
  const [products, setProducts] = useState(fallbackProducts)
  const [contactData, setContactData] = useState(null)
  const quickLinks = [
    { label: 'Home', to: '/' },
    { label: 'About Us', to: '/about' },
    { label: 'Services', to: '/service' },
    { label: 'Blogs', to: '/blogs' },
    { label: 'Contact Us', to: '/contact-us' },
    { label: 'Privacy Policy', to: '/privacy-policy' },
    { label: 'Terms and Conditions', to: '/terms-and-conditions' },
  ]

  useEffect(() => {
    let isMounted = true

    fetchPublishedProducts()
      .then((items) => {
        if (!isMounted || items.length === 0) return

        setProducts(
          items.map((item) => ({
            label: item.title,
            to: `/products/${item.slug}`,
          }))
        )
      })
      .catch(() => {})

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    fetchContactPage()
      .then((data) => {
        if (isMounted) setContactData(data)
      })
      .catch(() => {})

    return () => {
      isMounted = false
    }
  }, [])

  const phoneNumbers = contactData?.phoneno
    ? contactData.phoneno.split('/').map((part) => part.trim()).filter(Boolean)
    : defaultPhoneNumbers
  const email = contactData?.email || defaultEmail
  const addressText = contactData?.address
    ? contactData.address.replace(/\n+/g, ' ').trim()
    : defaultAddressText
  const displaySocialLinks = [
    {
      key: 'linkedin',
      href: contactData?.linkedin_link || defaultLinkedinLink,
      Icon: FaLinkedinIn,
      label: 'ASSIPL on LinkedIn',
    },
  ]
  const addressMapHref = contactData?.map_link || defaultAddressMapHref

  return (
    <footer className="mt-auto bg-secondary text-white">
      <div className="mx-auto grid max-w-7xl gap-18 px-5 pt-15 pb-12 md:grid-cols-[1.2fr_1fr_1fr_1.25fr]">
        <Reveal>
          <img src={logo} alt="ASSIPL" className="h-12 w-auto object-contain" />
          <p className="mt-5 max-w-xs text-base leading-normal text-white/75">
            ASSIPL operates at the intersection of advanced technology and rigorous field
            engineering.
          </p>
          <div className="mt-2.5 flex gap-2">
            {displaySocialLinks.map(({ key, href, Icon, label }) => (
              <a
                key={key}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white text-white transition hover:border-primary hover:bg-primary"
              >
                <Icon className="h-3.5 w-3.5" />
              </a>
            ))}
          </div>
        </Reveal>
        <Reveal delay={100}>
          <h3 className="mb-5 text-2xl leading-[1.6] font-medium tracking-[0.015em] text-white">Quick Links</h3>
          <ul className="space-y-3 text-lg leading-[1.67] text-white/75">
            {quickLinks.map((link) => (
              <li key={link.label}>
                {link.to ? (
                  <Link to={link.to} className="transition hover:text-white">
                    {link.label}
                  </Link>
                ) : (
                  <a href="#" className="transition hover:text-white">
                    {link.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={200}>
          <h3 className="mb-5 text-2xl leading-[1.6] font-medium tracking-[0.015em] text-white">Products</h3>
          <ul className="space-y-3 text-lg leading-[1.67] text-white/75">
            {products.map((product) => (
              <li key={product.label}>
                {product.to ? (
                  <Link to={product.to} className="transition hover:text-white">
                    {product.label}
                  </Link>
                ) : (
                  <a href="#" className="transition hover:text-white">
                    {product.label}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={300}>
          <h3 className="mb-5 text-2xl leading-[1.6] font-medium tracking-[0.015em] text-white">Contact Us</h3>
          <div className="max-w-87.5 space-y-4 text-lg leading-[1.67] text-white/75">
            <a
              href={addressMapHref}
              target="_blank"
              rel="noreferrer"
              className="block transition hover:text-white"
            >
              {addressText}
            </a>
            <p>
              {phoneNumbers.map((phone, index) => (
                <span key={phone}>
                  {index > 0 && ' / '}
                  <a href={toTelHref(phone)} className="hover:text-white">
                    {phone}
                  </a>
                </span>
              ))}
            </p>
            <a href={toMailHref(email)} className="block hover:text-white">
              {email}
            </a>
          </div>
        </Reveal>
      </div>
      <div className="border-t border-[#D1D1D1] max-w-6xl mx-auto">
        <div className="mx-auto max-w-350 px-5 pt-4 pb-6 text-center text-sm text-white/70">
          Copyright © {currentYear} ASSIPL. All Rights Reserved. Developed by{' '}
          <a
            href="https://aurocreativestudio.com/"
            target="_blank"
            rel="noreferrer"
            className="transition hover:text-white"
          >
            Auro Creative Studio.
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
