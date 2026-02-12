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
  { name: '动物塑', path: '/animal' },
  { name: 'MBTI', path: '/mbti' },
  { name: 'AAT', path: '/aat' },
  { name: '心理年龄', path: '/psych-age' },
  { name: 'APT', path: '/apt' },
  { name: '霍兰德', path: '/hit' },
  { name: 'DTH', path: '/dth' },
  { name: '年上年下', path: '/tla' },
  { name: '水果塑', path: '/fft' },
  { name: '病娇', path: '/ybt' },
  { name: '恋爱观', path: '/rvt' },
  { name: '恋爱脑', path: '/lbt' },
  { name: 'MPT', path: '/mpt' },
  { name: 'VBT', path: '/vbt' },
  { name: '宜居城市', path: '/city' },
]

export default function Layout({ children }: LayoutProps) {
  const location = useLocation()

  return (
    <div className="app-layout min-h-screen bg-gradient-to-br from-xia-cream/30 via-white/80 to-xia-haze/20 transition-colors duration-500">
      <header className="border-b border-xia-haze/50 bg-white/95 shadow-sm backdrop-blur-sm print:hidden">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:gap-6 sm:px-6">
          <Link to="/" className="shrink-0 text-lg font-semibold tracking-tight text-xia-deep">
            心理测评中心
          </Link>
          <nav className="nav-scroll min-w-0 flex-1 overflow-x-auto">
            <div className="flex items-center gap-2 pb-1 sm:gap-3" style={{ width: 'max-content' }}>
              {navItems.map((item) => {
                const active = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path + '/'))
                const isHome = item.path === '/'
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`shrink-0 rounded-full px-3 py-1.5 text-sm transition ${
                      isHome
                        ? active
                          ? 'bg-xia-sky font-semibold text-white'
                          : 'font-semibold text-xia-sky hover:bg-xia-sky/10'
                        : active
                          ? 'bg-xia-deep font-medium text-white'
                          : 'font-medium text-xia-deep/70 hover:bg-xia-haze/50'
                    }`}
                  >
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </nav>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10 print:max-w-none print:px-0 print:py-0">
        {children}
      </main>
      <footer className="border-t border-xia-haze bg-white/60 print:hidden">
        <div className="mx-auto max-w-6xl px-4 py-6 text-xs text-xia-deep/60 sm:px-6 space-y-2">
          <p className="font-medium text-xia-deep/70">免责声明</p>
          <p>本网站所有测评均为自评工具，仅供自我探索与娱乐参考，不构成任何专业心理评估、临床诊断或医疗建议。测评题目与结果解释仅供学习交流，如有持续困扰请寻求专业心理咨询或医疗机构帮助。数据在本地处理，不上传服务器。</p>
        </div>
      </footer>
      <ThemeSwitcher />
    </div>
  )
}
