import { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ThemeSwitcher } from './ThemeSwitcher'

type LayoutProps = {
  children: ReactNode
}

const navItems = [
  { name: '首页', path: '/' },
  { name: 'SCL-90', path: '/scl90' },
  { name: 'RPI', path: '/rpi' },
  { name: 'SRI', path: '/sri' },
]

export default function Layout({ children }: LayoutProps) {
  const location = useLocation()

  return (
    <div className="app-layout min-h-screen bg-gradient-to-br from-xia-cream/30 via-white/80 to-xia-haze/20 transition-colors duration-500">
      <header className="border-b border-xia-haze/50 bg-white/80 backdrop-blur-sm print:hidden">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <Link to="/" className="text-lg font-semibold tracking-tight text-xia-deep">
            心理测评中心
          </Link>
          <nav className="flex flex-wrap items-center gap-2 text-sm text-xia-deep/80 sm:gap-4">
            {navItems.map((item) => {
              const active = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`rounded-full px-3 py-1 transition ${
                    active
                      ? 'bg-xia-deep text-white'
                      : 'text-xia-deep/70 hover:bg-xia-haze/50'
                  }`}
                >
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10 print:max-w-none print:px-0 print:py-0">
        {children}
      </main>
      <footer className="border-t border-xia-haze bg-white/60 print:hidden">
        <div className="mx-auto max-w-6xl px-4 py-6 text-xs text-xia-deep/60 sm:px-6">
          提示：本项目为演示版，量表题库需替换为授权内容。
        </div>
      </footer>
      <ThemeSwitcher />
    </div>
  )
}
