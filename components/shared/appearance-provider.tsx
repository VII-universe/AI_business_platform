'use client'

import { useEffect, useState, createContext, useContext } from 'react'

export type AccentColor = 'violet' | 'blue' | 'emerald' | 'rose' | 'amber' | 'indigo' | 'cyan' | 'pink'
export type FontSize = 'compact' | 'default' | 'large'
export type BgStyle = 'glass' | 'minimal' | 'mesh'
export type Density = 'compact' | 'default' | 'spacious'
export type RadiusStyle = 'sharp' | 'default' | 'pill'

export type AppearanceSettings = {
  accent: AccentColor
  fontSize: FontSize
  background: BgStyle
  density: Density
  radius: RadiusStyle
}

export const DEFAULTS: AppearanceSettings = {
  accent: 'violet',
  fontSize: 'default',
  background: 'glass',
  density: 'default',
  radius: 'default',
}

export const ACCENT_MAP: Record<AccentColor, { acc: string; accH: string; glow: string; light: string }> = {
  violet:  { acc: '#7C3AED', accH: '#6D28D9', glow: 'rgba(124,58,237,0.28)',  light: 'rgba(124,58,237,0.12)' },
  blue:    { acc: '#2563EB', accH: '#1D4ED8', glow: 'rgba(37,99,235,0.28)',   light: 'rgba(37,99,235,0.12)' },
  emerald: { acc: '#059669', accH: '#047857', glow: 'rgba(5,150,105,0.28)',   light: 'rgba(5,150,105,0.12)' },
  rose:    { acc: '#E11D48', accH: '#BE123C', glow: 'rgba(225,29,72,0.28)',   light: 'rgba(225,29,72,0.12)' },
  amber:   { acc: '#D97706', accH: '#B45309', glow: 'rgba(217,119,6,0.28)',   light: 'rgba(217,119,6,0.12)' },
  indigo:  { acc: '#4338CA', accH: '#3730A3', glow: 'rgba(67,56,202,0.28)',   light: 'rgba(67,56,202,0.12)' },
  cyan:    { acc: '#0891B2', accH: '#0E7490', glow: 'rgba(8,145,178,0.28)',   light: 'rgba(8,145,178,0.12)' },
  pink:    { acc: '#DB2777', accH: '#BE185D', glow: 'rgba(219,39,119,0.28)',  light: 'rgba(219,39,119,0.12)' },
}

const FONT_MAP: Record<FontSize, string> = {
  compact: '14px', default: '16px', large: '18px',
}

/** Apply all settings directly to the DOM — no React state, instant effect */
export function applySettings(s: AppearanceSettings) {
  if (typeof document === 'undefined') return
  const h = document.documentElement
  const c = ACCENT_MAP[s.accent] ?? ACCENT_MAP.violet
  h.style.setProperty('--acc', c.acc)
  h.style.setProperty('--acc-h', c.accH)
  h.style.setProperty('--acc-glow', c.glow)
  h.style.setProperty('--acc-light', c.light)
  h.style.setProperty('--base-font', FONT_MAP[s.fontSize] ?? '16px')
  h.setAttribute('data-bg', s.background)
  h.setAttribute('data-radius', s.radius)
  h.setAttribute('data-density', s.density)
  try { localStorage.setItem('appearance', JSON.stringify(s)) } catch {}
}

export function loadSettings(): AppearanceSettings {
  try {
    const raw = localStorage.getItem('appearance')
    if (raw) return { ...DEFAULTS, ...JSON.parse(raw) }
  } catch {}
  return DEFAULTS
}

// --- Context (only used so Sidebar/other components can read current accent) ---
const AppearanceContext = createContext<{
  settings: AppearanceSettings
  set: (next: AppearanceSettings) => void
}>({ settings: DEFAULTS, set: () => {} })

export function useAppearance() {
  return useContext(AppearanceContext)
}

export function AppearanceProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppearanceSettings>(DEFAULTS)

  useEffect(() => {
    const s = loadSettings()
    setSettings(s)
    applySettings(s)
  }, [])

  return (
    <AppearanceContext.Provider value={{ settings, set: (next) => { setSettings(next); applySettings(next) } }}>
      {children}
    </AppearanceContext.Provider>
  )
}
