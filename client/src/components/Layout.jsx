import { NavLink, Outlet } from 'react-router-dom'
import { Dumbbell, History, House, Settings, TrendingUp } from 'lucide-react'
import ThemeToggle from './ThemeToggle'

const mobileNav = [
  { to: '/', label: 'Inicio', icon: House, end: true },
  { to: '/rutina', label: 'Rutina', icon: Dumbbell },
  { to: '/progreso', label: 'Progreso', icon: TrendingUp },
  { to: '/historial', label: 'Historial', icon: History },
]

const sideNav = [
  ...mobileNav,
  { to: '/ajustes', label: 'Ajustes', icon: Settings },
]

function Logo() {
  return (
    <div className="flex items-center gap-2 font-display text-lg font-bold">
      <span className="grid h-8 w-8 place-items-center rounded-btn bg-primary text-on-primary">
        <Dumbbell size={18} />
      </span>
      RutinaFit
    </div>
  )
}

const sideLink = ({ isActive }) =>
  `flex items-center gap-3 rounded-btn px-3 py-2.5 text-sm font-medium transition-colors ${
    isActive
      ? 'bg-primary/15 text-primary'
      : 'text-muted hover:bg-bg hover:text-fg'
  }`

const bottomLink = ({ isActive }) =>
  `flex flex-col items-center gap-1 px-3 py-2 text-xs font-medium transition-colors ${
    isActive ? 'text-primary' : 'text-muted hover:text-fg'
  }`

export default function Layout() {
  return (
    <div className="min-h-dvh">
      {/* Barra lateral (escritorio) */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-border bg-surface p-4 md:flex">
        <div className="px-3 py-2">
          <Logo />
        </div>
        <nav className="mt-6 flex flex-1 flex-col gap-1" aria-label="Principal">
          {sideNav.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className={sideLink}>
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="px-3">
          <ThemeToggle />
        </div>
      </aside>

      {/* Encabezado (celular) */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-surface/95 px-4 py-3 backdrop-blur md:hidden">
        <Logo />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <NavLink
            to="/ajustes"
            aria-label="Ajustes"
            className="grid h-10 w-10 place-items-center rounded-btn border border-border bg-surface text-muted transition-colors hover:text-fg"
          >
            <Settings size={18} />
          </NavLink>
        </div>
      </header>

      {/* Contenido */}
      <div className="md:pl-64">
        <main className="mx-auto w-full max-w-[960px] px-4 pb-24 md:px-8 md:pb-10">
          <Outlet />
        </main>
      </div>

      {/* Barra inferior (celular) */}
      <nav
        aria-label="Navegación móvil"
        className="fixed inset-x-0 bottom-0 z-20 border-t border-border bg-surface/95 backdrop-blur md:hidden"
      >
        <ul className="mx-auto flex max-w-md justify-around">
          {mobileNav.map(({ to, label, icon: Icon, end }) => (
            <li key={to}>
              <NavLink to={to} end={end} className={bottomLink}>
                <Icon size={20} />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}