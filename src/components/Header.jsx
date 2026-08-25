import { ChevronDown, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import logo from '../assets/logo-dark.png'

const productLinks = [
  { title: 'Video Surveillance', href: '/products/video-surveillance' },
  { title: 'Access Control', href: '#' },
  { title: 'Fire Detection System', href: '#' },
  { title: 'Intrusion Detection Systems', href: '#' },
  { title: 'Gate Automation & Control Barriers', href: '#' },
  { title: 'Gas Suppression Systems', href: '#' },
]

const serviceLinks = [
  { title: 'Strategic Planning & Design', href: '#' },
  { title: 'Core Project Execution (SITC)', href: '#' },
  { title: 'Operational Continuity & Maintenance', href: '/services/operational-continuity-maintenance' },
]

const aboutLinks = [
  { title: 'Career', href: '/career' },
  { title: 'CSR', href: '/csr' },
]

function DropdownLink({ href, className, activeClassName, children, onClick }) {
  if (href === '#') {
    return (
      <a href={href} onClick={onClick} className={className}>
        {children}
      </a>
    )
  }

  return (
    <NavLink
      to={href}
      onClick={onClick}
      className={({ isActive }) => `${className} ${isActive ? activeClassName : ''}`}
    >
      {children}
    </NavLink>
  )
}

function MobileNavItem({ title, to, links, isOpen, onToggle, onLinkClick }) {
  return (
    <div className="border-b border-border/30 py-1">
      <div className="flex items-center justify-between">
        <NavLink
          to={to}
          onClick={onLinkClick}
          className={({ isActive }) =>
            `flex-1 py-2 text-[16px] font-semibold transition ${
              isActive ? 'text-primary' : 'text-nav hover:text-primary'
            }`
          }
        >
          {title}
        </NavLink>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-label={`Toggle ${title} submenu`}
          className="flex h-7 w-7 flex-none items-center justify-center rounded-full border border-primary text-primary transition"
        >
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
        </button>
      </div>
      <div className={`grid overflow-hidden transition-all duration-200 ${isOpen ? 'grid-rows-[1fr] pb-2 pt-1' : 'grid-rows-[0fr]'}`}>
        <div className="min-h-0">
          <ul className="space-y-1 pl-4">
            {links.map((link) => (
              <li key={link.title}>
                <DropdownLink
                  href={link.href}
                  onClick={onLinkClick}
                  className="block py-1.5 text-[15px] text-secondary transition hover:text-primary"
                  activeClassName="text-primary"
                >
                  {link.title}
                </DropdownLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openSection, setOpenSection] = useState(null)

  const linkClass = ({ isActive }) =>
    `px-[15px] py-2 text-[15px] font-semibold capitalize leading-[1.43] transition ${
      isActive ? 'text-primary' : 'text-nav hover:text-primary'
    }`

  const toggleSection = (name) => {
    setOpenSection((current) => (current === name ? null : name))
  }

  const closeMobileMenu = () => {
    setMobileOpen(false)
    setOpenSection(null)
  }

  return (
    <header className="absolute left-0 right-0 top-8 z-20 px-5">
      <nav className="mx-auto flex min-h-16 max-w-282 items-center gap-6 rounded-full bg-white/75 px-5 py-3 shadow-sm backdrop-blur">
        <NavLink
          to="/"
          className="flex w-[20%] min-w-40 items-center"
          aria-label="ASSIPL home"
        >
          <img src={logo} alt="ASSIPL" className="h-10 w-auto object-contain" />
        </NavLink>
        <div className="hidden flex-1 items-center justify-center lg:flex">
          <NavLink to="/" className={linkClass}>
            Home
          </NavLink>
          <div className="group relative">
            <NavLink to="/about" className={linkClass}>
              <span className="inline-flex items-center gap-1">
                About Us
                <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
            </NavLink>
            <div className="invisible absolute left-0 top-full z-30 min-w-40 rounded-2xl bg-white p-3 opacity-0 shadow-lg transition duration-150 group-hover:visible group-hover:opacity-100">
              {aboutLinks.map((link) => (
                <DropdownLink
                  key={link.title}
                  href={link.href}
                  className="block rounded-lg px-4 py-2 text-[15px] font-medium text-secondary transition hover:text-primary"
                  activeClassName="text-primary"
                >
                  {link.title}
                </DropdownLink>
              ))}
            </div>
          </div>
          <div className="group relative">
            <NavLink to="/products/video-surveillance" className={linkClass}>
              <span className="inline-flex items-center gap-1">
                Products
                <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
            </NavLink>
            <div className="invisible absolute left-0 top-full z-30 min-w-64 rounded-2xl bg-white p-3 opacity-0 shadow-lg transition duration-150 group-hover:visible group-hover:opacity-100">
              {productLinks.map((link) => (
                <DropdownLink
                  key={link.title}
                  href={link.href}
                  className="block rounded-lg px-4 py-2 text-[15px] font-medium text-secondary transition hover:text-primary"
                  activeClassName="text-primary"
                >
                  {link.title}
                </DropdownLink>
              ))}
            </div>
          </div>
          <div className="group relative">
            <NavLink to="/service" className={linkClass}>
              <span className="inline-flex items-center gap-1">
                Services
                <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
            </NavLink>
            <div className="invisible absolute left-0 top-full z-30 min-w-64 rounded-2xl bg-white p-3 opacity-0 shadow-lg transition duration-150 group-hover:visible group-hover:opacity-100">
              {serviceLinks.map((link) => (
                <DropdownLink
                  key={link.title}
                  href={link.href}
                  className="block rounded-lg px-4 py-2 text-[15px] font-medium text-secondary transition hover:text-primary"
                  activeClassName="text-primary"
                >
                  {link.title}
                </DropdownLink>
              ))}
            </div>
          </div>
          <a href="#" className="px-4 py-2 text-[15px] font-semibold capitalize leading-[1.43] text-nav transition hover:text-primary">
            Process
          </a>
          <a href="#" className="px-4 py-2 text-[15px] font-semibold capitalize leading-[1.43] text-nav transition hover:text-primary">
            Contact Us
          </a>
        </div>
        <div className="ml-auto flex items-center gap-3 lg:ml-0">
          <a
            href="#"
            id="glow"
            className="hidden rounded-full bg-primary px-8 py-3 text-[15px] font-semibold capitalize leading-[1.43] text-white transition hover:bg-secondary md:inline-flex"
          >
            Enquire Now
          </a>
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            className="flex h-10 w-10 flex-none items-center justify-center rounded-full text-secondary transition hover:bg-background lg:hidden"
          >
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-200 lg:hidden ${
          mobileOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={closeMobileMenu}
        aria-hidden="true"
      />

      <aside
        className={`fixed left-0 top-0 z-50 h-full w-[82%] max-w-80 overflow-y-auto bg-white shadow-xl transition-transform duration-300 lg:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <img src={logo} alt="ASSIPL" className="h-8 w-auto object-contain" />
          <button
            type="button"
            onClick={closeMobileMenu}
            aria-label="Close menu"
            className="flex h-9 w-9 flex-none items-center justify-center rounded-md bg-secondary text-white"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <nav className="px-5 pb-8">
          <NavLink
            to="/"
            onClick={closeMobileMenu}
            className={({ isActive }) =>
              `block border-b border-border/30 py-3 text-[16px] font-semibold transition ${
                isActive ? 'text-primary' : 'text-nav hover:text-primary'
              }`
            }
          >
            Home
          </NavLink>
          <MobileNavItem
            title="About Us"
            to="/about"
            links={aboutLinks}
            isOpen={openSection === 'about'}
            onToggle={() => toggleSection('about')}
            onLinkClick={closeMobileMenu}
          />
          <MobileNavItem
            title="Products"
            to="/products/video-surveillance"
            links={productLinks}
            isOpen={openSection === 'products'}
            onToggle={() => toggleSection('products')}
            onLinkClick={closeMobileMenu}
          />
          <MobileNavItem
            title="Services"
            to="/service"
            links={serviceLinks}
            isOpen={openSection === 'services'}
            onToggle={() => toggleSection('services')}
            onLinkClick={closeMobileMenu}
          />
          <a
            href="#"
            onClick={closeMobileMenu}
            className="block border-b border-border/30 py-3 text-[16px] font-semibold text-nav transition hover:text-primary"
          >
            Process
          </a>
          <a
            href="#"
            onClick={closeMobileMenu}
            className="block py-3 text-[16px] font-semibold text-nav transition hover:text-primary"
          >
            Contact Us
          </a>

        </nav>
      </aside>
    </header>
  )
}

export default Header
