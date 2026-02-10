import { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'

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
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="text-lg font-semibold tracking-tight text-slate-900">
            心理测评中心
          </Link>
          <nav className="flex items-center gap-4 text-sm text-slate-600">
            {navItems.map((item) => {
              const active = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`rounded-full px-3 py-1 transition ${
                    active
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-6 py-10">{children}</main>
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-6 text-xs text-slate-500">
          提示：本项目为演示版，量表题库需替换为授权内容。
        </div>
      </footer>
    </div>
  )
}
