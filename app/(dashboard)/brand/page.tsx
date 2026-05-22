'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Palette, Sparkles, Download, RefreshCw, Check, Wand2,
  Type, ImageIcon, Eye, Monitor, Smartphone, Copy,
} from 'lucide-react'

/* ─── Data ─────────────────────────────────────────────────────── */

const PALETTES = [
  {
    id: 'bold', name: 'Bold & Modern', tag: '⭐ Our Pick',
    desc: 'High-impact, confident — perfect for SaaS and tech brands',
    gradient: 'from-violet-600 to-blue-600',
    colors: { primary: '#7C3AED', secondary: '#2563EB', accent: '#F59E0B', bg: '#06061A', surface: '#0F0F2E', text: '#F8FAFC' },
  },
  {
    id: 'trust', name: 'Trust & Growth', tag: 'Popular',
    desc: 'Professional and approachable — ideal for B2B and finance',
    gradient: 'from-blue-600 to-emerald-500',
    colors: { primary: '#1D4ED8', secondary: '#059669', accent: '#F59E0B', bg: '#0F172A', surface: '#1E293B', text: '#F1F5F9' },
  },
  {
    id: 'minimal', name: 'Clean & Minimal', tag: 'Trending',
    desc: 'Sophisticated restraint — perfect for premium and luxury brands',
    gradient: 'from-zinc-800 to-rose-500',
    colors: { primary: '#18181B', secondary: '#52525B', accent: '#E11D48', bg: '#FAFAFA', surface: '#FFFFFF', text: '#09090B' },
  },
  {
    id: 'energy', name: 'Energetic & Bold', tag: 'Creative',
    desc: 'Vibrant and memorable — lifestyle and consumer brands',
    gradient: 'from-orange-500 to-teal-500',
    colors: { primary: '#EA580C', secondary: '#0D9488', accent: '#7C3AED', bg: '#0C0A09', surface: '#1C1917', text: '#FAFAF9' },
  },
  {
    id: 'nature', name: 'Natural & Fresh', tag: 'Wellness',
    desc: 'Organic warmth — health, food and sustainability brands',
    gradient: 'from-green-600 to-amber-500',
    colors: { primary: '#15803D', secondary: '#CA8A04', accent: '#0891B2', bg: '#FFFBEB', surface: '#FFFFFF', text: '#1C1917' },
  },
  {
    id: 'custom', name: 'Custom Palette', tag: '',
    desc: 'Build your own unique color system from scratch',
    gradient: 'from-fuchsia-500 to-cyan-500',
    colors: { primary: '#6366F1', secondary: '#EC4899', accent: '#14B8A6', bg: '#0F0F0F', surface: '#1F1F1F', text: '#FFFFFF' },
  },
]

const FONTS = [
  {
    id: 'modern', name: 'Modern Pro', tag: '⭐ Our Pick',
    heading: 'Poppins', body: 'Inter',
    headingStack: 'var(--font-poppins), sans-serif', bodyStack: 'var(--font-inter), sans-serif',
    desc: 'Geometric clarity — top choice for SaaS & tech',
    sample: 'Innovation starts here',
  },
  {
    id: 'elegant', name: 'Elegant Classic', tag: 'Luxury',
    heading: 'Playfair Display', body: 'Lato',
    headingStack: 'Georgia, serif', bodyStack: 'Arial, sans-serif',
    desc: 'Timeless serif with clean body — premium feel',
    sample: 'Excellence in every detail',
  },
  {
    id: 'tech', name: 'Tech Forward', tag: 'Developer',
    heading: 'Space Grotesk', body: 'IBM Plex Sans',
    headingStack: 'Trebuchet MS, sans-serif', bodyStack: 'Verdana, sans-serif',
    desc: 'Geometric and precise — AI and developer tools',
    sample: 'Build the future, faster',
  },
  {
    id: 'friendly', name: 'Friendly & Warm', tag: 'Consumer',
    heading: 'Nunito', body: 'Open Sans',
    headingStack: 'Tahoma, sans-serif', bodyStack: 'Arial, sans-serif',
    desc: 'Rounded warmth — community and wellness brands',
    sample: 'People first, always',
  },
  {
    id: 'creative', name: 'Creative Bold', tag: 'Agency',
    heading: 'Raleway', body: 'Source Sans Pro',
    headingStack: 'Century Gothic, sans-serif', bodyStack: 'Gill Sans, sans-serif',
    desc: 'Wide spacing, strong presence — agencies',
    sample: 'Stories worth telling',
  },
]

const LOGO_STYLES = [
  { id: 'combo',    name: 'Combination', tag: '⭐ Best', shape: 'rounded', desc: 'Icon + wordmark' },
  { id: 'icon',     name: 'Icon Mark',   tag: 'Apps',   shape: 'circle',  desc: 'Symbol only' },
  { id: 'wordmark', name: 'Wordmark',    tag: 'Print',  shape: 'wide',    desc: 'Text only' },
  { id: 'letter',   name: 'Lettermark', tag: 'Compact', shape: 'square', desc: 'Monogram' },
]

const LOGO_COLORS = [
  { id: 'gradient', name: 'Gradient', from: '#7C3AED', to: '#2563EB' },
  { id: 'primary',  name: 'Solid',   from: '#7C3AED', to: '#7C3AED' },
  { id: 'dark',     name: 'Dark',    from: '#18181B', to: '#18181B' },
  { id: 'white',    name: 'White',   from: '#ffffff', to: '#ffffff' },
]

/* ─── Helpers ─────────────────────────────────────────────────── */

function LogoMark({ shape, colors, size = 40, name = '' }: {
  shape: string; colors: { from: string; to: string }; size?: number; name?: string
}) {
  const r = shape === 'circle' ? '50%' : shape === 'wide' ? '10px' : shape === 'square' ? '6px' : '14px'
  const w = shape === 'wide' ? size * 3 : size
  const isWhite = colors.from === '#ffffff'
  return (
    <div style={{
      width: w, height: size, borderRadius: r,
      background: `linear-gradient(135deg, ${colors.from}, ${colors.to})`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0, border: isWhite ? '1px solid rgba(0,0,0,0.12)' : 'none',
      boxShadow: isWhite ? 'none' : `0 4px 16px ${colors.from}44`,
    }}>
      <span style={{
        color: isWhite ? '#333' : 'white', fontWeight: 800,
        fontSize: shape === 'wide' ? size * 0.32 : size * 0.38,
        letterSpacing: shape === 'wide' ? '0.08em' : 0,
        fontFamily: 'var(--font-poppins), sans-serif',
      }}>
        {shape === 'wide' ? (name || 'BRAND').toUpperCase() : shape === 'letter' ? (name || 'AB').slice(0, 2).toUpperCase() : '✦'}
      </span>
    </div>
  )
}

/* ─── Brand Preview Panel ─────────────────────────────────────── */

function LivePreview({ palette, font, logo, logoColor, companyName, previewMode }: {
  palette: typeof PALETTES[0]; font: typeof FONTS[0]
  logo: typeof LOGO_STYLES[0]; logoColor: typeof LOGO_COLORS[0]
  companyName: string; previewMode: 'desktop' | 'mobile'
}) {
  const c = palette.colors
  const isDark = c.bg.startsWith('#0') || c.bg.startsWith('#1') || c.bg === '#0C0A09'

  return (
    <div className="space-y-4">
      {/* Website mockup */}
      <div className={`rounded-2xl overflow-hidden border ${isDark ? 'border-white/10' : 'border-black/10'} shadow-xl`}
        style={{ background: c.bg }}>
        {/* Browser bar */}
        <div className="flex items-center gap-1.5 px-3 py-2.5 border-b" style={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)', background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }}>
          <div className="flex gap-1.5">
            {['#FF5F57','#FEBC2E','#28C840'].map(col => <div key={col} className="w-2.5 h-2.5 rounded-full" style={{ background: col }} />)}
          </div>
          <div className="flex-1 mx-3 h-4 rounded-md flex items-center px-2" style={{ background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }}>
            <span style={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.35)', fontSize: 8, fontFamily: font.bodyStack }}>
              {companyName.toLowerCase().replace(/\s/g, '')}.com
            </span>
          </div>
        </div>
        {/* Nav */}
        <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
          <div className="flex items-center gap-2">
            <LogoMark shape={logo.shape} colors={logoColor} size={20} name={companyName} />
            {logo.shape !== 'wide' && (
              <span style={{ color: c.text, fontFamily: font.headingStack, fontWeight: 700, fontSize: 11 }}>{companyName}</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {['Product','Pricing','About'].map(item => (
              <span key={item} style={{ color: `${c.text}60`, fontFamily: font.bodyStack, fontSize: 9 }}>{item}</span>
            ))}
            <div className="px-3 py-1 rounded-lg" style={{ background: c.primary, color: 'white', fontSize: 9, fontFamily: font.bodyStack, fontWeight: 600 }}>
              Get Started
            </div>
          </div>
        </div>
        {/* Hero */}
        <div className="px-5 py-7 text-center">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full mb-4" style={{ background: `${c.primary}18`, border: `1px solid ${c.primary}30` }}>
            <span style={{ color: c.primary, fontSize: 8, fontWeight: 700 }}>✦ AI-Powered Marketing Platform</span>
          </div>
          <h2 style={{ color: c.text, fontFamily: font.headingStack, fontWeight: 800, fontSize: 20, lineHeight: 1.2, marginBottom: 10 }}>
            Grow Your Business<br />
            <span style={{ color: c.primary }}>with Artificial Intelligence</span>
          </h2>
          <p style={{ color: `${c.text}70`, fontFamily: font.bodyStack, fontSize: 10, marginBottom: 16, lineHeight: 1.6, maxWidth: 260, margin: '0 auto 16px' }}>
            The all-in-one platform for modern marketing teams. Generate content, manage campaigns, and close more deals.
          </p>
          <div className="flex gap-2.5 justify-center">
            <div className="px-4 py-2 rounded-xl text-white text-[10px] font-bold shadow-lg" style={{ background: c.primary, boxShadow: `0 4px 16px ${c.primary}44` }}>
              Start Free Trial
            </div>
            <div className="px-4 py-2 rounded-xl text-[10px] font-semibold" style={{ border: `1.5px solid ${c.primary}40`, color: c.text }}>
              Watch Demo →
            </div>
          </div>
          {/* Stats */}
          <div className="flex justify-center gap-5 mt-6 pt-5" style={{ borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
            {[['500+','Customers'],['3×','Avg ROI'],['40%','Time saved']].map(([val, label]) => (
              <div key={label} className="text-center">
                <p style={{ color: c.primary, fontFamily: font.headingStack, fontWeight: 800, fontSize: 13 }}>{val}</p>
                <p style={{ color: `${c.text}50`, fontFamily: font.bodyStack, fontSize: 8 }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Business card + Social post side by side */}
      <div className="grid grid-cols-2 gap-3">
        {/* Business card */}
        <div>
          <p className="text-[11px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-2">Business Card</p>
          <div className="rounded-xl overflow-hidden shadow-lg" style={{ background: `linear-gradient(135deg, ${c.surface}, ${c.bg})`, border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`, padding: 12 }}>
            <LogoMark shape={logo.shape} colors={logoColor} size={22} name={companyName} />
            <div style={{ marginTop: 10 }}>
              <p style={{ color: c.text, fontFamily: font.headingStack, fontWeight: 700, fontSize: 11 }}>Jana Novák</p>
              <p style={{ color: c.secondary, fontFamily: font.bodyStack, fontSize: 9, marginTop: 1 }}>Head of Marketing</p>
            </div>
            <div style={{ marginTop: 8 }}>
              <p style={{ color: `${c.text}55`, fontFamily: font.bodyStack, fontSize: 8 }}>jana@{companyName.toLowerCase().replace(/\s/g,'')}.com</p>
              <div style={{ width: 24, height: 2, background: c.primary, borderRadius: 4, marginTop: 8 }} />
            </div>
          </div>
        </div>

        {/* Social post */}
        <div>
          <p className="text-[11px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-2">Social Post</p>
          <div className="aspect-square rounded-xl overflow-hidden shadow-lg relative"
            style={{ background: `linear-gradient(145deg, ${c.primary}22, ${c.secondary}15)`, border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}` }}>
            <div className="absolute inset-0 p-3 flex flex-col justify-between">
              <LogoMark shape={logo.shape} colors={logoColor} size={18} name={companyName} />
              <div>
                <p style={{ color: c.accent || c.primary, fontFamily: font.headingStack, fontSize: 7, fontWeight: 700, marginBottom: 3 }}>GROWTH TIP</p>
                <p style={{ color: c.text, fontFamily: font.headingStack, fontWeight: 800, fontSize: 10, lineHeight: 1.3, marginBottom: 5 }}>
                  AI cuts marketing costs by 40% 📊
                </p>
                <div style={{ width: 16, height: 1.5, background: c.primary, borderRadius: 4, marginBottom: 4 }} />
                <p style={{ color: `${c.text}60`, fontFamily: font.bodyStack, fontSize: 7 }}>@{companyName.toLowerCase().replace(/\s/g,'')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Color chips */}
      <div>
        <p className="text-[11px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-2">Color System</p>
        <div className="flex gap-1.5">
          {Object.entries(c).map(([role, hex]) => (
            <div key={role} className="flex-1 group cursor-pointer" onClick={() => navigator.clipboard.writeText(hex)}>
              <div className="h-8 rounded-lg mb-1 border border-black/10 dark:border-white/10 transition-transform group-hover:scale-y-110 origin-bottom" style={{ background: hex }} />
              <p className="text-[9px] text-gray-400 dark:text-slate-500 text-center font-mono leading-none">{hex}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── Main page ──────────────────────────────────────────────── */

export default function BrandPage() {
  const [section, setSection] = useState<'colors' | 'logos' | 'fonts'>('colors')
  const [palette, setPalette] = useState(PALETTES[0])
  const [font, setFont] = useState(FONTS[0])
  const [logo, setLogo] = useState(LOGO_STYLES[0])
  const [logoColor, setLogoColor] = useState(LOGO_COLORS[0])
  const [companyName, setCompanyName] = useState('AIPlatform')
  const [customColors, setCustomColors] = useState<Record<string, string>>({})
  const [generating, setGenerating] = useState(false)
  const [previewMode] = useState<'desktop' | 'mobile'>('desktop')
  const [saved, setSaved] = useState(false)

  function getColor(role: string) {
    return customColors[role] || palette.colors[role as keyof typeof palette.colors] || '#000'
  }

  async function handleRegenerate() {
    setGenerating(true)
    await new Promise(r => setTimeout(r, 2200))
    const next = PALETTES[Math.floor(Math.random() * PALETTES.length)]
    setPalette(next)
    setGenerating(false)
  }

  async function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const effectivePalette = {
    ...palette,
    colors: {
      ...palette.colors,
      ...Object.fromEntries(Object.entries(customColors).filter(([, v]) => v)),
    },
  }

  const sections = [
    { id: 'colors' as const, label: 'Color Palette', icon: Palette },
    { id: 'logos'  as const, label: 'Logo Style',    icon: ImageIcon },
    { id: 'fonts'  as const, label: 'Typography',    icon: Type },
  ]

  return (
    <div className="p-8 max-w-[1500px]">

      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-start gap-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-fuchsia-500 via-violet-600 to-indigo-600 flex items-center justify-center shadow-xl shadow-fuchsia-400/25 dark:shadow-fuchsia-900/30 flex-shrink-0">
            <Palette className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Brand Studio</h1>
            <p className="text-gray-500 dark:text-slate-400 text-lg mt-1">Build your complete visual identity with live preview</p>
            {/* Active selections chip row */}
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border border-black/[0.08] dark:border-white/[0.08] bg-white/60 dark:bg-white/[0.05] text-gray-600 dark:text-slate-300">
                <div className="w-3 h-3 rounded-full" style={{ background: `linear-gradient(135deg, ${palette.colors.primary}, ${palette.colors.secondary})` }} />
                {palette.name}
              </span>
              <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border border-black/[0.08] dark:border-white/[0.08] bg-white/60 dark:bg-white/[0.05] text-gray-600 dark:text-slate-300">
                <Type className="w-3 h-3" />{font.heading} + {font.body}
              </span>
              <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border border-black/[0.08] dark:border-white/[0.08] bg-white/60 dark:bg-white/[0.05] text-gray-600 dark:text-slate-300">
                <ImageIcon className="w-3 h-3" />{logo.name}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleRegenerate} disabled={generating}
            className="border-black/10 dark:border-white/10 text-gray-600 dark:text-slate-300 bg-white/60 dark:bg-white/[0.05] h-11 px-5 text-sm">
            <Wand2 className={`w-4 h-4 mr-2 ${generating ? 'animate-spin' : ''}`} />
            {generating ? 'Generating…' : 'AI Suggest'}
          </Button>
          <Button onClick={handleSave} className="h-11 px-5 text-sm bg-violet-600 text-white">
            {saved ? <><Check className="w-4 h-4 mr-2" /> Saved!</> : <><Download className="w-4 h-4 mr-2" /> Export Brand Kit</>}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-6 items-start">

        {/* ── Left panel ─────────────────────────────────────────── */}
        <div className="space-y-5">

          {/* Section nav */}
          <div className="glass p-1.5 inline-flex gap-1 rounded-2xl">
            {sections.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setSection(id)}
                className={`flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${section === id ? 'bg-violet-600 text-white shadow-md' : 'text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.06]'}`}>
                <Icon className="w-4 h-4" />{label}
              </button>
            ))}
          </div>

          {/* ── COLORS ─────────────────────────────────────────────── */}
          {section === 'colors' && (
            <div className="space-y-5">
              {/* Palette grid */}
              <div className="glass p-7">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Color Palettes</h2>
                    <p className="text-gray-400 dark:text-slate-500 text-sm mt-1">Curated by our design team — pick one or customise</p>
                  </div>
                  <Badge className="bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-700/40">
                    {PALETTES.length} palettes
                  </Badge>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  {PALETTES.map(p => {
                    const active = palette.id === p.id
                    return (
                      <button key={p.id} onClick={() => setPalette(p)}
                        className={`relative flex flex-col gap-0 rounded-2xl overflow-hidden border-2 cursor-pointer transition-all duration-200 hover:scale-[1.02] text-left ${active ? 'border-violet-500 shadow-xl shadow-violet-500/15' : 'border-black/[0.07] dark:border-white/[0.07] hover:border-violet-300 dark:hover:border-violet-700'}`}>
                        {/* Gradient header */}
                        <div className={`h-24 bg-gradient-to-br ${p.gradient} relative`}>
                          <div className="absolute inset-0 flex items-center justify-center opacity-30">
                            <Sparkles className="w-10 h-10 text-white" />
                          </div>
                          {/* Color dots */}
                          <div className="absolute bottom-3 left-3 flex gap-1.5">
                            {Object.values(p.colors).slice(0, 4).map((hex, i) => (
                              <div key={i} className="w-6 h-6 rounded-full border-2 border-white/30 shadow-sm" style={{ background: hex }} />
                            ))}
                          </div>
                          {active && (
                            <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-md">
                              <Check className="w-3.5 h-3.5 text-violet-600" />
                            </div>
                          )}
                          {p.tag && (
                            <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/20 backdrop-blur-sm text-white">
                              {p.tag}
                            </div>
                          )}
                        </div>
                        {/* Info */}
                        <div className="p-4 bg-white/60 dark:bg-black/20 flex-1">
                          <p className="text-gray-900 dark:text-white font-bold text-sm mb-0.5">{p.name}</p>
                          <p className="text-gray-400 dark:text-slate-500 text-xs leading-relaxed">{p.desc}</p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Color editor */}
              <div className="glass p-7">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Fine-tune Colors</h3>
                <p className="text-gray-400 dark:text-slate-500 text-sm mb-6">Click any swatch to customise — changes reflect instantly in the preview</p>
                <div className="grid grid-cols-6 gap-4">
                  {Object.entries(palette.colors).map(([role, defaultHex]) => {
                    const hex = customColors[role] || defaultHex
                    return (
                      <div key={role} className="group">
                        <div className="relative mb-2.5">
                          <div className="w-full h-14 rounded-2xl border border-black/10 dark:border-white/10 shadow-sm transition-transform group-hover:scale-105 cursor-pointer"
                            style={{ background: hex }} />
                          <input type="color" value={hex}
                            onChange={e => setCustomColors(p => ({ ...p, [role]: e.target.value }))}
                            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" />
                          <div className="absolute bottom-1.5 right-1.5 w-5 h-5 rounded-lg bg-white/80 dark:bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                            <Palette className="w-2.5 h-2.5 text-gray-600 dark:text-white" />
                          </div>
                        </div>
                        <p className="text-gray-700 dark:text-slate-200 text-xs font-bold capitalize text-center">{role}</p>
                        <p className="text-gray-400 dark:text-slate-500 text-[10px] font-mono text-center mt-0.5">{hex}</p>
                      </div>
                    )
                  })}
                </div>
                {Object.keys(customColors).length > 0 && (
                  <button onClick={() => setCustomColors({})}
                    className="mt-5 text-xs text-gray-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 transition-colors cursor-pointer underline underline-offset-2">
                    Reset to palette defaults
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ── LOGOS ─────────────────────────────────────────────── */}
          {section === 'logos' && (
            <div className="space-y-5">
              <div className="glass p-7">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Logo Style</h2>
                    <p className="text-gray-400 dark:text-slate-500 text-sm mt-1">Choose style, colour variant and company name</p>
                  </div>
                  <Button size="sm" className="bg-violet-600 text-white h-9 px-4 text-sm">
                    <Wand2 className="w-4 h-4 mr-2" /> Generate New
                  </Button>
                </div>

                {/* Company name */}
                <div className="mb-7">
                  <label className="text-gray-700 dark:text-slate-200 text-sm font-semibold block mb-2">Brand / Company Name</label>
                  <input value={companyName} onChange={e => setCompanyName(e.target.value)} maxLength={20}
                    className="w-full max-w-sm px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/[0.05] text-gray-900 dark:text-white text-base font-semibold focus:outline-none focus:border-violet-400 backdrop-blur-sm" />
                </div>

                {/* Logo types */}
                <div className="grid grid-cols-2 gap-4 mb-7">
                  {LOGO_STYLES.map(style => {
                    const active = logo.id === style.id
                    return (
                      <button key={style.id} onClick={() => setLogo(style)}
                        className={`relative flex flex-col gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 hover:scale-[1.01] ${active ? 'border-violet-500 shadow-xl shadow-violet-500/10 bg-violet-50/50 dark:bg-violet-900/10' : 'border-black/[0.07] dark:border-white/[0.07] hover:border-violet-300 dark:hover:border-violet-700'}`}>
                        {active && <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-violet-600 flex items-center justify-center shadow-md"><Check className="w-3.5 h-3.5 text-white" /></div>}
                        <div className="flex items-center gap-3">
                          <LogoMark shape={style.shape} colors={logoColor} size={44} name={companyName} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className={`font-bold text-sm ${active ? 'text-violet-700 dark:text-violet-300' : 'text-gray-900 dark:text-white'}`}>{style.name}</p>
                            <Badge className="text-[10px] bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700/30">{style.tag}</Badge>
                          </div>
                          <p className="text-gray-400 dark:text-slate-500 text-xs">{style.desc}</p>
                        </div>
                      </button>
                    )
                  })}
                </div>

                {/* Logo colour */}
                <div>
                  <p className="text-gray-700 dark:text-slate-200 text-sm font-bold mb-3">Logo Colour</p>
                  <div className="flex gap-4">
                    {LOGO_COLORS.map(lc => (
                      <button key={lc.id} onClick={() => setLogoColor(lc)}
                        className={`flex flex-col items-center gap-2 cursor-pointer`}>
                        <div className={`w-14 h-14 rounded-2xl transition-all duration-200 ${logoColor.id === lc.id ? 'scale-110 shadow-lg ring-2 ring-violet-500 ring-offset-2 dark:ring-offset-transparent' : 'hover:scale-105'}`}
                          style={{ background: `linear-gradient(135deg, ${lc.from}, ${lc.to})`, border: lc.id === 'white' ? '1.5px solid rgba(0,0,0,0.12)' : 'none' }} />
                        <span className={`text-xs font-semibold ${logoColor.id === lc.id ? 'text-violet-600 dark:text-violet-400' : 'text-gray-500 dark:text-slate-400'}`}>{lc.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Logo on backgrounds */}
              <div className="glass p-7">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-5">Logo Versatility Check</h3>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { bg: '#ffffff', label: 'White', border: true },
                    { bg: '#f8fafc', label: 'Light Gray', border: true },
                    { bg: palette.colors.primary, label: 'Primary' },
                    { bg: palette.colors.bg, label: 'Dark' },
                  ].map(({ bg, label, border }) => (
                    <div key={label}>
                      <div className="flex items-center justify-center aspect-video rounded-2xl shadow-sm mb-2"
                        style={{ background: bg, border: border ? '1px solid rgba(0,0,0,0.08)' : 'none' }}>
                        <LogoMark shape={logo.shape} colors={logoColor} size={32} name={companyName} />
                      </div>
                      <p className="text-xs text-gray-400 dark:text-slate-500 font-medium text-center">{label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── FONTS ─────────────────────────────────────────────── */}
          {section === 'fonts' && (
            <div className="space-y-5">
              <div className="glass p-7">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Typography</h2>
                    <p className="text-gray-400 dark:text-slate-500 text-sm mt-1">Expert-curated font pairings for every brand personality</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {FONTS.map(f => {
                    const active = font.id === f.id
                    return (
                      <button key={f.id} onClick={() => setFont(f)}
                        className={`w-full flex items-stretch gap-0 rounded-2xl border-2 cursor-pointer transition-all duration-200 overflow-hidden text-left ${active ? 'border-violet-500 shadow-xl shadow-violet-500/10' : 'border-black/[0.07] dark:border-white/[0.07] hover:border-violet-300 dark:hover:border-violet-700'}`}>
                        {/* Left: sample text */}
                        <div className="flex-1 p-5">
                          <div className="flex items-center gap-3 mb-3">
                            <p className="font-bold text-gray-900 dark:text-white" style={{ fontFamily: f.headingStack, fontWeight: 700, fontSize: 17 }}>
                              {f.sample}
                            </p>
                            {active && <div className="w-6 h-6 rounded-full bg-violet-600 flex items-center justify-center flex-shrink-0 shadow-md"><Check className="w-3.5 h-3.5 text-white" /></div>}
                          </div>
                          <p className="text-gray-500 dark:text-slate-400 text-sm leading-relaxed mb-3" style={{ fontFamily: f.bodyStack }}>
                            The quick brown fox jumps over the lazy dog. Building great brands starts with great typography.
                          </p>
                          <div className="flex items-center gap-3">
                            <Badge className={`text-[10px] ${active ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-700/40' : 'bg-gray-100 dark:bg-white/[0.07] text-gray-500 dark:text-slate-400'}`}>
                              {f.tag || 'Classic'}
                            </Badge>
                            <span className="text-xs text-gray-400 dark:text-slate-500">{f.desc}</span>
                          </div>
                        </div>
                        {/* Right: font names */}
                        <div className="w-36 flex-shrink-0 p-5 border-l border-black/[0.06] dark:border-white/[0.06] flex flex-col justify-center gap-3">
                          <div>
                            <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-1">Heading</p>
                            <p className="text-gray-900 dark:text-white text-sm font-bold">{f.heading}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-1">Body</p>
                            <p className="text-gray-900 dark:text-white text-sm font-semibold">{f.body}</p>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Type scale */}
              <div className="glass p-7">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{font.name} — Type Scale</h3>
                <p className="text-gray-400 dark:text-slate-500 text-sm mb-6">How text looks at every size in your brand</p>
                <div className="space-y-5">
                  {[
                    { role: 'Display', size: 36, weight: '800', stack: font.headingStack, text: 'Grow with AI' },
                    { role: 'Heading 1', size: 28, weight: '700', stack: font.headingStack, text: 'AI-Powered Marketing' },
                    { role: 'Heading 2', size: 22, weight: '700', stack: font.headingStack, text: 'Automate your campaigns' },
                    { role: 'Heading 3', size: 17, weight: '600', stack: font.headingStack, text: 'Generate content in seconds' },
                    { role: 'Body Large', size: 16, weight: '400', stack: font.bodyStack, text: 'The platform that helps modern marketing teams move faster, generate better content, and close more deals.' },
                    { role: 'Body', size: 14, weight: '400', stack: font.bodyStack, text: 'The quick brown fox jumps over the lazy dog. Sphinx of black quartz, judge my vow.' },
                    { role: 'Caption', size: 12, weight: '400', stack: font.bodyStack, text: 'Supporting text, labels, metadata, timestamps and fine print' },
                  ].map(({ role, size, weight, stack, text }) => (
                    <div key={role} className="flex items-start gap-5 py-4 border-b border-black/[0.05] dark:border-white/[0.05] last:border-0">
                      <div className="w-20 flex-shrink-0 pt-1">
                        <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest leading-tight">{role}</p>
                        <p className="text-[10px] text-gray-300 dark:text-slate-600 mt-0.5">{size}px</p>
                      </div>
                      <p className="text-gray-900 dark:text-white leading-snug" style={{ fontFamily: stack, fontSize: size, fontWeight: weight, lineHeight: 1.25 }}>
                        {text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Right: Live Preview ────────────────────────────────── */}
        <div className="sticky top-8">
          <div className="glass p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="text-base font-bold text-gray-900 dark:text-white">Live Preview</h3>
              </div>
              <div className="flex gap-1">
                <button className="w-7 h-7 rounded-lg border border-black/10 dark:border-white/10 flex items-center justify-center text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/20 cursor-pointer">
                  <Monitor className="w-3.5 h-3.5" />
                </button>
                <button className="w-7 h-7 rounded-lg border border-black/10 dark:border-white/10 flex items-center justify-center text-gray-400 dark:text-slate-500 hover:text-gray-700 dark:hover:text-white cursor-pointer">
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <LivePreview
              palette={effectivePalette}
              font={font}
              logo={logo}
              logoColor={logoColor}
              companyName={companyName}
              previewMode={previewMode}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
