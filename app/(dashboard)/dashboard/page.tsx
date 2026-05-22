'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  TrendingUp, Users, Megaphone, FileText, Brain, ArrowRight,
  Sparkles, DollarSign, Target, ChevronLeft, ChevronRight,
  CheckSquare, Square, Mail, Star, ExternalLink, Zap,
  BarChart2, Globe, MessageSquare, Calendar, Heart, Award,
  Filter, X,
} from 'lucide-react'
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid,
} from 'recharts'

/* ─── Date range ────────────────────────────────────────────────── */

const DATE_RANGES = ['Today', '7 days', '30 days', '90 days'] as const
type DateRange = typeof DATE_RANGES[number]

/* ─── Revenue data ──────────────────────────────────────────────── */

const REVENUE_DATA: Record<DateRange, { label: string; mrr: number; rev: number }[]> = {
  'Today':   [
    { label: '8am', mrr: 47200, rev: 1240 }, { label: '10am', mrr: 47400, rev: 1890 },
    { label: '12pm', mrr: 47600, rev: 2310 }, { label: '2pm', mrr: 47800, rev: 2780 },
    { label: '4pm', mrr: 48000, rev: 3210 }, { label: '6pm', mrr: 48200, rev: 3640 },
  ],
  '7 days': [
    { label: 'Mon', mrr: 45800, rev: 6200 }, { label: 'Tue', mrr: 46200, rev: 7100 },
    { label: 'Wed', mrr: 46900, rev: 6800 }, { label: 'Thu', mrr: 47400, rev: 7900 },
    { label: 'Fri', mrr: 47800, rev: 8400 }, { label: 'Sat', mrr: 48000, rev: 5200 },
    { label: 'Sun', mrr: 48200, rev: 4100 },
  ],
  '30 days': [
    { label: 'W1', mrr: 42000, rev: 28400 }, { label: 'W2', mrr: 44500, rev: 31200 },
    { label: 'W3', mrr: 46800, rev: 34100 }, { label: 'W4', mrr: 48200, rev: 37800 },
  ],
  '90 days': [
    { label: 'Apr', mrr: 38000, rev: 82000 }, { label: 'May', mrr: 43000, rev: 98000 },
    { label: 'Jun', mrr: 48200, rev: 115000 },
  ],
}

/* ─── Other data ────────────────────────────────────────────────── */

const FUNNEL = [
  { label: 'Visitors',   value: 12840, pct: 100, color: '#7C3AED' },
  { label: 'Leads',      value: 847,   pct: 6.6, color: '#2563EB' },
  { label: 'Qualified',  value: 312,   pct: 2.4, color: '#059669' },
  { label: 'Proposals',  value: 89,    pct: 0.7, color: '#F59E0B' },
  { label: 'Closed',     value: 23,    pct: 0.2, color: '#E11D48' },
]

const TASKS = [
  { id: 1, text: 'Follow up with Priya Patel (score 92)', action: 'Send Email', href: '/crm/3', tag: 'CRM', urgent: true },
  { id: 2, text: 'Increase Summer Sale budget by 20%', action: 'Apply', href: '/campaigns/1', tag: 'Campaign', urgent: true },
  { id: 3, text: 'Publish "5 Ways AI Transforms Marketing"', action: 'Publish', href: '/content', tag: 'Content', urgent: false },
]

const TOP_CONTENT = [
  { title: 'Summer Sale Facebook Ad',         type: 'Ad Copy',    ctr: 5.8, clicks: 6200, href: '/content' },
  { title: '5 Ways AI Transforms Marketing',  type: 'Blog Post',  ctr: 4.2, clicks: 3400, href: '/content' },
  { title: 'Q3 LinkedIn Thought Leadership',  type: 'Social',     ctr: 3.9, clicks: 2800, href: '/content' },
  { title: 'Google Search Ad — Brand PPC',    type: 'Ad Copy',    ctr: 3.4, clicks: 2100, href: '/content' },
  { title: 'Welcome Email Sequence',          type: 'Email',      ctr: 2.8, clicks: 1600, href: '/content' },
]

const HOT_LEADS = [
  { id: '3', name: 'Priya Patel',    company: 'Nova Digital',  score: 92, since: '30m', avatar: 'PP', stage: 'Negotiation' },
  { id: '1', name: 'Sarah Chen',     company: 'TechFlow Inc',  score: 87, since: '2h',  avatar: 'SC', stage: 'Qualified' },
  { id: '5', name: 'Emma Torres',    company: 'Summit Group',  score: 71, since: '1h',  avatar: 'ET', stage: 'New' },
]

const AI_COSTS = [
  { name: 'Brand AI',    value: 8.2,  color: '#7C3AED' },
  { name: 'Content AI',  value: 6.1,  color: '#2563EB' },
  { name: 'Campaigns',   value: 3.1,  color: '#059669' },
  { name: 'CRM Score',   value: 0.4,  color: '#F59E0B' },
  { name: 'Reports',     value: 0.6,  color: '#0891B2' },
  { name: 'Other',       value: 5.0,  color: '#9CA3AF' },
]

const GOALS = [
  { label: 'Monthly Leads',    current: 847,   target: 1000,  unit: '',   color: '#7C3AED' },
  { label: 'Revenue (MRR)',    current: 48200, target: 60000, unit: '$',  color: '#059669' },
  { label: 'Content Published',current: 156,   target: 200,   unit: '',   color: '#2563EB' },
  { label: 'Campaign ROI',     current: 4.2,   target: 5.0,   unit: '×',  color: '#F59E0B' },
]

const SOCIAL_REACH = [
  { platform: 'LinkedIn',  icon: Globe,        reach: 28400, growth: +12, color: '#0A66C2' },
  { platform: 'Instagram', icon: Heart,        reach: 19200, growth: +8,  color: '#E1306C' },
  { platform: 'Twitter',   icon: MessageSquare,reach: 14700, growth: +5,  color: '#1DA1F2' },
  { platform: 'Facebook',  icon: Globe,        reach: 11300, growth: -2,  color: '#1877F2' },
]

const UPCOMING_POSTS = [
  { title: 'AI Marketing Tips #12',          platform: 'LinkedIn',  date: 'Today 14:00',    status: 'scheduled' },
  { title: 'Behind the Scenes: Our AI Lab',  platform: 'Instagram', date: 'Tomorrow 09:00', status: 'scheduled' },
  { title: 'Industry Report Thread',          platform: 'Twitter',   date: 'Thu 11:00',      status: 'draft' },
]

const INSIGHTS = [
  {
    icon: '📈', color: 'from-violet-600 to-purple-700',
    title: 'Meta CTR 18% above benchmark',
    body: 'Your Summer Sale Meta ads are outperforming industry average. Consider increasing budget by 20% to maximise ROI before June 30.',
    action: 'Increase Budget', href: '/campaigns/1',
  },
  {
    icon: '🔥', color: 'from-rose-600 to-pink-700',
    title: '34 hot leads need follow-up',
    body: 'Leads with score 80+ have been waiting over 24h. Each hour of delay reduces conversion probability by 3%. Act now.',
    action: 'View Hot Leads', href: '/crm',
  },
  {
    icon: '💰', color: 'from-emerald-600 to-teal-700',
    title: 'MRR up 12% — on track for $60k goal',
    body: 'Monthly recurring revenue reached $48,200 this month. You are 80% to your $60k MRR goal with 10 days remaining.',
    action: 'View Revenue', href: '/reports',
  },
  {
    icon: '🤖', color: 'from-blue-600 to-indigo-700',
    title: 'AI costs reduced by 8% vs last month',
    body: 'Optimised prompts and caching cut monthly AI spend from $25.40 to $23.40. Blog Post generator is the highest cost driver.',
    action: 'View Breakdown', href: '/admin/models',
  },
  {
    icon: '📣', color: 'from-amber-600 to-orange-700',
    title: 'LinkedIn reach up 12% this month',
    body: 'Thought leadership posts are performing 3× better than product posts. Recommend shifting content mix to 70% thought leadership.',
    action: 'Create Post', href: '/content',
  },
]

const ACTIVITY = [
  { action: 'Brand strategy generated',         module: 'Brand AI',   href: '/brand',     time: '2m ago',  dot: 'bg-fuchsia-500' },
  { action: 'Campaign "Summer Sale" launched',   module: 'Campaigns',  href: '/campaigns', time: '1h ago',  dot: 'bg-blue-500' },
  { action: 'Lead scoring batch completed',      module: 'CRM',        href: '/crm',       time: '3h ago',  dot: 'bg-amber-500' },
  { action: '30-day social calendar created',    module: 'Content AI', href: '/content',   time: '5h ago',  dot: 'bg-emerald-500' },
  { action: 'Email sequence deployed',           module: 'Automations',href: '/automations', time: '1d ago', dot: 'bg-cyan-500' },
  { action: 'Brand assets exported',            module: 'Brand AI',   href: '/brand',     time: '1d ago',  dot: 'bg-fuchsia-500' },
  { action: 'New hot lead: Priya Patel (92)',    module: 'CRM',        href: '/crm/3',     time: '2d ago',  dot: 'bg-amber-500' },
]

const ACTIVITY_MODULES = ['All', 'Brand AI', 'Campaigns', 'CRM', 'Content AI', 'Automations']

/* ─── Stats ─────────────────────────────────────────────────────── */

const STATS = [
  { label: 'Active Leads', value: '847', change: '+12%', sub: 'vs last week', icon: Users, gradient: 'from-violet-500 to-purple-700', glow: 'shadow-violet-200 dark:shadow-violet-900/40', href: '/crm' },
  { label: 'Campaigns', value: '12', change: '+3', sub: 'this week', icon: Megaphone, gradient: 'from-blue-500 to-indigo-700', glow: 'shadow-blue-200 dark:shadow-blue-900/40', href: '/campaigns' },
  { label: 'Content Items', value: '156', change: '+28', sub: 'this week', icon: FileText, gradient: 'from-emerald-400 to-teal-600', glow: 'shadow-emerald-200 dark:shadow-emerald-900/40', href: '/content' },
  { label: 'AI Cost (MTD)', value: '$23.40', change: '↓ 8%', sub: 'vs last month', icon: Brain, gradient: 'from-amber-400 to-orange-500', glow: 'shadow-amber-200 dark:shadow-amber-900/40', href: '/admin/models' },
]

/* ─── Campaign sparkline data ───────────────────────────────────── */

const CAMPAIGN_SPARKLINES = [
  [45, 51, 44, 55, 59, 35, 22],
  [12, 15, 11, 18, 20, 7, 6],
  [58, 54, 65, 61, 64, 71, 47],
]

/* ─── Components ────────────────────────────────────────────────── */

function PeriodTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="glass px-3 py-2 shadow-lg text-xs min-w-[120px]">
      <p className="font-bold text-gray-900 dark:text-white mb-1">{label}</p>
      {payload.map((e: any) => (
        <div key={e.name} className="flex justify-between gap-3">
          <span className="text-gray-500 dark:text-slate-400">{e.name}</span>
          <span className="font-bold text-gray-900 dark:text-white">
            {e.name === 'MRR' ? `$${e.value.toLocaleString('en-US')}` : `$${e.value.toLocaleString('en-US')}`}
          </span>
        </div>
      ))}
    </div>
  )
}

/* ─── Main page ─────────────────────────────────────────────────── */

export default function DashboardPage() {
  const [dateRange, setDateRange] = useState<DateRange>('30 days')
  const [insightIdx, setInsightIdx] = useState(0)
  const [tasks, setTasks] = useState(TASKS.map(t => ({ ...t, done: false })))
  const [activityFilter, setActivityFilter] = useState('All')
  const [sentLeads, setSentLeads] = useState<number[]>([])

  const revenueData = REVENUE_DATA[dateRange]
  const totalRevenue = revenueData.reduce((s, d) => s + d.rev, 0)
  const latestMRR = revenueData[revenueData.length - 1]?.mrr ?? 48200
  const filteredActivity = activityFilter === 'All'
    ? ACTIVITY
    : ACTIVITY.filter(a => a.module === activityFilter)
  const totalAICost = AI_COSTS.reduce((s, c) => s + c.value, 0)

  return (
    <div className="p-8 max-w-[1400px] space-y-6">

      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Good morning 👋</h1>
          <p className="text-gray-500 dark:text-slate-400 mt-1">Here's your business overview.</p>
        </div>
        {/* Date range picker */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">Period:</span>
          <div className="flex p-1 rounded-xl bg-black/[0.04] dark:bg-white/[0.05] gap-0.5">
            {DATE_RANGES.map(r => (
              <button key={r} onClick={() => setDateRange(r)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${dateRange === r ? 'bg-white dark:bg-white/[0.14] text-gray-900 dark:text-white shadow-sm' : 'text-gray-400 dark:text-slate-500 hover:text-gray-700 dark:hover:text-white'}`}>
                {r}
              </button>
            ))}
          </div>
          <Badge className="bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-700/40 text-xs font-semibold">
            ✦ Pro Plan
          </Badge>
        </div>
      </div>

      {/* ── Stat cards (clickable) ────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {STATS.map(stat => {
          const Icon = stat.icon
          return (
            <Link key={stat.label} href={stat.href}>
              <div className={`bg-gradient-to-br ${stat.gradient} rounded-2xl p-5 shadow-xl ${stat.glow} text-white relative overflow-hidden group hover:scale-[1.02] transition-all duration-200 cursor-pointer`}>
                <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-white/10 -translate-y-10 translate-x-10" />
                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xs font-bold bg-white/20 rounded-full px-2.5 py-1 flex items-center gap-1">
                      {stat.change} <ArrowRight className="w-3 h-3 opacity-60 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                  <p className="text-4xl font-bold mb-0.5">{stat.value}</p>
                  <p className="text-white/75 text-sm font-medium">{stat.label}</p>
                  <p className="text-white/45 text-xs mt-0.5">{stat.sub}</p>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* ── Row 2: Revenue + Conversion Funnel + Brand Health ────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

        {/* Revenue widget */}
        <div className="lg:col-span-2 glass p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-1">Monthly Recurring Revenue</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">${latestMRR.toLocaleString('en-US')}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-emerald-600 dark:text-emerald-400 text-sm font-bold flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> +12%
                </span>
                <span className="text-gray-400 dark:text-slate-500 text-xs">vs prev period</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-1">Period Revenue</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">${totalRevenue.toLocaleString('en-US')}</p>
            </div>
          </div>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 4, right: 0, left: -24, bottom: 0 }}>
                <defs>
                  <linearGradient id="mrrGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#7C3AED" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#7C3AED" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 6" vertical={false} stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 9, fill: '#9ca3af' }} tickLine={false} axisLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                <Tooltip content={<PeriodTooltip />} cursor={{ stroke: 'rgba(124,58,237,0.3)', strokeWidth: 1.5 }} />
                <Area type="monotone" dataKey="mrr" name="MRR" stroke="#7C3AED" fill="url(#mrrGrad)" strokeWidth={2.5} dot={false} activeDot={{ r: 4, strokeWidth: 0, fill: '#7C3AED' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <Link href="/reports" className="flex items-center gap-1.5 text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline mt-3">
            View full revenue report <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Conversion funnel */}
        <div className="lg:col-span-2 glass p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">Conversion Funnel</h3>
              <p className="text-gray-400 dark:text-slate-500 text-xs mt-0.5">{dateRange} — end-to-end</p>
            </div>
            <Badge className="text-xs bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700/30">
              1.8% close rate
            </Badge>
          </div>
          <div className="space-y-2">
            {FUNNEL.map((stage, i) => (
              <div key={stage.label} className="group">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-gray-700 dark:text-slate-200">{stage.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 dark:text-slate-500">{stage.pct}%</span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{stage.value.toLocaleString('en-US')}</span>
                  </div>
                </div>
                <div className="relative h-7 rounded-xl overflow-hidden bg-black/[0.04] dark:bg-white/[0.05]">
                  <div className="absolute inset-y-0 left-0 rounded-xl flex items-center px-3 transition-all duration-700"
                    style={{ width: `${stage.pct === 100 ? 100 : Math.max(stage.pct * 5, 8)}%`, background: `linear-gradient(to right, ${stage.color}cc, ${stage.color}88)` }}>
                    {stage.pct >= 2 && <span className="text-white text-[10px] font-bold">{stage.label}</span>}
                  </div>
                </div>
                {i < FUNNEL.length - 1 && (
                  <div className="flex justify-center my-0.5">
                    <span className="text-[10px] text-gray-300 dark:text-slate-600 font-medium">
                      ↓ {((FUNNEL[i+1].value / stage.value) * 100).toFixed(1)}% converted
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Brand Health Score */}
        <div className="lg:col-span-1 glass p-6 flex flex-col">
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">Brand Health</h3>
          <p className="text-gray-400 dark:text-slate-500 text-xs mb-5">AI brand consistency score</p>
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="relative w-28 h-28">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={[{ value: 74 }, { value: 26 }]} cx="50%" cy="50%" innerRadius={38} outerRadius={52} startAngle={90} endAngle={-270} dataKey="value" strokeWidth={0}>
                    <Cell fill="#7C3AED" />
                    <Cell fill="rgba(0,0,0,0.06)" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">74</span>
                <span className="text-[10px] text-gray-400 dark:text-slate-500 font-semibold">/100</span>
              </div>
            </div>
            <div className="w-full mt-4 space-y-1.5">
              {[
                { label: 'Visual consistency', val: 82 },
                { label: 'Voice & tone',        val: 71 },
                { label: 'Cross-channel',       val: 68 },
              ].map(item => (
                <div key={item.label}>
                  <div className="flex justify-between text-[10px] mb-0.5">
                    <span className="text-gray-500 dark:text-slate-400">{item.label}</span>
                    <span className="font-bold text-gray-700 dark:text-slate-200">{item.val}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-black/[0.06] dark:bg-white/[0.08] overflow-hidden">
                    <div className="h-full rounded-full bg-violet-500" style={{ width: `${item.val}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Link href="/brand" className="text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline mt-3 flex items-center gap-1">
            Improve brand <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* ── Row 3: Tasks + Hot Leads + AI Cost ───────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Today's tasks */}
        <div className="glass p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">Today's Priorities</h3>
              <p className="text-gray-400 dark:text-slate-500 text-xs mt-0.5">AI-suggested — {tasks.filter(t => t.done).length}/{tasks.length} done</p>
            </div>
            <Badge className="text-xs bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-700/40">
              <Sparkles className="w-3 h-3 mr-1" /> AI
            </Badge>
          </div>
          <div className="space-y-3">
            {tasks.map(task => (
              <div key={task.id} className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all ${task.done ? 'bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-200/50 dark:border-emerald-700/20 opacity-60' : 'bg-black/[0.02] dark:bg-white/[0.03] border-black/[0.06] dark:border-white/[0.06] hover:border-black/10 dark:hover:border-white/10'}`}>
                <button onClick={() => setTasks(prev => prev.map(t => t.id === task.id ? { ...t, done: !t.done } : t))} className="flex-shrink-0 mt-0.5 cursor-pointer">
                  {task.done ? <CheckSquare className="w-5 h-5 text-emerald-500" /> : <Square className="w-5 h-5 text-gray-300 dark:text-slate-600 hover:text-violet-500 transition-colors" />}
                </button>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium leading-snug ${task.done ? 'line-through text-gray-400 dark:text-slate-500' : 'text-gray-800 dark:text-slate-100'}`}>
                    {task.text}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${task.urgent ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400' : 'bg-gray-100 dark:bg-white/[0.07] text-gray-500 dark:text-slate-400'}`}>
                      {task.urgent ? '🔥 Urgent' : task.tag}
                    </span>
                  </div>
                </div>
                {!task.done && (
                  <Link href={task.href}>
                    <Button size="sm" className="bg-violet-600 text-white text-xs h-7 px-2.5 flex-shrink-0">
                      {task.action}
                    </Button>
                  </Link>
                )}
              </div>
            ))}
          </div>
          <button className="w-full mt-3 text-xs font-semibold text-gray-400 dark:text-slate-500 hover:text-violet-600 dark:hover:text-violet-400 transition-colors flex items-center justify-center gap-1.5 py-1.5 cursor-pointer">
            <Sparkles className="w-3.5 h-3.5" /> Regenerate with AI
          </button>
        </div>

        {/* Hot Leads */}
        <div className="glass p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">Hot Leads 🔥</h3>
              <p className="text-gray-400 dark:text-slate-500 text-xs mt-0.5">Score 80+ awaiting follow-up</p>
            </div>
            <Link href="/crm">
              <Button variant="ghost" size="sm" className="text-xs text-gray-400 dark:text-slate-500 hover:text-gray-700 dark:hover:text-white h-7 px-2">
                View all <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            {HOT_LEADS.map(lead => (
              <div key={lead.id} className="flex items-center gap-3 p-3.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.06] dark:border-white/[0.06] hover:border-black/10 dark:hover:border-white/10 transition-colors group">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm">
                  {lead.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <Link href={`/crm/${lead.id}`} className="text-sm font-bold text-gray-800 dark:text-slate-100 hover:text-violet-600 dark:hover:text-violet-400 transition-colors block truncate">
                    {lead.name}
                  </Link>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] text-gray-400 dark:text-slate-500">{lead.company}</span>
                    <span className="text-gray-300 dark:text-slate-600">·</span>
                    <span className="text-[11px] text-gray-400 dark:text-slate-500">{lead.stage}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <div className="text-center">
                    <div className="text-sm font-bold" style={{ color: lead.score >= 85 ? '#059669' : '#F59E0B' }}>{lead.score}</div>
                    <div className="text-[9px] text-gray-400 dark:text-slate-500">{lead.since}</div>
                  </div>
                  <button
                    onClick={() => setSentLeads(p => [...p, lead.id as any])}
                    className={`flex items-center gap-1 text-xs font-bold px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${(sentLeads as any[]).includes(lead.id) ? 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' : 'bg-violet-600 text-white hover:bg-violet-700'}`}>
                    <Mail className="w-3.5 h-3.5" />
                    {(sentLeads as any[]).includes(lead.id) ? 'Sent!' : 'Send'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Cost Breakdown */}
        <div className="glass p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">AI Cost Breakdown</h3>
              <p className="text-gray-400 dark:text-slate-500 text-xs mt-0.5">MTD — total ${totalAICost.toFixed(2)}</p>
            </div>
            <Link href="/admin/models">
              <Button variant="ghost" size="sm" className="text-xs text-gray-400 dark:text-slate-500 hover:text-gray-700 dark:hover:text-white h-7 px-2">
                Manage <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-28 h-28 flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={AI_COSTS} cx="50%" cy="50%" innerRadius={30} outerRadius={52} dataKey="value" strokeWidth={2} stroke="transparent">
                    {AI_COSTS.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => [`$${v.toFixed(2)}`, '']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-2">
              {AI_COSTS.map(item => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: item.color }} />
                    <span className="text-xs text-gray-600 dark:text-slate-300 font-medium">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 rounded-full bg-black/[0.06] dark:bg-white/[0.08] overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${(item.value / totalAICost) * 100}%`, background: item.color }} />
                    </div>
                    <span className="text-xs font-bold text-gray-700 dark:text-slate-200 w-10 text-right">${item.value.toFixed(1)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Row 4: Campaign Performance + Quick Actions ───────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Campaign Performance with sparklines */}
        <div className="lg:col-span-2 glass p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">Campaign Performance</h3>
              <p className="text-gray-400 dark:text-slate-500 text-xs mt-0.5">Active campaigns — hover for details</p>
            </div>
            <Link href="/campaigns">
              <Button variant="ghost" size="sm" className="text-xs text-gray-400 dark:text-slate-500 hover:text-gray-700 dark:hover:text-white h-7">
                All campaigns <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </Link>
          </div>
          <div className="space-y-4">
            {[
              { id: '1', name: 'Summer Sale Meta', progress: 72, spend: '$1,240', channel: 'Meta + Google', conv: 312, ctr: '5.0%', imps: '124k', color: '#7C3AED', spark: CAMPAIGN_SPARKLINES[0] },
              { id: '2', name: 'Lead Gen Q2',      progress: 30, spend: '$890',   channel: 'Google + LinkedIn', conv: 89, ctr: '4.7%', imps: '45k',  color: '#2563EB', spark: CAMPAIGN_SPARKLINES[1] },
              { id: '3', name: 'Brand Awareness',  progress: 100,spend: '$8,000', channel: 'Multi-channel', conv: 420, ctr: '3.5%', imps: '520k', color: '#F59E0B', spark: CAMPAIGN_SPARKLINES[2] },
            ].map(c => (
              <div key={c.id} className="group">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <Link href={`/campaigns/${c.id}`} className="text-sm font-semibold text-gray-800 dark:text-slate-100 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                      {c.name}
                    </Link>
                    <span className="text-[10px] text-gray-400 dark:text-slate-500 bg-black/[0.04] dark:bg-white/[0.05] px-2 py-0.5 rounded-md">{c.channel}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {/* Mini sparkline */}
                    <div className="w-16 h-6 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={c.spark.map((v, i) => ({ v, i }))}>
                          <Line type="monotone" dataKey="v" stroke={c.color} strokeWidth={1.5} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                    {/* Hover stats */}
                    <div className="hidden group-hover:flex items-center gap-2 text-[11px] text-gray-500 dark:text-slate-400 font-medium">
                      <span title="Conversions"><Target className="w-3 h-3 inline mr-0.5" />{c.conv}</span>
                      <span title="CTR">CTR {c.ctr}</span>
                      <span title="Impressions">{c.imps}</span>
                    </div>
                    <span className="text-xs font-bold text-gray-600 dark:text-slate-300">{c.spend}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2.5 bg-black/[0.05] dark:bg-white/[0.07] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${c.progress}%`, background: c.color }} />
                  </div>
                  <span className="text-xs font-bold text-gray-500 dark:text-slate-400 w-8 text-right flex-shrink-0">{c.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Content */}
        <div className="glass p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">Top Content</h3>
              <p className="text-gray-400 dark:text-slate-500 text-xs mt-0.5">By CTR this period</p>
            </div>
            <BarChart2 className="w-4 h-4 text-gray-300 dark:text-slate-600" />
          </div>
          <div className="space-y-2.5">
            {TOP_CONTENT.map((item, i) => (
              <div key={i} className="flex items-start gap-3 group">
                <div className="w-6 h-6 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400 text-[10px] font-black flex-shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <Link href={item.href} className="text-xs font-semibold text-gray-800 dark:text-slate-100 hover:text-violet-600 dark:hover:text-violet-400 transition-colors line-clamp-1 flex items-center gap-1">
                    {item.title} <ExternalLink className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                  </Link>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-gray-400 dark:text-slate-500">{item.type}</span>
                    <span className="text-gray-200 dark:text-slate-700">·</span>
                    <span className="text-[10px] text-gray-400 dark:text-slate-500">{item.clicks.toLocaleString('en-US')} clicks</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1 rounded-full bg-black/[0.06] dark:bg-white/[0.08] overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500" style={{ width: `${(item.ctr / 6) * 100}%` }} />
                    </div>
                    <span className="text-[10px] font-bold text-gray-600 dark:text-slate-300 flex-shrink-0">{item.ctr}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Link href="/content" className="flex items-center gap-1 text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline mt-3">
            View library <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* ── Row 5: Goals + Social Reach + Upcoming Posts ─────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Goal tracker */}
        <div className="glass p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">Goal Tracker</h3>
              <p className="text-gray-400 dark:text-slate-500 text-xs mt-0.5">Monthly targets</p>
            </div>
            <Target className="w-4 h-4 text-gray-300 dark:text-slate-600" />
          </div>
          <div className="space-y-4">
            {GOALS.map(g => {
              const pct = Math.min((g.current / g.target) * 100, 100)
              return (
                <div key={g.label}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-sm font-semibold text-gray-700 dark:text-slate-200">{g.label}</span>
                    <div className="text-right">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {g.unit === '$' ? `$${g.current.toLocaleString('en-US')}` : `${g.current}${g.unit}`}
                      </span>
                      <span className="text-gray-400 dark:text-slate-500 text-xs">
                        {' / '}{g.unit === '$' ? `$${g.target.toLocaleString('en-US')}` : `${g.target}${g.unit}`}
                      </span>
                    </div>
                  </div>
                  <div className="h-2.5 rounded-full bg-black/[0.05] dark:bg-white/[0.07] overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: g.color }} />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className={`text-[10px] font-bold ${pct >= 80 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                      {pct.toFixed(0)}% {pct >= 100 ? '🎉 Complete!' : pct >= 80 ? 'On track' : 'Needs focus'}
                    </span>
                    <span className="text-[10px] text-gray-400 dark:text-slate-500">
                      {g.unit === '$' ? `$${(g.target - g.current).toLocaleString('en-US')}` : `${g.target - g.current}${g.unit}`} left
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Social Reach */}
        <div className="glass p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">Social Reach</h3>
              <p className="text-gray-400 dark:text-slate-500 text-xs mt-0.5">30-day total reach</p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-gray-900 dark:text-white">73.6k</p>
              <p className="text-[10px] text-emerald-500 font-bold">+8.4%</p>
            </div>
          </div>
          <div className="space-y-3">
            {SOCIAL_REACH.map(s => {
              const Icon = s.icon
              return (
                <div key={s.platform} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${s.color}18` }}>
                    <Icon className="w-4 h-4" style={{ color: s.color }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-semibold text-gray-700 dark:text-slate-200">{s.platform}</span>
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[10px] font-bold ${s.growth >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                          {s.growth >= 0 ? '↑' : '↓'}{Math.abs(s.growth)}%
                        </span>
                        <span className="text-xs font-bold text-gray-900 dark:text-white">{s.reach.toLocaleString('en-US')}</span>
                      </div>
                    </div>
                    <div className="h-1.5 rounded-full bg-black/[0.05] dark:bg-white/[0.07] overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${(s.reach / 30000) * 100}%`, background: s.color }} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <Link href="/content" className="flex items-center gap-1 text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline mt-3">
            Social Calendar <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Upcoming Posts */}
        <div className="glass p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">Upcoming Posts</h3>
              <p className="text-gray-400 dark:text-slate-500 text-xs mt-0.5">Next scheduled content</p>
            </div>
            <Calendar className="w-4 h-4 text-gray-300 dark:text-slate-600" />
          </div>
          <div className="space-y-3 mb-4">
            {UPCOMING_POSTS.map((post, i) => (
              <div key={i} className="flex items-start gap-3 p-3.5 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.05] dark:border-white/[0.05] hover:border-violet-300 dark:hover:border-violet-700 transition-colors group cursor-pointer">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                  <Globe className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-800 dark:text-slate-100 truncate group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">{post.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-semibold text-gray-500 dark:text-slate-400">{post.platform}</span>
                    <span className="text-gray-200 dark:text-slate-700">·</span>
                    <span className="text-[10px] text-gray-400 dark:text-slate-500">{post.date}</span>
                  </div>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${post.status === 'scheduled' ? 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' : 'bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400'}`}>
                  {post.status}
                </span>
              </div>
            ))}
          </div>
          <Link href="/content">
            <Button className="w-full bg-violet-600 text-white text-xs h-9">
              <Calendar className="w-3.5 h-3.5 mr-2" /> Open Social Calendar
            </Button>
          </Link>
        </div>
      </div>

      {/* ── Activity Feed ─────────────────────────────────────────── */}
      <div className="glass p-6">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-white">Recent Activity</h3>
            <p className="text-gray-400 dark:text-slate-500 text-xs mt-0.5">Latest AI actions across all modules</p>
          </div>
          {/* Module filter */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <Filter className="w-3.5 h-3.5 text-gray-400 dark:text-slate-500" />
            {ACTIVITY_MODULES.map(mod => (
              <button key={mod} onClick={() => setActivityFilter(mod)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${activityFilter === mod ? 'bg-violet-600 text-white shadow-sm' : 'bg-black/[0.04] dark:bg-white/[0.05] text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-white'}`}>
                {mod}
              </button>
            ))}
            {activityFilter !== 'All' && (
              <button onClick={() => setActivityFilter('All')} className="text-gray-300 dark:text-slate-600 hover:text-gray-600 dark:hover:text-white cursor-pointer">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filteredActivity.slice(0, 8).map((item, i) => (
            <Link key={i} href={item.href}>
              <div className="flex items-start gap-2.5 p-3 rounded-xl hover:bg-black/[0.03] dark:hover:bg-white/[0.04] transition-colors group cursor-pointer">
                <div className={`w-2 h-2 rounded-full ${item.dot} mt-1.5 flex-shrink-0`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-700 dark:text-slate-200 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors leading-snug">{item.action}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-[10px] font-semibold text-gray-500 dark:text-slate-500 bg-black/[0.04] dark:bg-white/[0.06] px-1.5 py-0.5 rounded-md">{item.module}</span>
                    <span className="text-[10px] text-gray-400 dark:text-slate-600">{item.time}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Insights Carousel ─────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl">
        <div className={`bg-gradient-to-r ${INSIGHTS[insightIdx].color} p-7 shadow-xl relative`}>
          <div className="absolute right-0 top-0 w-80 h-full opacity-10 pointer-events-none">
            <div className="w-64 h-64 rounded-full bg-white absolute -right-16 -top-16" />
            <div className="w-40 h-40 rounded-full bg-white absolute right-24 top-20" />
          </div>
          <div className="relative flex items-start gap-5">
            <div className="text-4xl flex-shrink-0">{INSIGHTS[insightIdx].icon}</div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <p className="text-white font-bold text-xl">{INSIGHTS[insightIdx].title}</p>
                <span className="text-xs bg-white/20 text-white/90 rounded-full px-2.5 py-1 font-semibold">
                  AI Insight {insightIdx + 1}/{INSIGHTS.length}
                </span>
              </div>
              <p className="text-white/80 text-base leading-relaxed">{INSIGHTS[insightIdx].body}</p>
            </div>
            <div className="flex flex-col gap-2 flex-shrink-0">
              <Link href={INSIGHTS[insightIdx].href}>
                <Button size="sm" className="bg-white text-gray-900 hover:bg-white/90 font-bold text-xs h-9 px-4 whitespace-nowrap">
                  {INSIGHTS[insightIdx].action} <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </Link>
              <div className="flex gap-1.5 justify-center mt-1">
                {INSIGHTS.map((_, i) => (
                  <button key={i} onClick={() => setInsightIdx(i)}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${insightIdx === i ? 'bg-white w-6' : 'bg-white/40 w-1.5 hover:bg-white/60'}`} />
                ))}
              </div>
            </div>
          </div>
          {/* Nav arrows */}
          <button onClick={() => setInsightIdx(i => (i - 1 + INSIGHTS.length) % INSIGHTS.length)}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white cursor-pointer transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={() => setInsightIdx(i => (i + 1) % INSIGHTS.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white cursor-pointer transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

