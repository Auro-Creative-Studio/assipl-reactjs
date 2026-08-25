import { ChevronDown } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import logo from '../assets/products/video-surveillance-6.png'

function Header() {
  const linkClass = ({ isActive }) =>
    `px-[15px] py-2 text-[15px] font-semibold capitalize leading-[1.43] transition ${
      isActive ? 'text-primary' : 'text-nav hover:text-primary'
    }`

  return (
    <header className="absolute left-0 right-0 top-[29px] z-20 px-5">
      <nav className="mx-auto flex min-h-[71px] max-w-[1126px] items-center gap-6 rounded-full bg-white/75 px-5 py-[11px] shadow-sm backdrop-blur">
        <NavLink
          to="/"
          className="flex w-[20%] min-w-[160px] items-center"
          aria-label="ASSIPL home"
        >
          <img src={logo} alt="ASSIPL" className="h-[50px] w-auto object-contain" />
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
            <div className="invisible absolute left-0 top-full z-30 min-w-[160px] rounded-2xl bg-white p-3 opacity-0 shadow-lg transition duration-150 group-hover:visible group-hover:opacity-100">
              <NavLink
                to="/career"
                className={({ isActive }) =>
                  `block rounded-lg px-4 py-2 text-[15px] font-medium transition ${
                    isActive ? 'text-primary' : 'text-secondary hover:text-primary'
                  }`
                }
              >
                Career
              </NavLink>
              <NavLink
                to="/csr"
                className={({ isActive }) =>
                  `block rounded-lg px-4 py-2 text-[15px] font-medium transition ${
                    isActive ? 'text-primary' : 'text-secondary hover:text-primary'
                  }`
                }
              >
                CSR
              </NavLink>
            </div>
          </div>
          <NavLink to="/products/video-surveillance" className={linkClass}>
            <span className="inline-flex items-center gap-1">
              Products
              <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
          </NavLink>
          <NavLink to="/service" className={linkClass}>
            <span className="inline-flex items-center gap-1">
              Services
              <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
            </span>
          </NavLink>
          <a href="#" className="px-[15px] py-2 text-[15px] font-semibold capitalize leading-[1.43] text-nav transition hover:text-primary">
            Process
          </a>
          <a href="#" className="px-[15px] py-2 text-[15px] font-semibold capitalize leading-[1.43] text-nav transition hover:text-primary">
            Contact Us
          </a>
        </div>
        <a
          href="#"
          id="glow"
          className="ml-auto hidden rounded-full bg-primary px-[30px] py-[10px] text-[15px] font-semibold capitalize leading-[1.43] text-white transition hover:bg-secondary md:inline-flex"
        >
          Enquire Now
        </a>
      </nav>
    </header>
  )
}

export default Header
