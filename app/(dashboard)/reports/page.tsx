'use client'

import { Button } from '@/components/ui/button'
import { BarChart2, TrendingUp, Download, Brain, Users, DollarSign, MousePointerClick } from 'lucide-react'

export default function ReportsPage() {
  return (
    <div className="p-8 max-w-[1400px]">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-400 to-pink-600 flex items-center justify-center shadow-lg shadow-rose-300/40 dark:shadow-rose-900/30 flex-shrink-0">
            <BarChart2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Reports & Insights</h1>
            <p className="text-gray-500 dark:text-slate-400 text-lg mt-1">AI-generated performance analysis and recommendations</p>
          </div>
        </div>
        <Button className="bg-violet-600 hover:bg-violet-700 text-white shadow-md shadow-violet-300/30 text-base h-11 px-6">
          <Download className="w-4 h-4 mr-2" /> Export PDF
        </Button>
      </div>

      {/* AI Digest */}
      <div className="bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 rounded-2xl p-7 mb-7 shadow-xl shadow-violet-300/25 dark:shadow-violet-900/25 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-full opacity-10 pointer-events-none">
          <div className="w-64 h-64 rounded-full bg-white absolute -right-16 -top-16" />
          <div className="w-40 h-40 rounded-full bg-white absolute right-24 top-20" />
        </div>
        <div className="relative flex items-start gap-5">
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-3">
              <p className="text-white font-bold text-xl" style={{ fontFamily: 'var(--font-poppins)' }}>Weekly AI Digest</p>
              <span className="text-xs bg-white/20 text-white/90 rounded-full px-3 py-1 font-semibold">This week</span>
            </div>
            <ul className="space-y-2">
              {[
                'Campaign CTR is 18% above industry benchmark — consider 20% budget increase',
                '34 high-intent leads (score 80+) haven\'t been contacted — recommend immediate follow-up',
                'Email open rates dropped 12% — A/B test subject line tone (urgent vs. benefit-led)',
                'LinkedIn ads showing 3× better CPL than Meta — reallocate $800 to LinkedIn next week',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5 text-white/85 text-base">
                  <span className="text-white/50 mt-1 flex-shrink-0">→</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-7">
        {[
          { label: 'Total Revenue', value: '$48,200', change: '+22%', icon: DollarSign, gradient: 'from-emerald-400 to-teal-600' },
          { label: 'New Leads', value: '312', change: '+18%', icon: Users, gradient: 'from-blue-500 to-indigo-700' },
          { label: 'Conversions', value: '89', change: '+31%', icon: TrendingUp, gradient: 'from-violet-500 to-purple-700' },
          { label: 'Avg CPL', value: '$14.20', change: '-8%', icon: MousePointerClick, gradient: 'from-amber-400 to-orange-500' },
        ].map(s => {
          const Icon = s.icon
          return (
            <div key={s.label} className={`bg-gradient-to-br ${s.gradient} rounded-2xl p-5 text-white shadow-lg`}>
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-bold bg-white/20 rounded-full px-2.5 py-1">{s.change}</span>
              </div>
              <p className="text-4xl font-bold mb-1" style={{ fontFamily: 'var(--font-poppins)' }}>{s.value}</p>
              <p className="text-white/70 text-sm font-medium">{s.label}</p>
            </div>
          )
        })}
      </div>

      {/* Channel breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Channel Performance</h2>
          <p className="text-gray-400 dark:text-slate-500 text-sm mb-5">This month vs last month</p>
          <div className="space-y-3">
            {[
              { channel: 'Meta Ads', spend: '$4,200', conversions: 210, cpl: 20, trend: '+12%', color: 'text-emerald-600 dark:text-emerald-400' },
              { channel: 'Google Ads', spend: '$3,800', conversions: 190, cpl: 20, trend: '+8%', color: 'text-emerald-600 dark:text-emerald-400' },
              { channel: 'LinkedIn', spend: '$1,200', conversions: 48, cpl: 25, trend: '+34%', color: 'text-emerald-600 dark:text-emerald-400' },
              { channel: 'Email', spend: '$0', conversions: 124, cpl: 0, trend: '+5%', color: 'text-emerald-600 dark:text-emerald-400' },
              { channel: 'SMS', spend: '$180', conversions: 35, cpl: 5.1, trend: '+22%', color: 'text-emerald-600 dark:text-emerald-400' },
            ].map(c => (
              <div key={c.channel} className="flex items-center gap-4 p-4 rounded-xl bg-black/[0.03] dark:bg-white/[0.04] hover:bg-black/[0.05] dark:hover:bg-white/[0.07] transition-colors">
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-gray-800 dark:text-slate-100 font-semibold text-base">{c.channel}</span>
                    <span className={`text-sm font-bold ${c.color}`}>{c.trend}</span>
                  </div>
                  <div className="flex gap-5 text-sm text-gray-400 dark:text-slate-500">
                    <span>Spend: <span className="text-gray-600 dark:text-slate-300 font-medium">{c.spend}</span></span>
                    <span>Conv: <span className="text-gray-600 dark:text-slate-300 font-medium">{c.conversions}</span></span>
                    <span>CPL: <span className="text-gray-600 dark:text-slate-300 font-medium">${c.cpl}</span></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Lead Source Attribution</h2>
          <p className="text-gray-400 dark:text-slate-500 text-sm mb-5">Where leads are coming from</p>
          <div className="space-y-4">
            {[
              { source: 'Google Ads', leads: 145, pct: 46, color: 'from-blue-500 to-indigo-600' },
              { source: 'Meta Ads', leads: 89, pct: 28, color: 'from-violet-500 to-purple-600' },
              { source: 'LinkedIn', leads: 48, pct: 15, color: 'from-cyan-500 to-blue-500' },
              { source: 'Referral', leads: 23, pct: 7, color: 'from-amber-400 to-orange-500' },
              { source: 'Organic', leads: 12, pct: 4, color: 'from-emerald-400 to-teal-500' },
            ].map(s => (
              <div key={s.source}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-gray-700 dark:text-slate-200 font-semibold text-base">{s.source}</span>
                  <span className="text-gray-400 dark:text-slate-500 text-sm">{s.leads} leads <span className="text-gray-500 dark:text-slate-400 font-semibold">({s.pct}%)</span></span>
                </div>
                <div className="h-3 rounded-full bg-black/[0.06] dark:bg-white/[0.08] overflow-hidden">
                  <div className={`h-full rounded-full bg-gradient-to-r ${s.color} transition-all duration-500`} style={{ width: `${s.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
