import { ChevronDown } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import logo from '../assets/products/video-surveillance-6.png'

function Header() {
  const linkClass = ({ isActive }) =>
    `px-[15px] py-2 text-[15px] font-medium transition ${
      isActive ? 'text-primary' : 'text-secondary hover:text-primary'
    }`

  return (
    <header className="absolute left-0 right-0 top-4 z-20 px-5">
      <nav className="mx-auto flex max-w-[1126px] items-center gap-6 rounded-full bg-white/90 px-5 py-[15px] shadow-sm backdrop-blur">
        <NavLink
          to="/"
          className="flex w-[20%] min-w-[160px] items-center"
          aria-label="ASSIPL home"
        >
          <img src={logo} alt="ASSIPL" className="h-10 w-auto object-contain" />
        </NavLink>
        <div className="hidden flex-1 items-center justify-center lg:flex">
          <NavLink to="/" className={linkClass}>
            Home
          </NavLink>
          <NavLink to="/about" className={linkClass}>
            About Us
          </NavLink>
          <NavLink to="/products/video-surveillance" className={linkClass}>
            <span className="inline-flex items-center gap-1">
              Products
              <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
          </NavLink>
          <NavLink to="/about" className={linkClass}>
            <span className="inline-flex items-center gap-1">
              Services
              <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
          </NavLink>
          <a href="#" className="px-[15px] py-2 text-[15px] font-medium text-secondary transition hover:text-primary">
            Blogs
          </a>
          <a href="#" className="px-[15px] py-2 text-[15px] font-medium text-secondary transition hover:text-primary">
            Contact Us
          </a>
        </div>
        <a
          href="#"
          id="glow"
          className="ml-auto hidden rounded-full bg-primary px-[30px] py-[10px] text-sm font-semibold text-white transition hover:bg-secondary md:inline-flex"
        >
          Enquire Now
        </a>
      </nav>
    </header>
  )
}

export default Header
