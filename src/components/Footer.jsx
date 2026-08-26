import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/logo-light.png'
import Reveal from './Reveal'
import { fetchPublishedProducts } from '../lib/productsApi'

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

  return (
    <footer className="mt-auto bg-secondary text-white">
      <div className="mx-auto grid max-w-7xl gap-18 px-5 pt-15 pb-12 md:grid-cols-[1.2fr_1fr_1fr_1.25fr]">
        <Reveal>
          <img src={logo} alt="ASSIPL" className="h-12 w-auto object-contain" />
          <p className="mt-5 max-w-xs text-base leading-normal text-white/75">
            ASSIPL operates at the intersection of advanced technology and rigorous field
            engineering.
          </p>
          <a
            href="https://www.linkedin.com/company/automation-systems-solutions-pvt-ltd/"
            target="_blank"
            rel="noreferrer"
            aria-label="ASSIPL on LinkedIn"
            className="mt-2.5 flex h-9 w-9 items-center justify-center rounded-full border border-white text-white transition hover:border-primary hover:bg-primary"
          >
            <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.846 0.427c-2.125 0-3.846 1.723-3.846 3.844 0 2.123 1.72 3.846 3.846 3.846 2.12 0 3.843-1.723 3.843-3.846 0-2.121-1.723-3.844-3.843-3.844zM0.529 11.034h6.632v21.338h-6.632v-21.338zM24.045 10.504c-3.226 0-5.389 1.769-6.275 3.446h-0.089v-2.916h-6.361v21.338h6.626v-10.556c0-2.783 0.53-5.478 3.98-5.478 3.401 0 3.446 3.183 3.446 5.657v10.377h6.627v-11.704c0-5.745-1.24-10.164-7.955-10.164z" />
            </svg>
          </a>
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
              href="https://maps.app.goo.gl/APLDUrrqLS96XhFi9"
              target="_blank"
              rel="noreferrer"
              className="block transition hover:text-white"
            >
              House No: 2497, GF, 17th Main, HAL 2nd Stage, Indiranagar, Bangalore – 560008.
            </a>
            <p>
              <a href="tel:08041692300" className="hover:text-white">
                080 – 41692300
              </a>{' '}
              /{' '}
              <a href="tel:08043751024" className="hover:text-white">
                080 – 43751024
              </a>
            </p>
            <a href="mailto:assipl@automationsystems.co.in" className="block hover:text-white">
              assipl@automationsystems.co.in
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
