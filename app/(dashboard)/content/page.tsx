'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  FileText, Megaphone, Mail, MessageSquare, Calendar,
  Sparkles, Copy, RefreshCw, Check, BookOpen, Presentation,
  Download, Plus, ChevronDown,
} from 'lucide-react'
import type { ContentType } from '@/types'

/* ─── Type definitions ──────────────────────────────────────────── */

const TYPES = [
  { type: 'ad_copy' as ContentType,      label: 'Ad Copy',       icon: Megaphone,     color: 'text-blue-600 dark:text-blue-300',    bg: 'bg-blue-50 dark:bg-blue-900/25    border-blue-300  dark:border-blue-700/40' },
  { type: 'blog_post' as ContentType,    label: 'Blog Post',     icon: BookOpen,      color: 'text-emerald-600 dark:text-emerald-300', bg: 'bg-emerald-50 dark:bg-emerald-900/25 border-emerald-300 dark:border-emerald-700/40' },
  { type: 'social_post' as ContentType,  label: 'Social Post',   icon: MessageSquare, color: 'text-violet-600 dark:text-violet-300',  bg: 'bg-violet-50 dark:bg-violet-900/25  border-violet-300  dark:border-violet-700/40' },
  { type: 'email' as ContentType,        label: 'Email',         icon: Mail,          color: 'text-amber-600 dark:text-amber-300',   bg: 'bg-amber-50 dark:bg-amber-900/25   border-amber-300   dark:border-amber-700/40' },
  { type: 'sms' as ContentType,          label: 'SMS',           icon: MessageSquare, color: 'text-cyan-600 dark:text-cyan-300',     bg: 'bg-cyan-50 dark:bg-cyan-900/25     border-cyan-300    dark:border-cyan-700/40' },
  { type: 'presentation' as ContentType, label: 'Presentation',  icon: Presentation,  color: 'text-rose-600 dark:text-rose-300',    bg: 'bg-rose-50 dark:bg-rose-900/25     border-rose-300    dark:border-rose-700/40' },
] as const

/* ─── Per-type option schemas ───────────────────────────────────── */

const TYPE_OPTS = {
  ad_copy: {
    desc: 'High-converting ad copy tailored to platform, audience, and objective.',
    fields: [
      { key: 'platform',  label: 'Platform',  type: 'select', opts: ['Facebook','Instagram','LinkedIn','Twitter / X','Google Search','TikTok','YouTube'], default: 'Facebook' },
      { key: 'objective', label: 'Objective', type: 'select', opts: ['Brand Awareness','Lead Generation','Sales & Conversion','Retargeting','App Install'], default: 'Sales & Conversion' },
      { key: 'tone',      label: 'Tone',      type: 'select', opts: ['Professional','Casual','Urgent','Humorous','Emotional'], default: 'Professional' },
      { key: 'format',    label: 'Format',    type: 'select', opts: ['Single Image Ad','Carousel Ad','Video Script','Search Ad (Headlines + Desc)','Story Ad'], default: 'Single Image Ad' },
      { key: 'cta',       label: 'Call to Action', type: 'select', opts: ['Shop Now','Learn More','Sign Up','Get a Quote','Download','Book a Demo','Try for Free'], default: 'Learn More' },
    ],
  },
  blog_post: {
    desc: 'SEO-optimised blog articles that position your brand as an expert.',
    fields: [
      { key: 'length',    label: 'Length',    type: 'select', opts: ['Short (~500 words)','Medium (~1 000 words)','Long (~2 000 words)','Deep-dive (~3 000 words)'], default: 'Medium (~1 000 words)' },
      { key: 'tone',      label: 'Tone',      type: 'select', opts: ['Informative','Conversational','Authoritative','Storytelling','How-to'], default: 'Informative' },
      { key: 'audience',  label: 'Audience Level', type: 'select', opts: ['Beginners','Intermediate','Experts','Mixed'], default: 'Intermediate' },
      { key: 'keywords',  label: 'SEO Keywords', type: 'text', placeholder: 'e.g. AI marketing, lead generation…' },
      { key: 'sections',  label: 'Include', type: 'checks', opts: ['Table of Contents','FAQ Section','Key Takeaways','Real examples'] },
    ],
  },
  social_post: {
    desc: 'Scroll-stopping social posts with platform-native tone and formatting.',
    fields: [
      { key: 'platform', label: 'Platform',  type: 'select', opts: ['LinkedIn','Instagram','Twitter / X','Facebook','TikTok','YouTube (Community)'], default: 'LinkedIn' },
      { key: 'format',   label: 'Format',    type: 'select', opts: ['Single Post','Thread / Carousel (5 slides)','Thread / Carousel (10 slides)','Poll','Story Caption'], default: 'Single Post' },
      { key: 'tone',     label: 'Tone',      type: 'select', opts: ['Professional','Casual','Inspirational','Educational','Promotional'], default: 'Professional' },
      { key: 'hashtags', label: 'Hashtags',  type: 'select', opts: ['None','3 hashtags','5 hashtags','10 hashtags'], default: '5 hashtags' },
      { key: 'emoji',    label: 'Add Emojis', type: 'toggle', default: true },
      { key: 'cta',      label: 'Include CTA', type: 'toggle', default: true },
    ],
  },
  email: {
    desc: 'Personalised emails that land in the inbox and get opened.',
    fields: [
      { key: 'type',    label: 'Email Type',  type: 'select', opts: ['Welcome','Newsletter','Promotional','Cold Outreach','Follow-up','Re-engagement','Transactional'], default: 'Promotional' },
      { key: 'tone',    label: 'Tone',        type: 'select', opts: ['Formal','Friendly','Urgent','Conversational'], default: 'Friendly' },
      { key: 'length',  label: 'Length',      type: 'select', opts: ['Short (~150 words)','Medium (~300 words)','Long (~500 words)'], default: 'Medium (~300 words)' },
      { key: 'subjects',label: 'Subject Lines', type: 'select', opts: ['Generate 1','Generate 3 options','Generate 5 A/B variants'], default: 'Generate 3 options' },
      { key: 'cta',     label: 'CTA Button',  type: 'text', placeholder: 'e.g. Book a Demo, Shop Now…' },
      { key: 'ps',      label: 'Add P.S. line', type: 'toggle', default: false },
    ],
  },
  sms: {
    desc: 'Punchy SMS messages that drive immediate action within the character limit.',
    fields: [
      { key: 'type',    label: 'Message Type', type: 'select', opts: ['Promotional','Appointment Reminder','Flash Sale','Event Alert','Transactional','Re-engagement'], default: 'Promotional' },
      { key: 'limit',   label: 'Char Limit',   type: 'select', opts: ['160 chars (1 SMS)','320 chars (2 SMS)','480 chars (3 SMS)'], default: '160 chars (1 SMS)' },
      { key: 'urgency', label: 'Urgency',       type: 'select', opts: ['Low','Medium','High — Time-sensitive'], default: 'Medium' },
      { key: 'link',    label: 'Include Link',  type: 'toggle', default: true },
      { key: 'optout',  label: 'Include Opt-out', type: 'toggle', default: true },
    ],
  },
  presentation: {
    desc: 'Complete slide-by-slide presentation outlines with speaker notes.',
    fields: [
      { key: 'slides',   label: 'Number of Slides', type: 'select', opts: ['5 slides','8 slides','10 slides','15 slides','20 slides'], default: '10 slides' },
      { key: 'style',    label: 'Style',             type: 'select', opts: ['Minimal & Clean','Bold & Impactful','Corporate & Professional','Creative & Visual','Dark Theme'], default: 'Minimal & Clean' },
      { key: 'audience', label: 'Audience',          type: 'select', opts: ['Internal Team','Potential Clients','Investors / Board','Conference / Public','Students'], default: 'Potential Clients' },
      { key: 'format',   label: 'Slide Content',     type: 'select', opts: ['Bullet Points','Full Paragraphs','Mixed (titles + bullets)','Key Stats + Headlines'], default: 'Mixed (titles + bullets)' },
      { key: 'notes',    label: 'Speaker Notes',     type: 'toggle', default: true },
      { key: 'visuals',  label: 'Visual Suggestions', type: 'toggle', default: true },
    ],
  },
}

/* ─── Library data ──────────────────────────────────────────────── */

const LIBRARY = [
  { title: '5 Ways AI Transforms Marketing', type: 'blog_post',    status: 'published', date: '2h ago',  words: 1240 },
  { title: 'Summer Sale Facebook Ad',         type: 'ad_copy',     status: 'approved',  date: '5h ago',  words: 180 },
  { title: 'Welcome Email Sequence',           type: 'email',       status: 'draft',     date: '1d ago',  words: 420 },
  { title: 'Q3 LinkedIn Thought Leadership',   type: 'social_post', status: 'approved',  date: '2d ago',  words: 320 },
  { title: 'Product Launch SMS — Flash Sale',  type: 'sms',         status: 'published', date: '3d ago',  words: 60 },
  { title: 'Q3 Investor Presentation',         type: 'presentation',status: 'draft',     date: '4d ago',  words: 2100 },
  { title: 'Google Search Ad — Brand PPC',     type: 'ad_copy',     status: 'published', date: '5d ago',  words: 95 },
]

const STATUS_CLASS = {
  draft:     'bg-gray-100 dark:bg-white/[0.07] text-gray-600 dark:text-slate-400',
  approved:  'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300',
  published: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300',
}

/* ─── Social Calendar data ───────────────────────────────────────── */

const CALENDAR_DAYS = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  platform: ['LinkedIn','Instagram','Twitter','Facebook','LinkedIn','Instagram','Twitter'][i % 7],
  type: ['Thought Leadership','Product Highlight','Engagement Question','Behind the Scenes','Case Study','Industry News','Promotion'][i % 7],
  status: i < 8 ? 'published' : i < 15 ? 'scheduled' : 'draft',
}))

const PLATFORM_COLOR: Record<string, string> = {
  LinkedIn:  'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  Instagram: 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300',
  Twitter:   'bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300',
  Facebook:  'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300',
}

/* ─── Helpers ───────────────────────────────────────────────────── */

function Sel({ label, value, opts, onChange }: {
  label: string; value: string; opts: readonly string[]; onChange: (v: string) => void
}) {
  const [open, setOpen] = useState(false)
  return (
    <div className="relative">
      <p className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest mb-2">{label}</p>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={`w-full flex items-center justify-between gap-2 px-4 py-3 rounded-2xl border text-sm font-semibold transition-all cursor-pointer text-left ${
          open
            ? 'border-violet-400 bg-violet-50/50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300'
            : 'border-black/[0.08] dark:border-white/[0.09] bg-white/70 dark:bg-white/[0.05] text-gray-800 dark:text-slate-100 hover:border-violet-300 dark:hover:border-violet-700 hover:bg-violet-50/30 dark:hover:bg-violet-900/10'
        }`}
      >
        <span className="truncate">{value}</span>
        <ChevronDown className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180 text-violet-500' : 'text-gray-400 dark:text-slate-500'}`} />
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          {/* Dropdown */}
          <div className="absolute z-20 top-full mt-2 left-0 right-0 glass shadow-xl rounded-2xl overflow-hidden border border-black/[0.07] dark:border-white/[0.09]">
            <div className="py-1.5 max-h-56 overflow-y-auto">
              {opts.map(opt => {
                const selected = opt === value
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => { onChange(opt); setOpen(false) }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors cursor-pointer ${
                      selected
                        ? 'bg-violet-50 dark:bg-violet-900/25 text-violet-700 dark:text-violet-300 font-bold'
                        : 'text-gray-700 dark:text-slate-200 hover:bg-black/[0.04] dark:hover:bg-white/[0.06]'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 border transition-all ${
                      selected
                        ? 'bg-violet-600 border-violet-600'
                        : 'border-gray-300 dark:border-slate-600'
                    }`}>
                      {selected && <Check className="w-2.5 h-2.5 text-white" />}
                    </span>
                    <span>{opt}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function Tog({ label, desc, value, onChange }: { label: string; desc?: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl border text-left transition-all cursor-pointer ${
        value
          ? 'bg-violet-50 dark:bg-violet-900/20 border-violet-300 dark:border-violet-700/50'
          : 'bg-white/60 dark:bg-white/[0.04] border-black/[0.07] dark:border-white/[0.07] hover:border-black/20 dark:hover:border-white/20'
      }`}
    >
      {/* Custom toggle track */}
      <div className={`relative w-9 h-5 rounded-full transition-all flex-shrink-0 ${value ? 'bg-violet-600' : 'bg-gray-200 dark:bg-slate-700'}`}>
        <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-200 ${value ? 'left-4' : 'left-0.5'}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-bold ${value ? 'text-violet-700 dark:text-violet-300' : 'text-gray-700 dark:text-slate-200'}`}>{label}</p>
        {desc && <p className="text-gray-400 dark:text-slate-500 text-xs">{desc}</p>}
      </div>
      <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg flex-shrink-0 ${value ? 'bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400' : 'bg-gray-100 dark:bg-white/[0.07] text-gray-400 dark:text-slate-500'}`}>
        {value ? 'ON' : 'OFF'}
      </span>
    </button>
  )
}

/* ─── Main component ────────────────────────────────────────────── */

export default function ContentPage() {
  const [activeTab, setActiveTab] = useState('Generate')
  const [selectedType, setSelectedType] = useState<ContentType>('ad_copy')
  const [topic, setTopic] = useState('')
  const [generating, setGenerating] = useState(false)
  const [output, setOutput] = useState('')
  const [copied, setCopied] = useState(false)
  const [calendarGenerated, setCalendarGenerated] = useState(false)
  const [generatingCal, setGeneratingCal] = useState(false)

  // Per-type field values
  const [opts, setOpts] = useState<Record<string, Record<string, string | boolean>>>({})

  function getOpt(type: ContentType, key: string): string | boolean {
    const schema = TYPE_OPTS[type]
    const field = (schema.fields as any[]).find((f: any) => f.key === key)
    if (!field) return ''
    const saved = opts[type]?.[key]
    if (saved !== undefined) return saved
    if (field.type === 'toggle') return field.default as boolean
    return field.default ?? ''
  }

  function setOpt(type: ContentType, key: string, value: string | boolean) {
    setOpts(prev => ({ ...prev, [type]: { ...prev[type], [key]: value } }))
  }

  // Checkboxes (blog sections)
  const [checks, setChecks] = useState<Record<string, boolean>>({})
  function toggleCheck(key: string) { setChecks(p => ({ ...p, [key]: !p[key] })) }

  async function handleGenerate() {
    if (!topic) return
    setGenerating(true)
    const typeOpts = opts[selectedType] ?? {}
    try {
      const res = await fetch('/api/ai/content/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: selectedType, topic, options: typeOpts }),
      })
      const data = await res.json()
      setOutput(data.content ?? generateMockOutput(selectedType, topic, typeOpts))
    } catch {
      setOutput(generateMockOutput(selectedType, topic, typeOpts))
    } finally { setGenerating(false) }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleGenerateCalendar() {
    setGeneratingCal(true)
    await new Promise(r => setTimeout(r, 2000))
    setCalendarGenerated(true)
    setGeneratingCal(false)
  }

  const typeCfg = TYPES.find(t => t.type === selectedType)!
  const schema = TYPE_OPTS[selectedType]
  const tabs = ['Generate', 'Library', 'Social Calendar']

  return (
    <div className="p-8 max-w-[1400px]">
      {/* Header */}
      <div className="flex items-start gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-300/40 dark:shadow-emerald-900/30 flex-shrink-0">
          <FileText className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Content AI</h1>
          <p className="text-gray-500 dark:text-slate-400 text-lg mt-1">Generate brand-aligned content for every channel</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="glass p-1.5 inline-flex gap-1 mb-7 rounded-2xl">
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer ${activeTab === tab ? 'bg-violet-600 text-white shadow-md' : 'text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.06]'}`}>
            {tab}
          </button>
        ))}
      </div>

      {/* ─── GENERATE ─────────────────────────────────────────────── */}
      {activeTab === 'Generate' && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

          {/* Left — type selector + options */}
          <div className="lg:col-span-2 space-y-4">

            {/* Type picker */}
            <div className="glass p-5">
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-3">Content Type</h3>
              <div className="grid grid-cols-2 gap-2">
                {TYPES.map(({ type, label, icon: Icon, color, bg }) => (
                  <button key={type} onClick={() => { setSelectedType(type); setOutput('') }}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-sm font-semibold transition-all cursor-pointer ${selectedType === type ? `${bg} ${color}` : 'bg-black/[0.03] dark:bg-white/[0.04] border-black/[0.07] dark:border-white/[0.07] text-gray-500 dark:text-slate-400 hover:border-black/20 dark:hover:border-white/20 hover:text-gray-800 dark:hover:text-white'}`}>
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Type-specific options */}
            <div className="glass p-5 space-y-4">
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white">{typeCfg.label} Options</h3>
                <p className="text-gray-400 dark:text-slate-500 text-sm mt-0.5">{schema.desc}</p>
              </div>

              {/* Topic / Brief */}
              <div>
                <p className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest mb-2">
                  {selectedType === 'presentation' ? 'Presentation Topic *' : selectedType === 'blog_post' ? 'Article Topic *' : 'Topic / Brief *'}
                </p>
                <Textarea value={topic} onChange={e => setTopic(e.target.value)} rows={3}
                  placeholder={
                    selectedType === 'ad_copy'       ? 'e.g. Summer sale — 30% off all products, targeting women 25–45' :
                    selectedType === 'blog_post'     ? 'e.g. How AI is changing digital marketing in 2026' :
                    selectedType === 'social_post'   ? 'e.g. Our new AI-powered campaign tool just launched' :
                    selectedType === 'email'         ? 'e.g. Re-engage leads who tried our free trial 30 days ago' :
                    selectedType === 'sms'           ? 'e.g. Flash sale — 50% off ends tonight at midnight' :
                                                       'e.g. Q3 product roadmap for investor meeting'
                  }
                  className="bg-white/70 dark:bg-white/[0.05] border-black/[0.08] dark:border-white/[0.09] text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-slate-600 resize-none text-sm focus:border-violet-400 backdrop-blur-sm rounded-2xl" />
              </div>

              {/* Dynamic fields per type */}
              {(schema.fields as any[]).map((field: any) => {
                const val = getOpt(selectedType, field.key)
                if (field.type === 'select') return (
                  <Sel key={field.key} label={field.label}
                    value={val as string} opts={field.opts}
                    onChange={v => setOpt(selectedType, field.key, v)} />
                )
                if (field.type === 'text') return (
                  <div key={field.key}>
                    <p className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest mb-2">{field.label}</p>
                    <Input value={(val as string) || ''} onChange={e => setOpt(selectedType, field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className="bg-white/70 dark:bg-white/[0.05] border-black/[0.08] dark:border-white/[0.09] text-gray-900 dark:text-white placeholder:text-gray-300 dark:placeholder:text-slate-600 text-sm h-11 focus:border-violet-400 backdrop-blur-sm rounded-2xl" />
                  </div>
                )
                if (field.type === 'toggle') return (
                  <Tog key={field.key} label={field.label} value={val as boolean}
                    onChange={v => setOpt(selectedType, field.key, v)} />
                )
                if (field.type === 'checks') return (
                  <div key={field.key}>
                    <p className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest mb-2">{field.label}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {(field.opts as string[]).map((opt: string) => (
                        <button key={opt} onClick={() => toggleCheck(opt)}
                          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl border text-sm font-semibold transition-all cursor-pointer ${
                            checks[opt]
                              ? 'bg-violet-50 dark:bg-violet-900/25 border-violet-400 dark:border-violet-600 text-violet-700 dark:text-violet-300'
                              : 'bg-white/70 dark:bg-white/[0.04] border-black/[0.07] dark:border-white/[0.07] text-gray-500 dark:text-slate-400 hover:border-violet-300 dark:hover:border-violet-700 hover:text-gray-800 dark:hover:text-white'
                          }`}>
                          <span className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 border transition-all ${checks[opt] ? 'bg-violet-600 border-violet-600' : 'border-gray-300 dark:border-slate-600'}`}>
                            {checks[opt] && <Check className="w-2.5 h-2.5 text-white" />}
                          </span>
                          <span className="truncate">{opt}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )
                return null
              })}

              <Button onClick={handleGenerate} disabled={generating || !topic}
                className="w-full bg-violet-600 text-white text-base h-11 disabled:opacity-50">
                {generating
                  ? <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Generating…</>
                  : <><Sparkles className="w-4 h-4 mr-2" /> Generate {typeCfg.label}</>}
              </Button>
            </div>
          </div>

          {/* Right — output */}
          <div className="lg:col-span-3">
            <div className="glass p-6 min-h-[600px] flex flex-col">
              <div className="flex items-center justify-between mb-5 flex-shrink-0">
                <div className="flex items-center gap-2.5">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Generated Content</h3>
                  <Badge className={`text-xs border font-semibold ${typeCfg.bg} ${typeCfg.color}`}>{typeCfg.label}</Badge>
                </div>
                {output && (
                  <div className="flex gap-1.5">
                    <Button variant="ghost" size="sm" onClick={handleCopy}
                      className="text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/[0.05] dark:hover:bg-white/[0.07] text-sm h-9">
                      {copied ? <><Check className="w-4 h-4 mr-1.5 text-emerald-500" /> Copied</> : <><Copy className="w-4 h-4 mr-1.5" /> Copy</>}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={handleGenerate}
                      className="text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/[0.05] dark:hover:bg-white/[0.07] text-sm h-9">
                      <RefreshCw className="w-4 h-4 mr-1.5" /> Regenerate
                    </Button>
                    <Button variant="ghost" size="sm"
                      className="text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/[0.05] dark:hover:bg-white/[0.07] text-sm h-9">
                      <Download className="w-4 h-4 mr-1.5" /> Export
                    </Button>
                  </div>
                )}
              </div>

              {output ? (
                <div className="flex-1 bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.06] dark:border-white/[0.06] rounded-2xl p-5 text-gray-700 dark:text-slate-200 text-sm leading-relaxed whitespace-pre-wrap overflow-y-auto">
                  {output}
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-300 dark:text-slate-700">
                  <div className="w-20 h-20 rounded-3xl bg-black/[0.04] dark:bg-white/[0.04] border border-black/[0.06] dark:border-white/[0.06] flex items-center justify-center mb-5">
                    {(() => { const Icon = typeCfg.icon; return <Icon className="w-9 h-9" /> })()}
                  </div>
                  <p className="text-sm text-gray-400 dark:text-slate-500 text-center max-w-xs leading-relaxed">
                    Fill in the options and click <strong className="text-gray-600 dark:text-slate-300">Generate</strong> — AI will create tailored {typeCfg.label.toLowerCase()} content
                  </p>
                  <div className="flex flex-wrap gap-2 mt-5 justify-center max-w-sm">
                    {(schema.fields as any[]).filter(f => f.type === 'select').slice(0, 3).map((f: any) => (
                      <span key={f.key} className="text-xs bg-black/[0.05] dark:bg-white/[0.07] text-gray-500 dark:text-slate-400 px-2.5 py-1 rounded-lg">
                        {f.label}: <strong className="text-gray-700 dark:text-slate-200">{getOpt(selectedType, f.key) as string}</strong>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── LIBRARY ────────────────────────────────────────────────── */}
      {activeTab === 'Library' && (
        <div className="glass p-7">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Content Library</h2>
              <p className="text-gray-400 dark:text-slate-500 text-base mt-0.5">{LIBRARY.length} items saved</p>
            </div>
            <Button className="bg-violet-600 text-white text-sm h-10 px-5">
              <Plus className="w-4 h-4 mr-2" /> New Content
            </Button>
          </div>
          <div className="divide-y divide-black/[0.05] dark:divide-white/[0.05]">
            {LIBRARY.map((item, i) => {
              const t = TYPES.find(x => x.type === item.type)
              return (
                <div key={i} className="flex items-center gap-5 py-4 group">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${t?.bg ?? 'bg-gray-100 dark:bg-white/[0.07]'}`}>
                    {t && (() => { const Icon = t.icon; return <Icon className={`w-4 h-4 ${t.color}`} /> })()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-800 dark:text-slate-100 font-semibold truncate group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors cursor-pointer">{item.title}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-gray-400 dark:text-slate-500 text-xs">{item.date}</span>
                      <span className="text-gray-300 dark:text-slate-600 text-xs">·</span>
                      <span className="text-gray-400 dark:text-slate-500 text-xs">{item.words.toLocaleString('en-US')} words</span>
                    </div>
                  </div>
                  {t && <Badge className={`text-xs border font-semibold ${t.bg} ${t.color} capitalize hidden sm:flex`}>{item.type.replace('_', ' ')}</Badge>}
                  <Badge className={`text-xs font-semibold capitalize ${STATUS_CLASS[item.status as keyof typeof STATUS_CLASS]}`}>{item.status}</Badge>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="sm" className="text-gray-400 dark:text-slate-500 hover:text-gray-700 dark:hover:text-white text-xs h-8 px-2.5">Edit</Button>
                    <Button variant="ghost" size="sm" className="text-gray-400 dark:text-slate-500 hover:text-gray-700 dark:hover:text-white text-xs h-8 px-2.5">
                      <Copy className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ─── SOCIAL CALENDAR ─────────────────────────────────────────── */}
      {activeTab === 'Social Calendar' && (
        <div className="space-y-5">
          <div className="glass p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">30-Day Social Calendar</h2>
                <p className="text-gray-400 dark:text-slate-500 text-base mt-0.5">AI-generated monthly content plan — June 2026</p>
              </div>
              <div className="flex gap-3">
                {calendarGenerated && (
                  <Button variant="ghost" className="border border-black/10 dark:border-white/10 text-gray-600 dark:text-slate-300 text-sm h-10">
                    <Download className="w-4 h-4 mr-2" /> Export CSV
                  </Button>
                )}
                <Button onClick={handleGenerateCalendar} disabled={generatingCal} className="bg-violet-600 text-white text-sm h-10 px-5">
                  {generatingCal
                    ? <><RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Generating…</>
                    : <><Sparkles className="w-4 h-4 mr-2" /> {calendarGenerated ? 'Regenerate' : 'Generate Calendar'}</>}
                </Button>
              </div>
            </div>
          </div>

          {calendarGenerated ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
              {CALENDAR_DAYS.map(day => (
                <div key={day.day}
                  className={`glass p-3.5 cursor-pointer hover:scale-[1.02] transition-all duration-150 ${day.status === 'published' ? 'ring-1 ring-emerald-400/40' : day.status === 'scheduled' ? 'ring-1 ring-blue-400/30' : ''}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-gray-400 dark:text-slate-500">Day {day.day}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                      day.status === 'published' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' :
                      day.status === 'scheduled' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' :
                      'bg-gray-100 dark:bg-white/[0.08] text-gray-500 dark:text-slate-400'
                    }`}>
                      {day.status}
                    </span>
                  </div>
                  <span className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-lg mb-2 ${PLATFORM_COLOR[day.platform] ?? 'bg-gray-100 text-gray-600'}`}>
                    {day.platform}
                  </span>
                  <p className="text-gray-700 dark:text-slate-200 text-xs font-medium leading-snug">{day.type}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass p-12 flex flex-col items-center justify-center">
              <div className="w-20 h-20 rounded-3xl bg-black/[0.04] dark:bg-white/[0.04] border border-black/[0.06] dark:border-white/[0.06] flex items-center justify-center mb-5">
                <Calendar className="w-9 h-9 text-gray-300 dark:text-slate-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-slate-100 mb-2">Generate Your Content Calendar</h3>
              <p className="text-gray-400 dark:text-slate-500 text-sm text-center max-w-sm leading-relaxed mb-5">
                AI will create a 30-day social media plan across LinkedIn, Instagram, Twitter, and Facebook — tailored to your brand voice.
              </p>
              <div className="flex flex-wrap gap-2 justify-center text-xs text-gray-500 dark:text-slate-400">
                {['Thought Leadership','Product Posts','Engagement Questions','Behind the Scenes','Case Studies','Industry News'].map(t => (
                  <span key={t} className="bg-black/[0.04] dark:bg-white/[0.06] px-2.5 py-1 rounded-lg">{t}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ─── Mock output generator ─────────────────────────────────────── */

function generateMockOutput(type: ContentType, topic: string, opts: Record<string, string | boolean>): string {
  switch (type) {
    case 'ad_copy': return `📢 ${opts.format ?? 'Ad Copy'} — ${opts.platform ?? 'Facebook'}\n\n🎯 Headline:\n"${topic.slice(0, 50)}"\n\n📝 Primary Text:\nTired of mediocre results? It's time to change the game. ${topic}\n\nOur AI-powered platform helps businesses like yours achieve 3× better ROI — without the guesswork.\n\n✅ 500+ companies already growing faster\n✅ Set up in under 10 minutes\n✅ Cancel anytime\n\n🔗 ${opts.cta ?? 'Learn More'} → [your-link.com]\n\n---\nAlternative Headline:\n"Stop Wasting Budget. Start Seeing Results."\n\nDescription:\n${topic}. Join 500+ businesses already growing faster with AI. ${opts.cta ?? 'Learn More'} today.`

    case 'blog_post': return `# ${topic}\n\n## Introduction\n\nIn today's competitive landscape, businesses that leverage AI for their marketing operations gain a significant edge. ${topic} is more than just a trend — it's a fundamental shift in how modern marketing works.\n\n## Why This Matters\n\nThe numbers don't lie. Companies that adopt AI-powered marketing see on average:\n- 40% reduction in time spent on content creation\n- 3× improvement in campaign ROI\n- 60% better lead qualification rates\n\n## Key Strategies\n\n### 1. Start with Data\nBefore implementing any AI tool, ensure your data infrastructure is solid. AI is only as good as the data it learns from.\n\n### 2. Automate the Repetitive\nUse AI to handle high-volume, repetitive tasks like social scheduling, A/B testing, and lead scoring — freeing your team for creative work.\n\n### 3. Personalise at Scale\nModern AI can deliver personalised experiences to thousands of customers simultaneously, something impossible manually.\n\n## Conclusion\n\n${topic} represents a genuine opportunity for businesses willing to invest in the technology. Start small, measure rigorously, and scale what works.\n\n**Ready to get started?** Book a free demo today →`

    case 'social_post': return `${opts.platform === 'LinkedIn' ? '🔵 LinkedIn Post' : opts.platform === 'Instagram' ? '📸 Instagram Caption' : '🐦 Post'}\n\n${topic}\n\nHere's what we've learned after working with 500+ businesses:\n\n→ 73% of teams waste time on manual tasks AI could automate\n→ The top 10% of marketers use AI tools daily\n→ AI-assisted campaigns outperform manual ones by 3.2×\n\nThe question isn't whether to adopt AI. It's how fast you can do it.\n\nWhat's your experience with AI in marketing? Comment below 👇\n\n${opts.hashtags !== 'None' ? '#AIMarketing #DigitalMarketing #MarketingAutomation #GrowthHacking #ContentMarketing' : ''}`

    case 'email': return `Subject Lines (A/B Test):\nA: "Quick question about your marketing results…"\nB: "The tool 500+ companies swear by"\nC: "You're leaving money on the table"\n\n---\n\nHi {{first_name}},\n\n${topic}\n\nI'll keep this short.\n\nMost marketing teams spend 60% of their time on tasks that AI could handle automatically. The other 40%? That's where your real value lies.\n\nThat's exactly why we built AIPlatform — to handle the repetitive so your team can focus on strategy.\n\nIn the last 30 days, our customers have:\n✅ Generated 10,000+ pieces of content\n✅ Reduced campaign setup time by 75%\n✅ Increased qualified leads by 40%\n\n${opts.cta ? `**${opts.cta}** →` : 'Book a free 15-minute demo →'} [calendar link]\n\nBest,\n[Your Name]\n\n${opts.ps ? 'P.S. We\'re offering a free 14-day trial this month — no credit card required.' : ''}`

    case 'sms': return `[SMS — ${opts.limit ?? '160 chars'}]\n\n${topic.slice(0, 80)}! 🔥 Limited time only.\n\n${opts.link ? '→ bit.ly/offer-2026' : ''}\n${opts.optout ? '\nReply STOP to opt out.' : ''}\n\n---\nChar count: ${Math.min(topic.length + 45, parseInt(String(opts.limit ?? '160')))}/${opts.limit?.toString().split(' ')[0] ?? '160'}`

    case 'presentation': return `📊 Presentation: ${topic}\n${opts.slides ?? '10 slides'} | ${opts.style ?? 'Minimal'} | Audience: ${opts.audience ?? 'Clients'}\n\n━━━━━━━━━━━━━━━━━━━━━\nSLIDE 1 — Title\n"${topic}"\nSubtitle: A Strategic Overview\n${opts.notes ? '\n[Speaker Note: Welcome the audience. Introduce yourself and the agenda briefly.]' : ''}\n\n━━━━━━━━━━━━━━━━━━━━━\nSLIDE 2 — The Problem\n• 73% of teams struggle with X\n• Manual processes cost $Y per year\n• The market is shifting fast\n${opts.notes ? '\n[Speaker Note: Open with a pain point the audience recognises. Pause for 5 seconds after the stats.]' : ''}\n\n━━━━━━━━━━━━━━━━━━━━━\nSLIDE 3 — Our Solution\n• AI-powered approach\n• Saves 40% of time\n• Proven ROI of 3×\n${opts.visuals ? '\n[Visual: Before/After comparison diagram]' : ''}\n\n━━━━━━━━━━━━━━━━━━━━━\nSLIDE 4 — How It Works\nStep 1 → Step 2 → Step 3 → Results\n${opts.notes ? '\n[Speaker Note: Keep this slide simple. Walk through each step slowly.]' : ''}\n\n━━━━━━━━━━━━━━━━━━━━━\nSLIDE 5 — Results & Case Study\n"Company X achieved 200% growth in 6 months"\n• Metric 1: +145%\n• Metric 2: -60% cost\n• Metric 3: 3× speed\n\n[...${parseInt(String(opts.slides ?? '10 slides')) - 5} more slides generated]`

    default: return 'Content generated. Please check API configuration for live generation.'
  }
}
