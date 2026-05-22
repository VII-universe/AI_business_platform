'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Megaphone, DollarSign, MousePointerClick, Target, Sparkles, Play, Pause, Globe, Mail, MessageSquare, BarChart2 } from 'lucide-react'

const CHANNEL_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  google_ads: Globe, meta_ads: BarChart2, email: Mail, sms: MessageSquare, linkedin: Target,
}
const CHANNEL_LABELS: Record<string, string> = {
  google_ads: 'Google', meta_ads: 'Meta', email: 'Email', sms: 'SMS', linkedin: 'LinkedIn',
}

const CAMPAIGNS = [
  {
    id: '1', name: 'Summer Sale 2025', status: 'active', budget: 5000, spent: 2340,
    channels: ['meta_ads', 'google_ads'],
    kpis: { impressions: 124000, clicks: 6200, ctr: 5.0, conversions: 312 },
    startDate: 'Jun 1', endDate: 'Jun 30',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600&q=80',
    description: 'Seasonal discount campaign targeting existing customers and lookalike audiences.',
  },
  {
    id: '2', name: 'Lead Gen Q2', status: 'active', budget: 3000, spent: 890,
    channels: ['google_ads', 'linkedin'],
    kpis: { impressions: 45000, clicks: 2100, ctr: 4.7, conversions: 89 },
    startDate: 'May 15', endDate: 'Jul 15',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80',
    description: 'B2B lead generation targeting marketing managers and decision makers.',
  },
  {
    id: '3', name: 'Brand Awareness Push', status: 'paused', budget: 8000, spent: 8000,
    channels: ['meta_ads', 'google_ads', 'linkedin'],
    kpis: { impressions: 520000, clicks: 18000, ctr: 3.5, conversions: 420 },
    startDate: 'Apr 1', endDate: 'Apr 30',
    image: 'https://images.unsplash.com/photo-1493612276216-ee3925520721?w=600&q=80',
    description: 'Multi-channel brand awareness campaign across social and search networks.',
  },
]

const STATUS_CONFIG = {
  active: { label: 'Active', dot: 'bg-emerald-500', text: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
  paused: { label: 'Paused', dot: 'bg-amber-500', text: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20' },
  draft: { label: 'Draft', dot: 'bg-gray-400', text: 'text-gray-500', bg: 'bg-gray-100 dark:bg-white/[0.06]' },
  completed: { label: 'Completed', dot: 'bg-blue-500', text: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' },
}

export default function CampaignsPage() {
  const [showCreate, setShowCreate] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [objective, setObjective] = useState('')
  const [budget, setBudget] = useState('')
  const [channels, setChannels] = useState<string[]>([])

  async function handleCreate() {
    if (!objective || !budget) return
    setGenerating(true)
    try {
      await fetch('/api/ai/campaigns/strategy', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ objective, budget: Number(budget), channels, duration: 30 }) })
      setShowCreate(false)
    } finally { setGenerating(false) }
  }

  return (
    <div className="p-8 max-w-[1400px]">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-700 flex items-center justify-center shadow-lg shadow-blue-300/40 dark:shadow-blue-900/30 flex-shrink-0">
            <Megaphone className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Campaigns</h1>
            <p className="text-gray-500 dark:text-slate-400 text-lg mt-1">AI-designed and autonomously optimized campaigns</p>
          </div>
        </div>
        <Button onClick={() => setShowCreate(true)} className="bg-violet-600 hover:bg-violet-700 text-white shadow-md shadow-violet-300/30 dark:shadow-violet-900/30 text-base h-11 px-6">
          <Sparkles className="w-4 h-4 mr-2" /> Create with AI
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-7">
        {[
          { label: 'Active Campaigns', value: '3', icon: Megaphone, gradient: 'from-blue-500 to-indigo-600' },
          { label: 'Total Spend MTD', value: '$11.2K', icon: DollarSign, gradient: 'from-emerald-400 to-teal-600' },
          { label: 'Total Conversions', value: '821', icon: Target, gradient: 'from-violet-500 to-purple-700' },
          { label: 'Avg CTR', value: '4.4%', icon: MousePointerClick, gradient: 'from-amber-400 to-orange-500' },
        ].map(s => {
          const Icon = s.icon
          return (
            <div key={s.label} className={`bg-gradient-to-br ${s.gradient} rounded-2xl p-5 text-white shadow-lg`}>
              <Icon className="w-6 h-6 mb-3 opacity-80" />
              <p className="text-4xl font-bold" style={{ fontFamily: 'var(--font-poppins)' }}>{s.value}</p>
              <p className="text-white/70 text-sm mt-1 font-medium">{s.label}</p>
            </div>
          )
        })}
      </div>

      {/* Create panel */}
      {showCreate && (
        <div className="glass p-7 mb-7 ring-2 ring-violet-500/20">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3 mb-1">
            <Sparkles className="w-6 h-6 text-violet-600" /> Create AI Campaign
          </h2>
          <p className="text-gray-500 dark:text-slate-400 text-base mb-6">AI will generate strategy, ad copy, and targeting in seconds</p>
          <div className="space-y-5">
            <div>
              <Label className="text-gray-700 dark:text-slate-200 text-base font-semibold mb-2 block">Campaign Objective *</Label>
              <Textarea value={objective} onChange={e => setObjective(e.target.value)} placeholder="e.g. Generate 200 leads for our SaaS product targeting marketing managers in the US"
                className="bg-white/60 dark:bg-white/[0.05] border-black/10 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 resize-none text-base focus:border-violet-400 backdrop-blur-sm" rows={2} />
            </div>
            <div className="grid grid-cols-2 gap-5">
              <div>
                <Label className="text-gray-700 dark:text-slate-200 text-base font-semibold mb-2 block">Total Budget ($) *</Label>
                <Input value={budget} onChange={e => setBudget(e.target.value)} type="number" placeholder="5000"
                  className="bg-white/60 dark:bg-white/[0.05] border-black/10 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-400 text-base h-11 focus:border-violet-400 backdrop-blur-sm" />
              </div>
              <div>
                <Label className="text-gray-700 dark:text-slate-200 text-base font-semibold mb-2 block">Duration (days)</Label>
                <Input defaultValue="30" type="number"
                  className="bg-white/60 dark:bg-white/[0.05] border-black/10 dark:border-white/10 text-gray-900 dark:text-white text-base h-11 focus:border-violet-400 backdrop-blur-sm" />
              </div>
            </div>
            <div>
              <Label className="text-gray-700 dark:text-slate-200 text-base font-semibold mb-2 block">Channels</Label>
              <div className="flex flex-wrap gap-2">
                {['meta_ads', 'google_ads', 'email', 'sms', 'linkedin'].map(ch => (
                  <button key={ch} onClick={() => setChannels(p => p.includes(ch) ? p.filter(c => c !== ch) : [...p, ch])}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all cursor-pointer ${channels.includes(ch) ? 'bg-violet-600 border-violet-600 text-white shadow-md shadow-violet-300/20' : 'bg-white/60 dark:bg-white/[0.05] border-black/10 dark:border-white/10 text-gray-600 dark:text-slate-300 hover:border-violet-400 hover:text-violet-600 dark:hover:text-violet-400 backdrop-blur-sm'}`}>
                    {CHANNEL_LABELS[ch]}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3 pt-1">
              <Button variant="ghost" onClick={() => setShowCreate(false)} className="text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-white text-base h-11">Cancel</Button>
              <Button onClick={handleCreate} disabled={generating || !objective || !budget}
                className="bg-violet-600 hover:bg-violet-700 text-white shadow-md shadow-violet-300/20 text-base h-11 px-6">
                {generating ? 'Generating...' : <><Sparkles className="w-4 h-4 mr-2" /> Generate Campaign</>}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Campaign list */}
      <div className="space-y-4">
        {CAMPAIGNS.map(campaign => {
          const spendPct = (campaign.spent / campaign.budget) * 100
          const s = STATUS_CONFIG[campaign.status as keyof typeof STATUS_CONFIG]
          return (
            <div key={campaign.id} className="glass overflow-hidden hover:shadow-lg transition-shadow duration-200">
              <div className="flex">
                {/* Campaign image */}
                <div className="relative w-52 flex-shrink-0 overflow-hidden">
                  <img
                    src={campaign.image}
                    alt={campaign.name}
                    className="w-full h-full object-cover"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20 dark:to-black/40" />
                  {/* Status badge over image */}
                  <div className={`absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold backdrop-blur-sm ${s.bg} ${s.text}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                    {s.label}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{campaign.name}</h3>
                      <p className="text-gray-400 dark:text-slate-500 text-sm mb-2">{campaign.description}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-400 dark:text-slate-500">
                        <span>{campaign.startDate} → {campaign.endDate}</span>
                        <span>·</span>
                        <div className="flex gap-1.5">
                          {campaign.channels.map(ch => (
                            <span key={ch} className="bg-black/[0.05] dark:bg-white/[0.07] text-gray-600 dark:text-slate-400 px-2.5 py-0.5 rounded-lg text-xs font-semibold">
                              {CHANNEL_LABELS[ch]}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                      <button className="w-9 h-9 rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/[0.05] flex items-center justify-center text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 transition-all backdrop-blur-sm cursor-pointer">
                        {campaign.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                      </button>
                      <Link href={`/campaigns/${campaign.id}`}>
                        <Button variant="outline" size="sm" className="border-black/10 dark:border-white/10 text-gray-600 dark:text-slate-300 bg-white/60 dark:bg-white/[0.05] hover:bg-black/[0.04] backdrop-blur-sm text-sm h-9 px-4">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* Budget */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-gray-500 dark:text-slate-400 font-medium">Budget spent</span>
                      <span className="text-gray-800 dark:text-slate-200 font-bold">
                        ${campaign.spent.toLocaleString('en-US')}
                        <span className="text-gray-400 dark:text-slate-500 font-normal"> / ${campaign.budget.toLocaleString('en-US')}</span>
                      </span>
                    </div>
                    <div className="h-2 bg-black/[0.05] dark:bg-white/[0.07] rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${spendPct >= 95 ? 'bg-red-500' : spendPct >= 70 ? 'bg-amber-500' : 'bg-violet-500'}`} style={{ width: `${spendPct}%` }} />
                    </div>
                  </div>

                  {/* KPIs */}
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { label: 'Impressions', value: campaign.kpis.impressions.toLocaleString('en-US') },
                      { label: 'Clicks', value: campaign.kpis.clicks.toLocaleString('en-US') },
                      { label: 'CTR', value: `${campaign.kpis.ctr}%` },
                      { label: 'Conversions', value: campaign.kpis.conversions.toString() },
                    ].map(kpi => (
                      <div key={kpi.label} className="text-center p-3 rounded-xl bg-black/[0.04] dark:bg-white/[0.05] border border-black/[0.04] dark:border-white/[0.05]">
                        <p className="text-gray-900 dark:text-white font-bold text-lg" style={{ fontFamily: 'var(--font-poppins)' }}>{kpi.value}</p>
                        <p className="text-gray-400 dark:text-slate-500 text-xs font-medium mt-0.5">{kpi.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
