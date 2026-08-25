import { Link } from 'react-router-dom'
import logo from '../assets/products/video-surveillance-6.png'

function Footer() {
  const quickLinks = [
    { label: 'Home', to: '/' },
    { label: 'About Us' },
    { label: 'Services', to: '/services' },
    { label: 'Blogs' },
    { label: 'Contact Us' },
    { label: 'Privacy Policy', to: '/privacy-policy' },
    { label: 'Terms and Conditions', to: '/terms-and-conditions' },
  ]
  const products = [
    'Video Surveillance',
    'Access Control',
    'Fire Detection System',
    'Intrusion Detection System',
    'Gate Automation & Control Barriers',
    'Gas Suppression System',
  ]

  return (
    <footer className="mt-auto bg-secondary text-white">
      <div className="mx-auto grid max-w-[1400px] gap-10 px-5 py-14 md:grid-cols-[1.2fr_1fr_1fr_1.25fr]">
        <div>
          <img src={logo} alt="ASSIPL" className="h-12 w-auto object-contain" />
          <p className="mt-6 max-w-xs text-[15px] leading-7 text-white/75">
            ASSIPL operates at the intersection of advanced technology and rigorous field
            engineering.
          </p>
        </div>
        <div>
          <h3 className="mb-5 text-xl font-semibold text-white">Quick Links</h3>
          <ul className="space-y-3 text-[15px] text-white/75">
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
        </div>
        <div>
          <h3 className="mb-5 text-xl font-semibold text-white">Products</h3>
          <ul className="space-y-3 text-[15px] text-white/75">
            {products.map((product) => (
              <li key={product}>
                <a href="#" className="transition hover:text-white">
                  {product}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-5 text-xl font-semibold text-white">Contact Us</h3>
          <div className="space-y-4 text-[15px] leading-7 text-white/75">
            <p>House No: 2497, GF, 17th Main, HAL 2nd Stage, Indiranagar, Bangalore - 560008.</p>
            <p>
              <a href="tel:08041692300" className="hover:text-white">
                080 - 41692300
              </a>{' '}
              /{' '}
              <a href="tel:08043751024" className="hover:text-white">
                080 - 43751024
              </a>
            </p>
            <a href="mailto:assipl@automationsystems.co.in" className="block hover:text-white">
              assipl@automationsystems.co.in
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/15">
        <div className="mx-auto max-w-[1400px] px-5 py-5 text-center text-sm text-white/70">
          Copyright (c) 2026 ASSIPL. All Rights Reserved. Developed by Auro Creative Studio.
        </div>
      </div>
    </footer>
  )
}

export default Footer
