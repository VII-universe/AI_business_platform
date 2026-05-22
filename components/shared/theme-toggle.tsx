'use client'

import { useState, useEffect } from 'react'
import { Sun, Moon } from 'lucide-react'

export function applyTheme(dark: boolean) {
  if (dark) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
  try { localStorage.setItem('theme', dark ? 'dark' : 'light') } catch {}
}

export function ThemeToggle() {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'))
  }, [])

  function toggle() {
    const next = !dark
    setDark(next)
    applyTheme(next)
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle dark mode"
      className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-150 text-violet-200/60 hover:text-white hover:bg-white/[0.07] cursor-pointer"
    >
      {dark ? (
        <>
          <Sun className="w-[18px] h-[18px] flex-shrink-0 text-amber-300/70" />
          <span>Light Mode</span>
        </>
      ) : (
        <>
          <Moon className="w-[18px] h-[18px] flex-shrink-0 text-violet-300/50" />
          <span>Dark Mode</span>
        </>
      )}
    </button>
  )
}
