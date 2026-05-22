'use client'

import { useState, useMemo, useCallback, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Palette, Sparkles, Download, Check, Wand2, Type, ImageIcon,
  Monitor, Tablet, Smartphone, Sun, Moon, Lock, Unlock,
  Copy, X, ChevronDown, AlertTriangle, CheckCircle2, FileJson,
  Code2, Package, Zap, RefreshCw,
} from 'lucide-react'

/* ═══════════════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════════════ */

const PALETTES = [
  {
    id: 'bold', name: 'Bold & Modern', tag: '⭐ Our Pick',
    desc: 'High-impact, confident — perfect for SaaS and tech brands',
    gradient: 'from-violet-600 to-blue-600',
    colors: { primary: '#7C3AED', secondary: '#2563EB', accent: '#F59E0B', bg: '#06061A', surface: '#0F0F2E', text: '#F8FAFC' },
    vibe: ['saas', 'tech', 'ai', 'modern', 'bold'],
    rationale: 'Deep violet primary signals innovation and intelligence. Blue secondary builds trust. The dark background creates premium depth — ideal for high-tech SaaS products.',
  },
  {
    id: 'trust', name: 'Trust & Growth', tag: 'Popular',
    desc: 'Professional and approachable — ideal for B2B and finance',
    gradient: 'from-blue-600 to-emerald-500',
    colors: { primary: '#1D4ED8', secondary: '#059669', accent: '#F59E0B', bg: '#0F172A', surface: '#1E293B', text: '#F1F5F9' },
    vibe: ['b2b', 'finance', 'professional', 'corporate', 'enterprise'],
    rationale: 'Corporate blue anchors authority and reliability. Emerald green reinforces growth and success. The amber accent draws attention to key CTAs without aggression.',
  },
  {
    id: 'minimal', name: 'Clean & Minimal', tag: 'Trending',
    desc: 'Sophisticated restraint — perfect for premium and luxury brands',
    gradient: 'from-zinc-800 to-rose-500',
    colors: { primary: '#18181B', secondary: '#52525B', accent: '#E11D48', bg: '#FAFAFA', surface: '#FFFFFF', text: '#09090B' },
    vibe: ['minimal', 'luxury', 'premium', 'clean', 'real estate', 'fashion'],
    rationale: 'Near-black on white maximises contrast and conveys precision. The rose accent creates a single, memorable focal point. Used by Apple, Linear, and Stripe.',
  },
  {
    id: 'energy', name: 'Energetic & Bold', tag: 'Creative',
    desc: 'Vibrant and memorable — lifestyle and consumer brands',
    gradient: 'from-orange-500 to-teal-500',
    colors: { primary: '#EA580C', secondary: '#0D9488', accent: '#7C3AED', bg: '#0C0A09', surface: '#1C1917', text: '#FAFAF9' },
    vibe: ['startup', 'consumer', 'lifestyle', 'creative', 'energetic', 'fun'],
    rationale: 'Warm orange creates urgency and energy. Cool teal provides balance and freshness. The complementary tension makes this palette impossible to ignore.',
  },
  {
    id: 'nature', name: 'Natural & Fresh', tag: 'Wellness',
    desc: 'Organic warmth — health, food and sustainability brands',
    gradient: 'from-green-600 to-amber-500',
    colors: { primary: '#15803D', secondary: '#CA8A04', accent: '#0891B2', bg: '#FFFBEB', surface: '#FFFFFF', text: '#1C1917' },
    vibe: ['wellness', 'health', 'food', 'sustainability', 'organic', 'nature'],
    rationale: 'Forest green evokes trust and natural authority. Warm amber adds an artisanal, harvest quality. The cream background feels organic rather than clinical.',
  },
  {
    id: 'custom', name: 'Custom Palette', tag: '',
    desc: 'Build your own unique color system from scratch',
    gradient: 'from-fuchsia-500 to-cyan-500',
    colors: { primary: '#6366F1', secondary: '#EC4899', accent: '#14B8A6', bg: '#0F0F0F', surface: '#1F1F1F', text: '#FFFFFF' },
    vibe: [],
    rationale: 'Your custom palette — crafted to match your unique brand vision.',
  },
]

const FONTS = [
  { id: 'modern', name: 'Modern Pro', tag: '⭐ Our Pick', heading: 'Poppins', body: 'Inter', headingStack: 'var(--font-poppins), sans-serif', bodyStack: 'var(--font-inter), sans-serif', desc: 'Geometric clarity — top SaaS & tech choice', sample: 'Innovation starts here' },
  { id: 'elegant', name: 'Elegant Classic', tag: 'Luxury', heading: 'Playfair Display', body: 'Lato', headingStack: 'Georgia, serif', bodyStack: 'Arial, sans-serif', desc: 'Timeless serif with clean body — premium feel', sample: 'Excellence in every detail' },
  { id: 'tech', name: 'Tech Forward', tag: 'Developer', heading: 'Space Grotesk', body: 'IBM Plex Sans', headingStack: 'Trebuchet MS, sans-serif', bodyStack: 'Verdana, sans-serif', desc: 'Geometric and precise — AI and developer tools', sample: 'Build the future, faster' },
  { id: 'friendly', name: 'Friendly & Warm', tag: 'Consumer', heading: 'Nunito', body: 'Open Sans', headingStack: 'Tahoma, sans-serif', bodyStack: 'Arial, sans-serif', desc: 'Rounded warmth — community and wellness', sample: 'People first, always' },
  { id: 'creative', name: 'Creative Bold', tag: 'Agency', heading: 'Raleway', body: 'Source Sans Pro', headingStack: 'Century Gothic, sans-serif', bodyStack: 'Gill Sans, sans-serif', desc: 'Wide spacing, strong presence — agencies', sample: 'Stories worth telling' },
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

const TYPE_RATIOS = [
  { id: 'minor', name: 'Minor Third', value: 1.2 },
  { id: 'major', name: 'Major Third', value: 1.25 },
  { id: 'fourth', name: 'Perfect Fourth', value: 1.333 },
  { id: 'golden', name: 'Golden Ratio', value: 1.618 },
]

const VIBE_CHIPS = [
  'Minimalist SaaS', 'Premium Real Estate', 'Fun Consumer App',
  'Enterprise B2B', 'Health & Wellness', 'Creative Agency',
]

/* ═══════════════════════════════════════════════════════════════
   WCAG HELPERS
═══════════════════════════════════════════════════════════════ */

function hexToLinear(hex: string): number {
  const v = parseInt(hex.slice(1, 3), 16) / 255 * 0.2126
    + parseInt(hex.slice(3, 5), 16) / 255 * 0.7152
    + parseInt(hex.slice(5, 7), 16) / 255 * 0.0722
  // simplified luminance
  return v
}

function relativeLuminance(hex: string): number {
  try {
    const r = parseInt(hex.slice(1, 3), 16) / 255
    const g = parseInt(hex.slice(3, 5), 16) / 255
    const b = parseInt(hex.slice(5, 7), 16) / 255
    const lin = (c: number) => c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
  } catch { return 0 }
}

function contrastRatio(hex1: string, hex2: string): number {
  const l1 = relativeLuminance(hex1)
  const l2 = relativeLuminance(hex2)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

/* ═══════════════════════════════════════════════════════════════
   TYPE SCALE
═══════════════════════════════════════════════════════════════ */

function buildTypeScale(base: number, ratio: number) {
  const r = (exp: number) => Math.round(base * Math.pow(ratio, exp))
  return [
    { role: 'Display',    exp: 4,  label: 'Display' },
    { role: 'Heading 1',  exp: 3,  label: 'H1' },
    { role: 'Heading 2',  exp: 2,  label: 'H2' },
    { role: 'Heading 3',  exp: 1,  label: 'H3' },
    { role: 'Body Large', exp: 0,  label: 'Body' },
    { role: 'Body',       exp: -1, label: 'Small' },
    { role: 'Caption',    exp: -2, label: 'Caption' },
  ].map(s => ({ ...s, size: r(s.exp) }))
}

/* ═══════════════════════════════════════════════════════════════
   LOGO MARK
═══════════════════════════════════════════════════════════════ */

function LogoMark({ shape, colors, size = 40, name = '' }: {
  shape: string; colors: { from: string; to: string }; size?: number; name?: string
}) {
  const r = shape === 'circle' ? '50%' : shape === 'wide' ? '10px' : shape === 'square' ? '6px' : '14px'
  const w = shape === 'wide' ? size * 3 : size
  const isWhite = colors.from === '#ffffff'
  return (
    <div style={{ width: w, height: size, borderRadius: r, background: `linear-gradient(135deg, ${colors.from}, ${colors.to})`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, border: isWhite ? '1px solid rgba(0,0,0,0.12)' : 'none', boxShadow: isWhite ? 'none' : `0 4px 16px ${colors.from}44` }}>
      <span style={{ color: isWhite ? '#333' : 'white', fontWeight: 800, fontSize: shape === 'wide' ? size * 0.32 : size * 0.38, letterSpacing: shape === 'wide' ? '0.08em' : 0, fontFamily: 'var(--font-poppins), sans-serif' }}>
        {shape === 'wide' ? (name || 'BRAND').toUpperCase() : shape === 'letter' ? (name || 'AB').slice(0, 2).toUpperCase() : '✦'}
      </span>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   WCAG BADGE COMPONENT
═══════════════════════════════════════════════════════════════ */

function WCAGBadge({ bg, text }: { bg: string; text: string }) {
  let ratio = 1
  try { ratio = contrastRatio(bg, text) } catch {}
  const passes = { aaa: ratio >= 7, aa: ratio >= 4.5, aaLarge: ratio >= 3 }
  const level = passes.aaa ? 'AAA' : passes.aa ? 'AA' : passes.aaLarge ? 'AA Large' : 'Fail'
  const color = passes.aa ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-700/30'
              : passes.aaLarge ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700/30'
              : 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700/30'
  const Icon = passes.aa ? CheckCircle2 : AlertTriangle
  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-bold ${color}`}>
      <Icon className="w-3 h-3" />
      <span>{ratio.toFixed(1)}:1</span>
      <span className="opacity-60">·</span>
      <span>{level}</span>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   EXPORT MODAL
═══════════════════════════════════════════════════════════════ */

function ExportModal({ palette, font, onClose }: {
  palette: typeof PALETTES[0]; font: typeof FONTS[0]; onClose: () => void
}) {
  const [tab, setTab] = useState<'tokens' | 'tailwind' | 'css' | 'kit'>('tokens')
  const [copied, setCopied] = useState(false)
  const c = palette.colors

  const tokens = JSON.stringify({
    color: Object.fromEntries(Object.entries(c).map(([k, v]) => [k, { $value: v, $type: 'color' }])),
    typography: {
      fontFamily: { heading: { $value: font.heading, $type: 'fontFamily' }, body: { $value: font.body, $type: 'fontFamily' } },
      fontSize: { base: { $value: '16px', $type: 'dimension' }, scale: { $value: '1.25 (Major Third)', $type: 'string' } },
    },
  }, null, 2)

  const tailwindConfig = `// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand: {
          primary:   '${c.primary}',
          secondary: '${c.secondary}',
          accent:    '${c.accent}',
          bg:        '${c.bg}',
          surface:   '${c.surface}',
          text:      '${c.text}',
        },
      },
      fontFamily: {
        heading: ['${font.heading}', 'sans-serif'],
        body:    ['${font.body}', 'sans-serif'],
      },
    },
  },
}`

  const cssVars = `/* CSS Design Tokens — ${palette.name} / ${font.name} */
:root {
  /* Colors */
  --color-primary:   ${c.primary};
  --color-secondary: ${c.secondary};
  --color-accent:    ${c.accent};
  --color-bg:        ${c.bg};
  --color-surface:   ${c.surface};
  --color-text:      ${c.text};

  /* Typography */
  --font-heading: '${font.heading}', sans-serif;
  --font-body:    '${font.body}', sans-serif;
  --font-size-base: 16px;
  --type-ratio:   1.25; /* Major Third */

  /* Computed scale */
  --text-caption:    ${Math.round(16 / 1.25 / 1.25)}px;
  --text-body:       ${Math.round(16 / 1.25)}px;
  --text-body-lg:    16px;
  --text-h3:         ${Math.round(16 * 1.25)}px;
  --text-h2:         ${Math.round(16 * 1.25 * 1.25)}px;
  --text-h1:         ${Math.round(16 * 1.25 * 1.25 * 1.25)}px;
  --text-display:    ${Math.round(16 * 1.25 * 1.25 * 1.25 * 1.25)}px;
}`

  const content = tab === 'tokens' ? tokens : tab === 'tailwind' ? tailwindConfig : cssVars

  async function handleCopy() {
    await navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleDownload() {
    const ext = tab === 'tokens' ? 'json' : tab === 'tailwind' ? 'js' : 'css'
    const blob = new Blob([content], { type: 'text/plain' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `brand-tokens.${ext}`
    a.click()
  }

  const TABS = [
    { id: 'tokens' as const,  label: 'Design Tokens',  icon: FileJson,  desc: 'JSON (W3C format)' },
    { id: 'tailwind' as const,label: 'Tailwind Config', icon: Code2,     desc: 'tailwind.config.js' },
    { id: 'css' as const,     label: 'CSS Variables',   icon: Code2,     desc: ':root variables' },
    { id: 'kit' as const,     label: 'Marketing Kit',   icon: Package,   desc: '.zip bundle' },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl glass rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-8 pt-8 pb-6 border-b border-black/[0.06] dark:border-white/[0.06]">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Export Brand Kit</h2>
            <p className="text-gray-400 dark:text-slate-500 text-sm mt-0.5">Choose your preferred format for developer handoff</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/[0.05] flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-white cursor-pointer transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab selector */}
        <div className="grid grid-cols-4 gap-2 px-8 py-4">
          {TABS.map(({ id, label, icon: Icon, desc }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all cursor-pointer ${tab === id ? 'border-violet-500 bg-violet-50/50 dark:bg-violet-900/15' : 'border-black/[0.07] dark:border-white/[0.07] hover:border-violet-300 dark:hover:border-violet-700'}`}>
              <Icon className={`w-5 h-5 ${tab === id ? 'text-violet-600 dark:text-violet-400' : 'text-gray-400 dark:text-slate-500'}`} />
              <span className={`text-xs font-bold text-center ${tab === id ? 'text-violet-700 dark:text-violet-300' : 'text-gray-600 dark:text-slate-300'}`}>{label}</span>
              <span className="text-[10px] text-gray-400 dark:text-slate-500">{desc}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="px-8 pb-8">
          {tab === 'kit' ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center mb-4 shadow-lg shadow-violet-300/30">
                <Package className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Marketing Kit Bundle</h3>
              <p className="text-gray-400 dark:text-slate-500 text-sm max-w-xs mb-6">
                Includes logo files (SVG, PNG), color swatches, font specimens, and brand guidelines PDF — ready to share with your team.
              </p>
              <Button className="bg-violet-600 text-white px-8 h-11 text-sm shadow-md shadow-violet-300/25">
                <Download className="w-4 h-4 mr-2" /> Download .zip (coming soon)
              </Button>
            </div>
          ) : (
            <>
              <div className="relative">
                <pre className="bg-black/[0.04] dark:bg-white/[0.04] rounded-2xl p-5 text-xs font-mono text-gray-700 dark:text-slate-200 overflow-x-auto max-h-72 leading-relaxed border border-black/[0.06] dark:border-white/[0.06] whitespace-pre-wrap break-all">
                  {content}
                </pre>
              </div>
              <div className="flex gap-3 mt-4">
                <Button variant="outline" onClick={handleCopy}
                  className="flex-1 border-black/10 dark:border-white/10 text-gray-600 dark:text-slate-300 bg-white/60 dark:bg-white/[0.05] hover:bg-black/[0.03] h-11">
                  {copied ? <><Check className="w-4 h-4 mr-2 text-emerald-500" /> Copied!</> : <><Copy className="w-4 h-4 mr-2" /> Copy to Clipboard</>}
                </Button>
                <Button onClick={handleDownload} className="flex-1 bg-violet-600 text-white h-11">
                  <Download className="w-4 h-4 mr-2" /> Download File
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   LIVE PREVIEW
═══════════════════════════════════════════════════════════════ */

function LivePreview({ palette, font, logo, logoColor, companyName, viewport, forceDark }: {
  palette: typeof PALETTES[0]; font: typeof FONTS[0]
  logo: typeof LOGO_STYLES[0]; logoColor: typeof LOGO_COLORS[0]
  companyName: string; viewport: 'desktop' | 'tablet' | 'mobile'; forceDark: boolean | null
}) {
  const c = palette.colors
  const isDark = forceDark !== null ? forceDark : (c.bg.startsWith('#0') || c.bg.startsWith('#1') || c.bg === '#0C0A09')

  const scale = viewport === 'mobile' ? 0.7 : viewport === 'tablet' ? 0.85 : 1

  return (
    <div className="space-y-4">
      {/* Website mockup */}
      <div style={{ transform: `scale(${scale})`, transformOrigin: 'top center', transition: 'transform 0.3s ease' }}>
        <div className={`rounded-2xl overflow-hidden border shadow-xl`}
          style={{ border: `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`, background: c.bg }}>
          {/* Browser chrome */}
          <div className="flex items-center gap-1.5 px-3 py-2.5 border-b"
            style={{ borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)', background: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }}>
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
          <div className="flex items-center justify-between px-5 py-3"
            style={{ borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
            <div className="flex items-center gap-2">
              <LogoMark shape={logo.shape} colors={logoColor} size={20} name={companyName} />
              {logo.shape !== 'wide' && <span style={{ color: c.text, fontFamily: font.headingStack, fontWeight: 700, fontSize: 11 }}>{companyName}</span>}
            </div>
            <div className="flex items-center gap-3">
              {['Product','Pricing','About'].map(item => (
                <span key={item} style={{ color: `${c.text}60`, fontFamily: font.bodyStack, fontSize: 9 }}>{item}</span>
              ))}
              {/* Interactive CTA button */}
              <style>{`
                .preview-btn-primary { background: ${c.primary}; color: white; font-size: 9px; font-weight: 600; padding: 4px 10px; border-radius: 6px; border: none; cursor: pointer; transition: all 0.15s ease; font-family: ${font.bodyStack}; }
                .preview-btn-primary:hover { filter: brightness(1.15); transform: translateY(-1px); box-shadow: 0 4px 12px ${c.primary}55; }
                .preview-btn-primary:active { transform: translateY(0px); filter: brightness(0.95); }
              `}</style>
              <button className="preview-btn-primary">Get Started</button>
            </div>
          </div>
          {/* Hero */}
          <div className="px-5 py-7 text-center">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full mb-4"
              style={{ background: `${c.primary}18`, border: `1px solid ${c.primary}30` }}>
              <span style={{ color: c.primary, fontSize: 8, fontWeight: 700 }}>✦ AI-Powered Platform</span>
            </div>
            <h2 style={{ color: c.text, fontFamily: font.headingStack, fontWeight: 800, fontSize: 20, lineHeight: 1.2, marginBottom: 10 }}>
              Grow Your Business<br /><span style={{ color: c.primary }}>with Artificial Intelligence</span>
            </h2>
            <p style={{ color: `${c.text}70`, fontFamily: font.bodyStack, fontSize: 10, marginBottom: 16, lineHeight: 1.6, maxWidth: 260, margin: '0 auto 16px' }}>
              The all-in-one platform for modern marketing teams.
            </p>
            <div className="flex gap-2.5 justify-center">
              <style>{`
                .preview-btn-hero { background: ${c.primary}; color: white; font-size: 10px; font-weight: 700; padding: 7px 16px; border-radius: 10px; border: none; cursor: pointer; transition: all 0.15s ease; box-shadow: 0 4px 16px ${c.primary}44; font-family: ${font.bodyStack}; }
                .preview-btn-hero:hover { filter: brightness(1.12); transform: translateY(-2px); box-shadow: 0 8px 24px ${c.primary}55; }
                .preview-btn-hero:active { transform: translateY(0); filter: brightness(0.93); }
                .preview-btn-outline { background: transparent; color: ${c.text}; font-size: 10px; font-weight: 600; padding: 6px 14px; border-radius: 10px; border: 1.5px solid ${c.primary}40; cursor: pointer; transition: all 0.15s ease; font-family: ${font.bodyStack}; }
                .preview-btn-outline:hover { border-color: ${c.primary}; background: ${c.primary}10; }
                .preview-btn-outline:active { background: ${c.primary}20; }
              `}</style>
              <button className="preview-btn-hero">Start Free Trial</button>
              <button className="preview-btn-outline">Watch Demo →</button>
            </div>
            <div className="flex justify-center gap-5 mt-6 pt-5"
              style={{ borderTop: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
              {[['500+','Customers'],['3×','Avg ROI'],['40%','Saved']].map(([val, label]) => (
                <div key={label} className="text-center">
                  <p style={{ color: c.primary, fontFamily: font.headingStack, fontWeight: 800, fontSize: 13 }}>{val}</p>
                  <p style={{ color: `${c.text}50`, fontFamily: font.bodyStack, fontSize: 8 }}>{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Business card + Social */}
      <div className="grid grid-cols-2 gap-3">
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
        <div>
          <p className="text-[11px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-2">Social Post</p>
          <div className="aspect-square rounded-xl overflow-hidden shadow-lg relative"
            style={{ background: `linear-gradient(145deg, ${c.primary}22, ${c.secondary}15)`, border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}` }}>
            <div className="absolute inset-0 p-3 flex flex-col justify-between">
              <LogoMark shape={logo.shape} colors={logoColor} size={18} name={companyName} />
              <div>
                <p style={{ color: c.accent || c.primary, fontFamily: font.headingStack, fontSize: 7, fontWeight: 700, marginBottom: 3 }}>GROWTH TIP</p>
                <p style={{ color: c.text, fontFamily: font.headingStack, fontWeight: 800, fontSize: 10, lineHeight: 1.3, marginBottom: 5 }}>AI cuts costs by 40% 📊</p>
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

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════ */

export default function BrandPage() {
  const [section, setSection] = useState<'colors' | 'logos' | 'fonts'>('colors')
  const [palette, setPalette] = useState(PALETTES[0])
  const [font, setFont] = useState(FONTS[0])
  const [logo, setLogo] = useState(LOGO_STYLES[0])
  const [logoColor, setLogoColor] = useState(LOGO_COLORS[0])
  const [companyName, setCompanyName] = useState('AIPlatform')
  const [customColors, setCustomColors] = useState<Record<string, string>>({})
  const [lockedColors, setLockedColors] = useState<Set<string>>(new Set())
  const [generating, setGenerating] = useState(false)
  const [aiRationale, setAiRationale] = useState<string | null>(null)
  const [vibePrompt, setVibePrompt] = useState('')
  const [previewViewport, setPreviewViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [previewPolarity, setPreviewPolarity] = useState<boolean | null>(null) // null = auto
  const [showExport, setShowExport] = useState(false)
  const [baseSize, setBaseSize] = useState(16)
  const [typeRatioId, setTypeRatioId] = useState('major')

  const typeRatio = TYPE_RATIOS.find(r => r.id === typeRatioId)?.value ?? 1.25
  const typeScale = useMemo(() => buildTypeScale(baseSize, typeRatio), [baseSize, typeRatio])

  const effectivePalette = useMemo(() => ({
    ...palette,
    colors: { ...palette.colors, ...Object.fromEntries(Object.entries(customColors).filter(([, v]) => v)) },
  }), [palette, customColors])

  const contrastBgText = useMemo(() => {
    try { return contrastRatio(effectivePalette.colors.bg, effectivePalette.colors.text) } catch { return 1 }
  }, [effectivePalette.colors.bg, effectivePalette.colors.text])

  async function handleAISuggest() {
    setGenerating(true)
    setAiRationale(null)
    await new Promise(r => setTimeout(r, 1800))

    // Match vibe prompt to palette
    const prompt = vibePrompt.toLowerCase()
    let nextPalette = PALETTES[Math.floor(Math.random() * PALETTES.length)]
    for (const p of PALETTES) {
      if (p.vibe.some(v => prompt.includes(v))) { nextPalette = p; break }
    }

    // Respect locked colors
    const newCustom = { ...customColors }
    Object.entries(nextPalette.colors).forEach(([role, hex]) => {
      if (!lockedColors.has(role)) delete newCustom[role] // remove override so palette shows
    })
    // Keep locked colors by setting them explicitly
    lockedColors.forEach(role => {
      const current = customColors[role] || palette.colors[role as keyof typeof palette.colors]
      if (current) newCustom[role] = current
    })

    // Match font to palette vibe
    const fontSuggestions: Record<string, string> = {
      bold: 'modern', trust: 'modern', minimal: 'elegant', energy: 'friendly', nature: 'friendly', custom: 'modern',
    }
    const suggestedFont = FONTS.find(f => f.id === fontSuggestions[nextPalette.id]) ?? FONTS[0]

    setPalette(nextPalette)
    setCustomColors(newCustom)
    setFont(suggestedFont)
    setAiRationale(nextPalette.rationale)
    setGenerating(false)
  }

  function toggleLock(role: string) {
    setLockedColors(prev => {
      const next = new Set(prev)
      next.has(role) ? next.delete(role) : next.add(role)
      return next
    })
  }

  const sections = [
    { id: 'colors' as const, label: 'Color Palette', icon: Palette },
    { id: 'logos'  as const, label: 'Logo Style',    icon: ImageIcon },
    { id: 'fonts'  as const, label: 'Typography',    icon: Type },
  ]

  return (
    <div className="p-8 max-w-[1500px]">

      {/* Export modal */}
      {showExport && <ExportModal palette={effectivePalette} font={font} onClose={() => setShowExport(false)} />}

      {/* ── Header ──────────────────────────────────────────── */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-start gap-5">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-fuchsia-500 via-violet-600 to-indigo-600 flex items-center justify-center shadow-xl shadow-fuchsia-400/25 dark:shadow-fuchsia-900/30 flex-shrink-0">
            <Palette className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Brand Studio</h1>
            <p className="text-gray-500 dark:text-slate-400 text-lg mt-1">World-class brand identity builder with live preview</p>
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
              {lockedColors.size > 0 && (
                <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/40 text-amber-700 dark:text-amber-300">
                  <Lock className="w-3 h-3" /> {lockedColors.size} locked
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleAISuggest} disabled={generating}
            className="border-black/10 dark:border-white/10 text-gray-600 dark:text-slate-300 bg-white/60 dark:bg-white/[0.05] h-11 px-5 text-sm">
            {generating ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <Wand2 className="w-4 h-4 mr-2" />}
            {generating ? 'Generating…' : 'AI Suggest'}
          </Button>
          <Button onClick={() => setShowExport(true)} className="h-11 px-5 text-sm bg-violet-600 text-white shadow-md shadow-violet-300/25">
            <Download className="w-4 h-4 mr-2" /> Export Brand Kit
          </Button>
        </div>
      </div>

      {/* ── Brand Vibe Prompt ─────────────────────────────── */}
      <div className="glass p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center flex-shrink-0 shadow-md shadow-violet-300/30">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <label className="text-sm font-bold text-gray-900 dark:text-white block mb-1">
              Brand Vibe Prompt
            </label>
            <p className="text-gray-400 dark:text-slate-500 text-xs mb-3">
              Describe your brand in plain language — AI will generate a matching palette, fonts, and rationale
            </p>
            <div className="flex gap-3">
              <input
                value={vibePrompt}
                onChange={e => setVibePrompt(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAISuggest()}
                placeholder='e.g. "Minimalist premium real estate" or "Fun consumer wellness app"'
                className="flex-1 px-4 py-3 rounded-2xl border border-black/[0.08] dark:border-white/[0.09] bg-white/70 dark:bg-white/[0.05] text-gray-900 dark:text-white text-sm focus:outline-none focus:border-violet-400 backdrop-blur-sm transition-colors placeholder:text-gray-300 dark:placeholder:text-slate-600"
              />
              <Button onClick={handleAISuggest} disabled={generating} className="bg-violet-600 text-white h-11 px-5 text-sm flex-shrink-0">
                {generating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
              </Button>
            </div>
            {/* Quick chips */}
            <div className="flex flex-wrap gap-2 mt-3">
              {VIBE_CHIPS.map(chip => (
                <button key={chip} onClick={() => { setVibePrompt(chip); }}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold border border-black/[0.07] dark:border-white/[0.07] bg-black/[0.02] dark:bg-white/[0.03] text-gray-500 dark:text-slate-400 hover:border-violet-300 dark:hover:border-violet-700 hover:text-violet-600 dark:hover:text-violet-400 transition-all cursor-pointer">
                  {chip}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* AI Rationale */}
        {aiRationale && (
          <div className="mt-4 ml-14 flex items-start gap-3 px-4 py-3 rounded-2xl bg-violet-50/80 dark:bg-violet-900/15 border border-violet-200/60 dark:border-violet-700/30">
            <Sparkles className="w-4 h-4 text-violet-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-violet-700 dark:text-violet-300 mb-0.5">AI Design Rationale</p>
              <p className="text-xs text-violet-600/80 dark:text-violet-400/80 leading-relaxed">{aiRationale}</p>
            </div>
            <button onClick={() => setAiRationale(null)} className="text-violet-400 hover:text-violet-600 cursor-pointer flex-shrink-0">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6 items-start">

        {/* ── Left panel ─────────────────────────────────── */}
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

          {/* ── COLORS ─────────────────────────────────────── */}
          {section === 'colors' && (
            <div className="space-y-5">
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
                      <button key={p.id} onClick={() => { setPalette(p); setCustomColors({}) }}
                        className={`relative flex flex-col gap-0 rounded-2xl overflow-hidden border-2 cursor-pointer transition-all duration-200 hover:scale-[1.02] text-left ${active ? 'border-violet-500 shadow-xl shadow-violet-500/15' : 'border-black/[0.07] dark:border-white/[0.07] hover:border-violet-300 dark:hover:border-violet-700'}`}>
                        <div className={`h-24 bg-gradient-to-br ${p.gradient} relative`}>
                          <div className="absolute inset-0 flex items-center justify-center opacity-30">
                            <Sparkles className="w-10 h-10 text-white" />
                          </div>
                          <div className="absolute bottom-3 left-3 flex gap-1.5">
                            {Object.values(p.colors).slice(0, 4).map((hex, i) => (
                              <div key={i} className="w-6 h-6 rounded-full border-2 border-white/30 shadow-sm" style={{ background: hex }} />
                            ))}
                          </div>
                          {active && <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-white flex items-center justify-center shadow-md"><Check className="w-3.5 h-3.5 text-violet-600" /></div>}
                          {p.tag && <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/20 backdrop-blur-sm text-white">{p.tag}</div>}
                        </div>
                        <div className="p-4 bg-white/60 dark:bg-black/20 flex-1">
                          <p className="text-gray-900 dark:text-white font-bold text-sm mb-0.5">{p.name}</p>
                          <p className="text-gray-400 dark:text-slate-500 text-xs leading-relaxed">{p.desc}</p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Color editor + WCAG + Lock */}
              <div className="glass p-7">
                <div className="flex items-start justify-between mb-5">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Fine-tune Colors</h3>
                    <p className="text-gray-400 dark:text-slate-500 text-sm mt-0.5">Click to edit · Lock to preserve during AI generation</p>
                  </div>
                  {/* WCAG contrast indicator */}
                  <div className="flex flex-col items-end gap-1.5">
                    <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">BG ↔ Text Contrast</p>
                    <WCAGBadge bg={effectivePalette.colors.bg} text={effectivePalette.colors.text} />
                  </div>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                  {Object.entries(effectivePalette.colors).map(([role, hex]) => {
                    const isLocked = lockedColors.has(role)
                    return (
                      <div key={role} className="group">
                        <div className="relative mb-2.5">
                          <div className="w-full h-14 rounded-2xl border border-black/10 dark:border-white/10 shadow-sm transition-transform group-hover:scale-105 cursor-pointer"
                            style={{ background: hex }} />
                          <input type="color" value={hex}
                            onChange={e => setCustomColors(p => ({ ...p, [role]: e.target.value }))}
                            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" />
                          {/* Lock button */}
                          <button
                            onClick={e => { e.stopPropagation(); toggleLock(role) }}
                            className={`absolute top-1.5 right-1.5 w-6 h-6 rounded-lg flex items-center justify-center transition-all cursor-pointer ${isLocked ? 'bg-amber-400 shadow-md shadow-amber-300/40 opacity-100' : 'bg-white/80 dark:bg-black/50 opacity-0 group-hover:opacity-100'}`}>
                            {isLocked ? <Lock className="w-3 h-3 text-white" /> : <Unlock className="w-3 h-3 text-gray-600 dark:text-white" />}
                          </button>
                        </div>
                        <p className={`text-xs font-bold capitalize text-center ${isLocked ? 'text-amber-600 dark:text-amber-400' : 'text-gray-700 dark:text-slate-200'}`}>{role}</p>
                        <p className="text-gray-400 dark:text-slate-500 text-[10px] font-mono text-center mt-0.5">{hex}</p>
                        {isLocked && <p className="text-[9px] font-bold text-amber-500 text-center uppercase tracking-widest mt-0.5">locked</p>}
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

          {/* ── LOGOS ─────────────────────────────────────────── */}
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
                <div className="mb-7">
                  <label className="text-gray-700 dark:text-slate-200 text-sm font-semibold block mb-2">Brand / Company Name</label>
                  <input value={companyName} onChange={e => setCompanyName(e.target.value)} maxLength={20}
                    className="w-full max-w-sm px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/[0.05] text-gray-900 dark:text-white text-base font-semibold focus:outline-none focus:border-violet-400 backdrop-blur-sm" />
                </div>
                <div className="grid grid-cols-2 gap-4 mb-7">
                  {LOGO_STYLES.map(style => {
                    const active = logo.id === style.id
                    return (
                      <button key={style.id} onClick={() => setLogo(style)}
                        className={`relative flex flex-col gap-4 p-5 rounded-2xl border-2 cursor-pointer transition-all duration-200 hover:scale-[1.01] ${active ? 'border-violet-500 shadow-xl shadow-violet-500/10 bg-violet-50/50 dark:bg-violet-900/10' : 'border-black/[0.07] dark:border-white/[0.07] hover:border-violet-300 dark:hover:border-violet-700'}`}>
                        {active && <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-violet-600 flex items-center justify-center shadow-md"><Check className="w-3.5 h-3.5 text-white" /></div>}
                        <LogoMark shape={style.shape} colors={logoColor} size={44} name={companyName} />
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
                <div>
                  <p className="text-gray-700 dark:text-slate-200 text-sm font-bold mb-3">Logo Colour</p>
                  <div className="flex gap-4">
                    {LOGO_COLORS.map(lc => (
                      <button key={lc.id} onClick={() => setLogoColor(lc)} className="flex flex-col items-center gap-2 cursor-pointer">
                        <div className={`w-14 h-14 rounded-2xl transition-all duration-200 ${logoColor.id === lc.id ? 'scale-110 shadow-lg ring-2 ring-violet-500 ring-offset-2 dark:ring-offset-transparent' : 'hover:scale-105'}`}
                          style={{ background: `linear-gradient(135deg, ${lc.from}, ${lc.to})`, border: lc.id === 'white' ? '1.5px solid rgba(0,0,0,0.12)' : 'none' }} />
                        <span className={`text-xs font-semibold ${logoColor.id === lc.id ? 'text-violet-600 dark:text-violet-400' : 'text-gray-500 dark:text-slate-400'}`}>{lc.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="glass p-7">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-5">Logo Versatility Check</h3>
                <div className="grid grid-cols-4 gap-3">
                  {[{ bg: '#ffffff', label: 'White', border: true }, { bg: '#f8fafc', label: 'Light Gray', border: true }, { bg: palette.colors.primary, label: 'Primary' }, { bg: palette.colors.bg, label: 'Dark' }].map(({ bg, label, border }) => (
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

          {/* ── FONTS ─────────────────────────────────────────── */}
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
                        <div className="flex-1 p-5">
                          <div className="flex items-center gap-3 mb-3">
                            <p className="font-bold text-gray-900 dark:text-white" style={{ fontFamily: f.headingStack, fontWeight: 700, fontSize: 17 }}>{f.sample}</p>
                            {active && <div className="w-6 h-6 rounded-full bg-violet-600 flex items-center justify-center flex-shrink-0 shadow-md"><Check className="w-3.5 h-3.5 text-white" /></div>}
                          </div>
                          <p className="text-gray-500 dark:text-slate-400 text-sm leading-relaxed mb-3" style={{ fontFamily: f.bodyStack }}>
                            The quick brown fox jumps over the lazy dog.
                          </p>
                          <div className="flex items-center gap-3">
                            <Badge className={`text-[10px] ${active ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-700/40' : 'bg-gray-100 dark:bg-white/[0.07] text-gray-500 dark:text-slate-400'}`}>{f.tag || 'Classic'}</Badge>
                            <span className="text-xs text-gray-400 dark:text-slate-500">{f.desc}</span>
                          </div>
                        </div>
                        <div className="w-36 flex-shrink-0 p-5 border-l border-black/[0.06] dark:border-white/[0.06] flex flex-col justify-center gap-3">
                          <div><p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-1">Heading</p><p className="text-gray-900 dark:text-white text-sm font-bold">{f.heading}</p></div>
                          <div><p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-1">Body</p><p className="text-gray-900 dark:text-white text-sm font-semibold">{f.body}</p></div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Dynamic Type Scale */}
              <div className="glass p-7">
                <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Typographic Scale</h3>
                    <p className="text-gray-400 dark:text-slate-500 text-sm mt-0.5">Mathematically proportioned — adjust base size and ratio</p>
                  </div>
                  <div className="flex gap-3 flex-wrap">
                    {/* Base size */}
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest whitespace-nowrap">Base</label>
                      <div className="flex items-center border border-black/10 dark:border-white/10 rounded-xl overflow-hidden bg-white/60 dark:bg-white/[0.05]">
                        <button onClick={() => setBaseSize(s => Math.max(12, s - 1))} className="px-2 py-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-white cursor-pointer text-sm font-bold">−</button>
                        <span className="px-2 text-sm font-bold text-gray-900 dark:text-white min-w-[40px] text-center">{baseSize}px</span>
                        <button onClick={() => setBaseSize(s => Math.min(24, s + 1))} className="px-2 py-1.5 text-gray-400 hover:text-gray-700 dark:hover:text-white cursor-pointer text-sm font-bold">+</button>
                      </div>
                    </div>
                    {/* Ratio selector */}
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest whitespace-nowrap">Ratio</label>
                      <select value={typeRatioId} onChange={e => setTypeRatioId(e.target.value)}
                        className="px-3 py-1.5 rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/[0.05] text-gray-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-violet-400 cursor-pointer">
                        {TYPE_RATIOS.map(r => <option key={r.id} value={r.id}>{r.name} ({r.value}×)</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-0">
                  {typeScale.map(({ role, label, size }, i) => {
                    const isHeading = i < 4
                    const stack = isHeading ? font.headingStack : font.bodyStack
                    const weight = i === 0 ? '800' : i < 3 ? '700' : i === 3 ? '600' : '400'
                    const sampleText = i === 0 ? 'Grow with AI' : i === 1 ? 'AI-Powered Marketing Platform' : i === 2 ? 'Automate your campaigns today' : i === 3 ? 'Generate content in seconds' : i === 4 ? 'The platform that helps modern marketing teams move faster and close more deals.' : i === 5 ? 'The quick brown fox jumps over the lazy dog. Sphinx of black quartz, judge my vow.' : 'Supporting text, labels, metadata, timestamps and fine print'
                    return (
                      <div key={role} className={`flex items-start gap-6 py-5 ${i < typeScale.length - 1 ? 'border-b border-black/[0.04] dark:border-white/[0.04]' : ''}`}>
                        <div className="w-24 flex-shrink-0 pt-1">
                          <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest leading-tight">{label}</p>
                          <p className="text-[11px] font-bold text-violet-600 dark:text-violet-400 mt-1">{size}px</p>
                          <p className="text-[9px] text-gray-300 dark:text-slate-600 mt-0.5">{typeRatio.toFixed(3)}×</p>
                        </div>
                        <p className="text-gray-900 dark:text-white flex-1 leading-snug" style={{ fontFamily: stack, fontSize: size, fontWeight: weight, lineHeight: 1.25 }}>
                          {sampleText}
                        </p>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Right: Live Preview ─────────────────────────── */}
        <div className="sticky top-8">
          <div className="glass p-5">
            {/* Preview header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="text-base font-bold text-gray-900 dark:text-white">Live Preview</h3>
              </div>
              <div className="flex items-center gap-1.5">
                {/* Preview polarity toggle */}
                <div className="flex p-0.5 rounded-lg bg-black/[0.04] dark:bg-white/[0.05] gap-0.5">
                  <button onClick={() => setPreviewPolarity(false)}
                    title="Force light preview"
                    className={`w-6 h-6 rounded-md flex items-center justify-center cursor-pointer transition-all ${previewPolarity === false ? 'bg-white dark:bg-white/[0.15] shadow-sm text-amber-500' : 'text-gray-400 dark:text-slate-500 hover:text-gray-700 dark:hover:text-white'}`}>
                    <Sun className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setPreviewPolarity(null)}
                    title="Auto (use palette)"
                    className={`px-1.5 h-6 rounded-md flex items-center text-[9px] font-bold cursor-pointer transition-all ${previewPolarity === null ? 'bg-white dark:bg-white/[0.15] shadow-sm text-violet-600 dark:text-violet-400' : 'text-gray-400 dark:text-slate-500 hover:text-gray-700 dark:hover:text-white'}`}>
                    AUTO
                  </button>
                  <button onClick={() => setPreviewPolarity(true)}
                    title="Force dark preview"
                    className={`w-6 h-6 rounded-md flex items-center justify-center cursor-pointer transition-all ${previewPolarity === true ? 'bg-white dark:bg-white/[0.15] shadow-sm text-indigo-500' : 'text-gray-400 dark:text-slate-500 hover:text-gray-700 dark:hover:text-white'}`}>
                    <Moon className="w-3.5 h-3.5" />
                  </button>
                </div>
                {/* Viewport controls */}
                <div className="flex p-0.5 rounded-lg bg-black/[0.04] dark:bg-white/[0.05] gap-0.5">
                  {([['desktop', Monitor], ['tablet', Tablet], ['mobile', Smartphone]] as const).map(([vp, Icon]) => (
                    <button key={vp} onClick={() => setPreviewViewport(vp)}
                      title={`${vp} viewport`}
                      className={`w-6 h-6 rounded-md flex items-center justify-center cursor-pointer transition-all ${previewViewport === vp ? 'bg-white dark:bg-white/[0.15] shadow-sm text-violet-600 dark:text-violet-400' : 'text-gray-400 dark:text-slate-500 hover:text-gray-700 dark:hover:text-white'}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <LivePreview
              palette={effectivePalette}
              font={font}
              logo={logo}
              logoColor={logoColor}
              companyName={companyName}
              viewport={previewViewport}
              forceDark={previewPolarity}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
