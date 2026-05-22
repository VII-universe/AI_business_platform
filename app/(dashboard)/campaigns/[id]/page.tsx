import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  ArrowLeft, Megaphone, Globe, BarChart2, Mail, Target,
  TrendingUp, MousePointerClick, DollarSign, Users,
  Play, Pause, Edit2, Download, Brain,
} from 'lucide-react'
import { ChartPanel } from './chart-panel'

/* ─── Data ──────────────────────────────────────────────────────── */

const CAMPAIGNS: Record<string, {
  id: string; name: string; status: string; budget: number; spent: number
  channels: string[]; kpis: Record<string, number>; startDate: string; endDate: string
  image: string; description: string; objective: string; audience: string
  dailyBudget: number; cpa: number; roas: number
}> = {
  '1': {
    id: '1', name: 'Summer Sale 2025', status: 'active', budget: 5000, spent: 2340,
    channels: ['meta_ads', 'google_ads'],
    kpis: { impressions: 124000, clicks: 6200, ctr: 5.0, conversions: 312, cpc: 0.38, cpm: 18.9 },
    startDate: 'Jun 1, 2026', endDate: 'Jun 30, 2026',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&q=80',
    description: 'Seasonal discount campaign targeting existing customers and lookalike audiences on Meta and Google.',
    objective: 'Drive 300+ conversions from summer sale traffic with a target CPA of $7.50',
    audience: 'Ages 25–45, e-commerce interest, previous customers + 1% lookalike, CZ & SK',
    dailyBudget: 167, cpa: 7.50, roas: 4.2,
  },
  '2': {
    id: '2', name: 'Lead Gen Q2', status: 'active', budget: 3000, spent: 890,
    channels: ['google_ads', 'linkedin'],
    kpis: { impressions: 45000, clicks: 2100, ctr: 4.7, conversions: 89, cpc: 0.42, cpm: 19.8 },
    startDate: 'May 15, 2026', endDate: 'Jul 15, 2026',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&q=80',
    description: 'B2B lead generation targeting marketing managers and decision makers via Google Search and LinkedIn.',
    objective: 'Generate 150 qualified leads with a CPL under $20 from B2B audience',
    audience: 'Marketing managers, CMOs, company size 50–500, Czech Republic',
    dailyBudget: 50, cpa: 10.00, roas: 2.8,
  },
  '3': {
    id: '3', name: 'Brand Awareness Push', status: 'paused', budget: 8000, spent: 8000,
    channels: ['meta_ads', 'google_ads', 'linkedin'],
    kpis: { impressions: 520000, clicks: 18000, ctr: 3.5, conversions: 420, cpc: 0.44, cpm: 15.4 },
    startDate: 'Apr 1, 2026', endDate: 'Apr 30, 2026',
    image: 'https://images.unsplash.com/photo-1493612276216-ee3925520721?w=1200&q=80',
    description: 'Multi-channel brand awareness campaign across social and search to boost aided brand recall.',
    objective: 'Reach 500K+ unique users and achieve 5%+ brand recall lift',
    audience: 'Broad 20–55, Czech Republic, business + tech interests',
    dailyBudget: 267, cpa: 19.05, roas: 1.9,
  },
}

const DAILY_PERFORMANCE: Record<string, { day: string; date: string; impressions: number; clicks: number; conv: number; spend: number }[]> = {
  '1': [
    { day: 'Mon', date: 'Jun 16', impressions: 18200, clicks: 912, conv: 46, spend: 170 },
    { day: 'Tue', date: 'Jun 17', impressions: 19400, clicks: 982, conv: 51, spend: 183 },
    { day: 'Wed', date: 'Jun 18', impressions: 17800, clicks: 890, conv: 44, spend: 161 },
    { day: 'Thu', date: 'Jun 19', impressions: 21000, clicks: 1050, conv: 55, spend: 198 },
    { day: 'Fri', date: 'Jun 20', impressions: 22600, clicks: 1134, conv: 59, spend: 214 },
    { day: 'Sat', date: 'Jun 21', impressions: 14000, clicks: 700,  conv: 35, spend: 128 },
    { day: 'Sun', date: 'Jun 22', impressions: 11000, clicks: 532,  conv: 22, spend: 98  },
  ],
  '2': [
    { day: 'Mon', date: 'Jun 16', impressions: 6200,  clicks: 290, conv: 12, spend: 48 },
    { day: 'Tue', date: 'Jun 17', impressions: 7100,  clicks: 334, conv: 15, spend: 56 },
    { day: 'Wed', date: 'Jun 18', impressions: 5800,  clicks: 272, conv: 11, spend: 44 },
    { day: 'Thu', date: 'Jun 19', impressions: 8400,  clicks: 394, conv: 18, spend: 63 },
    { day: 'Fri', date: 'Jun 20', impressions: 9200,  clicks: 432, conv: 20, spend: 69 },
    { day: 'Sat', date: 'Jun 21', impressions: 4100,  clicks: 192, conv: 7,  spend: 31 },
    { day: 'Sun', date: 'Jun 22', impressions: 3200,  clicks: 150, conv: 6,  spend: 24 },
  ],
  '3': [
    { day: 'Mon', date: 'Apr 7',  impressions: 72000, clicks: 2520, conv: 58, spend: 380 },
    { day: 'Tue', date: 'Apr 8',  impressions: 68000, clicks: 2380, conv: 54, spend: 360 },
    { day: 'Wed', date: 'Apr 9',  impressions: 81000, clicks: 2835, conv: 65, spend: 427 },
    { day: 'Thu', date: 'Apr 10', impressions: 75000, clicks: 2625, conv: 61, spend: 395 },
    { day: 'Fri', date: 'Apr 11', impressions: 79000, clicks: 2765, conv: 64, spend: 418 },
    { day: 'Sat', date: 'Apr 12', impressions: 88000, clicks: 3080, conv: 71, spend: 466 },
    { day: 'Sun', date: 'Apr 13', impressions: 57000, clicks: 1995, conv: 47, spend: 302 },
  ],
}

const CHANNEL_LABELS: Record<string, string> = {
  google_ads: 'Google Ads', meta_ads: 'Meta Ads', email: 'Email', linkedin: 'LinkedIn',
}
const CHANNEL_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  google_ads: Globe, meta_ads: BarChart2, email: Mail, linkedin: Target,
}
const STATUS_CONFIG = {
  active: { label: 'Active', dot: 'bg-emerald-500', text: 'text-emerald-700 dark:text-emerald-300', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
  paused: { label: 'Paused', dot: 'bg-amber-500',   text: 'text-amber-700 dark:text-amber-400',   bg: 'bg-amber-50 dark:bg-amber-900/20' },
}

/* ─── Custom tooltip ────────────────────────────────────────────── */

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="glass px-4 py-3 shadow-xl text-sm min-w-[160px]">
      <p className="text-gray-900 dark:text-white font-bold mb-2">{label}</p>
      {payload.map((entry: any) => (
        <div key={entry.name} className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
            <span className="text-gray-500 dark:text-slate-400 text-xs">{entry.name}</span>
          </div>
          <span className="font-semibold text-gray-900 dark:text-white text-xs">
            {entry.name === 'Spend' ? `$${entry.value}` : entry.value.toLocaleString('en-US')}
          </span>
        </div>
      ))}
    </div>
  )
}

/* ─── Metric tabs for the chart ─────────────────────────────────── */

const METRICS = [
  { id: 'conv',        label: 'Conversions', color: '#7C3AED' },
  { id: 'clicks',      label: 'Clicks',      color: '#2563EB' },
  { id: 'impressions', label: 'Impressions',  color: '#059669' },
  { id: 'spend',       label: 'Spend ($)',    color: '#F59E0B' },
]

/* ─── Page ──────────────────────────────────────────────────────── */

export default async function CampaignDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const campaign = CAMPAIGNS[id] || CAMPAIGNS['1']
  const daily = DAILY_PERFORMANCE[id] || DAILY_PERFORMANCE['1']
  const spendPct = (campaign.spent / campaign.budget) * 100
  const s = STATUS_CONFIG[campaign.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.active

  return (
    <div className="p-8 max-w-[1400px]">
      <Link href="/campaigns" className="inline-flex items-center gap-2 text-gray-400 dark:text-slate-500 hover:text-violet-600 dark:hover:text-violet-400 transition-colors text-sm font-medium mb-6 group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /> Back to Campaigns
      </Link>

      {/* Hero */}
      <div className="glass overflow-hidden mb-6">
        <div className="relative h-52 overflow-hidden">
          <img src={campaign.image} alt={campaign.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute bottom-5 left-6 right-6 flex items-end justify-between">
            <div>
              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm mb-2 ${s.bg} ${s.text}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${s.dot}`} /> {s.label}
              </div>
              <h1 className="text-3xl font-bold text-white">{campaign.name}</h1>
              <p className="text-white/70 text-sm mt-0.5">{campaign.startDate} → {campaign.endDate}</p>
            </div>
            <div className="flex gap-2">
              {[
                { icon: campaign.status === 'active' ? Pause : Play },
                { icon: Edit2 },
                { icon: Download },
              ].map(({ icon: Icon }, i) => (
                <button key={i} className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-colors cursor-pointer">
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="p-6">
          <p className="text-gray-600 dark:text-slate-300 text-base leading-relaxed mb-5">{campaign.description}</p>
          <div className="grid grid-cols-3 gap-4">
            {[
              { title: 'Objective', body: campaign.objective },
              { title: 'Target Audience', body: campaign.audience },
            ].map(({ title, body }) => (
              <div key={title} className="p-4 rounded-xl bg-black/[0.03] dark:bg-white/[0.04]">
                <p className="text-gray-400 dark:text-slate-500 text-xs font-semibold uppercase tracking-wide mb-1">{title}</p>
                <p className="text-gray-700 dark:text-slate-200 text-sm leading-relaxed">{body}</p>
              </div>
            ))}
            <div className="p-4 rounded-xl bg-black/[0.03] dark:bg-white/[0.04]">
              <p className="text-gray-400 dark:text-slate-500 text-xs font-semibold uppercase tracking-wide mb-2">Channels</p>
              <div className="flex flex-wrap gap-2">
                {campaign.channels.map(ch => {
                  const Icon = CHANNEL_ICONS[ch]
                  return (
                    <span key={ch} className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-slate-300 bg-black/[0.05] dark:bg-white/[0.07] px-2.5 py-1 rounded-lg font-medium">
                      <Icon className="w-3.5 h-3.5" /> {CHANNEL_LABELS[ch]}
                    </span>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-6">
        {[
          { label: 'Impressions', value: campaign.kpis.impressions.toLocaleString('en-US'), icon: Users, gradient: 'from-violet-500 to-purple-700' },
          { label: 'Clicks',      value: campaign.kpis.clicks.toLocaleString('en-US'),      icon: MousePointerClick, gradient: 'from-blue-500 to-indigo-600' },
          { label: 'CTR',         value: `${campaign.kpis.ctr}%`,                           icon: TrendingUp, gradient: 'from-emerald-400 to-teal-600' },
          { label: 'Conversions', value: campaign.kpis.conversions.toLocaleString('en-US'), icon: Target, gradient: 'from-amber-400 to-orange-500' },
          { label: 'CPC',         value: `$${campaign.kpis.cpc}`,                           icon: DollarSign, gradient: 'from-cyan-400 to-blue-500' },
          { label: 'CPM',         value: `$${campaign.kpis.cpm}`,                           icon: Megaphone, gradient: 'from-rose-400 to-pink-600' },
        ].map(k => {
          const Icon = k.icon
          return (
            <div key={k.label} className={`bg-gradient-to-br ${k.gradient} rounded-2xl p-4 text-white shadow-lg`}>
              <Icon className="w-5 h-5 mb-2 opacity-70" />
              <p className="text-2xl font-bold" style={{ fontFamily: 'var(--font-poppins)' }}>{k.value}</p>
              <p className="text-white/65 text-xs font-medium mt-0.5">{k.label}</p>
            </div>
          )
        })}
      </div>

      {/* Charts + sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Performance charts */}
        <div className="lg:col-span-2 space-y-5">
          <ChartPanel daily={daily} />
        </div>

        {/* Budget + AI */}
        <div className="space-y-4">
          <div className="glass p-5">
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">Budget Overview</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-slate-400">Spent</span>
                <span className="font-bold text-gray-900 dark:text-white">${campaign.spent.toLocaleString('en-US')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-slate-400">Remaining</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">${(campaign.budget - campaign.spent).toLocaleString('en-US')}</span>
              </div>
              <div className="h-3 bg-black/[0.06] dark:bg-white/[0.08] rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${spendPct >= 95 ? 'bg-red-500' : 'bg-violet-500'}`}
                  style={{ width: `${spendPct}%` }} />
              </div>
              <p className="text-xs text-gray-400 dark:text-slate-500 text-right">{spendPct.toFixed(0)}% of total budget</p>
              <div className="pt-2 border-t border-black/[0.06] dark:border-white/[0.06] space-y-2">
                {[
                  { label: 'Daily budget', value: `$${campaign.dailyBudget}/day` },
                  { label: 'Target CPA',   value: `$${campaign.cpa}` },
                  { label: 'ROAS',         value: `${campaign.roas}×` },
                ].map(r => (
                  <div key={r.label} className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-slate-400">{r.label}</span>
                    <span className="font-semibold text-gray-700 dark:text-slate-200">{r.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="glass p-5 bg-gradient-to-br from-violet-50/80 to-indigo-50/60 dark:from-violet-950/40 dark:to-indigo-950/30">
            <div className="flex items-center gap-2.5 mb-3">
              <Brain className="w-5 h-5 text-violet-600 dark:text-violet-400" />
              <h3 className="text-base font-bold text-gray-900 dark:text-white">AI Recommendation</h3>
            </div>
            <p className="text-gray-600 dark:text-slate-300 text-sm leading-relaxed">
              CTR is <span className="font-semibold text-emerald-600 dark:text-emerald-400">18% above benchmark</span>. Increase daily budget by 20% to scale conversions before the campaign ends.
            </p>
            <Button className="w-full mt-4 bg-violet-600 text-white text-sm shadow-sm">
              Apply AI Suggestion
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

