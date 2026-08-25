import { Sparkles } from 'lucide-react'
import { NavLink } from 'react-router-dom'

function Header() {
  const linkClass = ({ isActive }) =>
    `rounded-md px-3 py-2 text-sm font-medium transition ${
      isActive ? 'bg-primary text-white' : 'text-text hover:bg-background'
    }`

  return (
    <header className="border-b border-border bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <NavLink
          to="/"
          className="flex items-center gap-2 font-heading text-lg font-semibold text-secondary"
        >
          <Sparkles className="h-5 w-5 text-primary" aria-hidden="true" />
          ASSIPL React
        </NavLink>
        <div className="flex items-center gap-2">
          <NavLink to="/" className={linkClass}>
            Home
          </NavLink>
          <NavLink to="/about" className={linkClass}>
            About
          </NavLink>
        </div>
      </nav>
    </header>
  )
}

export default Header
