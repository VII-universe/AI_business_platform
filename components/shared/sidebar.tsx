'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, Palette, FileText, Megaphone, Users,
  Zap, BarChart2, Settings, Brain, Sparkles, ChevronRight, Bot,
} from 'lucide-react'
import { ThemeToggle } from './theme-toggle'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/brand', label: 'Brand AI', icon: Palette },
  { href: '/content', label: 'Content AI', icon: FileText },
  { href: '/campaigns', label: 'Campaigns', icon: Megaphone },
  { href: '/crm', label: 'CRM & Leads', icon: Users },
  { href: '/automations', label: 'Automations', icon: Zap },
  { href: '/agent-builder', label: 'Agent Builder', icon: Bot },
  { href: '/reports', label: 'Reports', icon: BarChart2 },
]

const adminItems = [
  { href: '/admin/models', label: 'Model Control', icon: Brain },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="glass-sidebar fixed left-0 top-0 h-full w-64 flex flex-col z-30">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-black/[0.06] dark:border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-300/40 dark:shadow-violet-900/40 flex-shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-gray-900 dark:text-white font-bold text-[15px] tracking-tight" style={{ fontFamily: 'var(--font-poppins)' }}>
              AIPlatform
            </p>
            <p className="text-gray-400 dark:text-violet-300/50 text-xs mt-0.5">Business Growth OS</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <p className="text-[11px] font-semibold text-gray-400 dark:text-violet-300/30 uppercase tracking-[0.12em] px-3 mb-2">
          Main menu
        </p>
        <div className="space-y-0.5">
          {navItems.map(item => {
            const Icon = item.icon
            const active =
              pathname === item.href ||
              (item.href !== '/dashboard' && item.href !== '/' && pathname.startsWith(item.href))

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 group cursor-pointer',
                  active
                    ? 'acc-bg text-white shadow-md'
                    : 'text-gray-600 dark:text-violet-200/60 hover:text-gray-900 dark:hover:text-white hover:bg-black/[0.05] dark:hover:bg-white/[0.07]'
                )}
              >
                <Icon className={cn('w-[18px] h-[18px] flex-shrink-0', active ? 'text-white' : 'text-gray-400 dark:text-violet-300/50 group-hover:text-gray-700 dark:group-hover:text-white')} />
                <span className="flex-1">{item.label}</span>
                {active && <ChevronRight className="w-3.5 h-3.5 text-white/60" />}
              </Link>
            )
          })}
        </div>

        <div className="mt-5 pt-4 border-t border-black/[0.05] dark:border-white/[0.05]">
          <p className="text-[11px] font-semibold text-gray-400 dark:text-violet-300/30 uppercase tracking-[0.12em] px-3 mb-2">
            Admin
          </p>
          <div className="space-y-0.5">
            {adminItems.map(item => {
              const Icon = item.icon
              const active = pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 group cursor-pointer',
                    active
                      ? 'bg-violet-600 text-white shadow-md shadow-violet-300/30'
                      : 'text-gray-600 dark:text-violet-200/60 hover:text-gray-900 dark:hover:text-white hover:bg-black/[0.05] dark:hover:bg-white/[0.07]'
                  )}
                >
                  <Icon className={cn('w-[18px] h-[18px] flex-shrink-0', active ? 'text-white' : 'text-gray-400 dark:text-violet-300/50')} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Bottom: theme toggle + user */}
      <div className="px-3 pb-3 border-t border-black/[0.05] dark:border-white/[0.05] pt-3 space-y-1">
        <ThemeToggle />
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-pink-500 flex items-center justify-center flex-shrink-0 shadow-sm">
            <span className="text-white text-xs font-bold">U</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-gray-900 dark:text-white text-[13px] font-semibold truncate">User Name</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <p className="text-gray-400 dark:text-violet-300/50 text-[11px]">Pro Plan</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
