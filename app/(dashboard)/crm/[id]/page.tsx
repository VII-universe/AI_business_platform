import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft, Mail, Phone, Globe, Linkedin, Brain,
  TrendingUp, Calendar, FileText, CheckSquare,
  MessageSquare, Clock, Star, Building2, Edit2,
} from 'lucide-react'

const LEADS: Record<string, {
  id: string; name: string; company: string; email: string; phone: string;
  website: string; score: number; stage: string; source: string; lastActivity: string;
  tags: string[]; title: string; avatar: string; dealValue: number; notes: string;
}> = {
  '1': {
    id: '1', name: 'Sarah Chen', company: 'TechFlow Inc', email: 'sarah@techflow.com',
    phone: '+1 415 555 0192', website: 'techflow.io', score: 87, stage: 'qualified',
    source: 'Google Ads', lastActivity: '2h ago', tags: ['hot lead', 'enterprise'],
    title: 'VP of Marketing', avatar: 'SC', dealValue: 24000,
    notes: 'Very interested in the brand AI module. Has a team of 12 marketers. Budget confirmed Q2. Decision by end of June.',
  },
  '2': {
    id: '2', name: 'Marcus Johnson', company: 'BuildRight Co', email: 'marcus@buildright.com',
    phone: '+1 312 555 0847', website: 'buildright.co', score: 64, stage: 'proposal',
    source: 'Referral', lastActivity: '1d ago', tags: ['interested'],
    title: 'Head of Growth', avatar: 'MJ', dealValue: 12000,
    notes: 'Referred by Jan Novák. Looking for campaign automation. Sent proposal on May 10th. Waiting for internal approval.',
  },
  '3': {
    id: '3', name: 'Priya Patel', company: 'Nova Digital', email: 'priya@novadigital.com',
    phone: '+44 20 7946 0958', website: 'novadigital.agency', score: 92, stage: 'negotiation',
    source: 'LinkedIn', lastActivity: '30m ago', tags: ['hot lead', 'decision maker'],
    title: 'CEO', avatar: 'PP', dealValue: 48000,
    notes: 'CEO-level contact. Evaluating 3 vendors. Our differentiator: AI brand generation. Price negotiation ongoing — they want annual billing.',
  },
  '4': {
    id: '4', name: 'James Wilson', company: 'Bright Media', email: 'james@brightmedia.com',
    phone: '+1 646 555 0223', website: 'brightmedia.com', score: 45, stage: 'contacted',
    source: 'Meta Ads', lastActivity: '3d ago', tags: [],
    title: 'Marketing Manager', avatar: 'JW', dealValue: 8400,
    notes: 'Cold lead from Meta ad. Responded to first email. Schedule demo pending.',
  },
  '5': {
    id: '5', name: 'Emma Torres', company: 'Summit Group', email: 'emma@summit.com',
    phone: '+34 91 555 0374', website: 'summitgroup.es', score: 71, stage: 'new',
    source: 'Website', lastActivity: '1h ago', tags: ['warm'],
    title: 'Digital Marketing Lead', avatar: 'ET', dealValue: 15600,
    notes: 'Came through the website contact form. Downloaded the AI marketing guide. Follow up within 24h.',
  },
}

const STAGE_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  new: { label: 'New', bg: 'bg-slate-100 dark:bg-white/[0.07]', text: 'text-gray-600 dark:text-slate-400' },
  contacted: { label: 'Contacted', bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-700 dark:text-blue-300' },
  qualified: { label: 'Qualified', bg: 'bg-violet-50 dark:bg-violet-900/20', text: 'text-violet-700 dark:text-violet-300' },
  proposal: { label: 'Proposal Sent', bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-700 dark:text-amber-400' },
  negotiation: { label: 'Negotiation', bg: 'bg-orange-50 dark:bg-orange-900/20', text: 'text-orange-700 dark:text-orange-400' },
  closed_won: { label: 'Won', bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-700 dark:text-emerald-300' },
}

const PIPELINE_STAGES = ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'closed_won']
const STAGE_LABELS: Record<string, string> = {
  new: 'New', contacted: 'Contacted', qualified: 'Qualified',
  proposal: 'Proposal', negotiation: 'Negotiation', closed_won: 'Won',
}

const ACTIVITY = [
  { type: 'email', text: 'Follow-up email sent', time: '2h ago', icon: Mail, color: 'text-blue-500' },
  { type: 'note', text: 'Added note: "Very interested in brand AI"', time: '1d ago', icon: FileText, color: 'text-violet-500' },
  { type: 'call', text: 'Discovery call — 28 min', time: '3d ago', icon: Phone, color: 'text-emerald-500' },
  { type: 'ai', text: 'AI scored lead: 87/100 (↑12 pts)', time: '3d ago', icon: Brain, color: 'text-amber-500' },
  { type: 'email', text: 'Initial outreach email sent', time: '5d ago', icon: Mail, color: 'text-blue-500' },
  { type: 'created', text: 'Lead created from Google Ads', time: '5d ago', icon: Star, color: 'text-gray-400' },
]

const TASKS = [
  { text: 'Send pricing proposal', due: 'Today', done: false },
  { text: 'Schedule product demo', due: 'Tomorrow', done: false },
  { text: 'Discovery call completed', due: '3d ago', done: true },
  { text: 'Send introduction email', due: '5d ago', done: true },
]

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const lead = LEADS[id] || LEADS['1']
  const stage = STAGE_CONFIG[lead.stage] || STAGE_CONFIG.new
  const stageIndex = PIPELINE_STAGES.indexOf(lead.stage)
  const scoreColor = lead.score >= 80 ? 'text-emerald-600 dark:text-emerald-400' : lead.score >= 60 ? 'text-amber-600 dark:text-amber-400' : 'text-gray-500'
  const scoreBarColor = lead.score >= 80 ? 'bg-emerald-500' : lead.score >= 60 ? 'bg-amber-500' : 'bg-gray-400'

  return (
    <div className="p-8 max-w-[1400px]">
      <Link href="/crm" className="inline-flex items-center gap-2 text-gray-400 dark:text-slate-500 hover:text-violet-600 dark:hover:text-violet-400 transition-colors text-sm font-medium mb-6 group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" /> Back to CRM
      </Link>

      {/* Header card */}
      <div className="glass p-7 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-violet-300/30 flex-shrink-0">
              {lead.avatar}
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{lead.name}</h1>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${stage.bg} ${stage.text}`}>
                  {stage.label}
                </span>
              </div>
              <p className="text-gray-500 dark:text-slate-400 text-base">{lead.title} · {lead.company}</p>
              <div className="flex items-center gap-5 mt-3">
                <a href={`mailto:${lead.email}`} className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                  <Mail className="w-4 h-4" /> {lead.email}
                </a>
                <span className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-slate-400">
                  <Phone className="w-4 h-4" /> {lead.phone}
                </span>
                <a href={`https://${lead.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                  <Globe className="w-4 h-4" /> {lead.website}
                </a>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="border-black/10 dark:border-white/10 text-gray-600 dark:text-slate-300 bg-white/60 dark:bg-white/[0.05] hover:bg-black/[0.03] text-sm h-9">
              <Edit2 className="w-4 h-4 mr-1.5" /> Edit
            </Button>
            <Button size="sm" className="bg-violet-600 hover:bg-violet-700 text-white shadow-sm text-sm h-9">
              <Mail className="w-4 h-4 mr-1.5" /> Send Email
            </Button>
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm text-sm h-9">
              <Phone className="w-4 h-4 mr-1.5" /> Call
            </Button>
          </div>
        </div>

        {/* Pipeline progress */}
        <div className="mt-7 pt-6 border-t border-black/[0.06] dark:border-white/[0.06]">
          <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-3">Pipeline Stage</p>
          <div className="flex items-center gap-0">
            {PIPELINE_STAGES.map((s, i) => {
              const isActive = i === stageIndex
              const isDone = i < stageIndex
              return (
                <div key={s} className="flex items-center flex-1">
                  <div className={`flex-1 text-center py-2 px-3 text-xs font-semibold rounded-lg transition-all ${isActive ? 'bg-violet-600 text-white shadow-md shadow-violet-300/25' : isDone ? 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400' : 'bg-black/[0.04] dark:bg-white/[0.04] text-gray-400 dark:text-slate-500'}`}>
                    {isDone ? '✓ ' : ''}{STAGE_LABELS[s]}
                  </div>
                  {i < PIPELINE_STAGES.length - 1 && (
                    <div className={`w-3 h-0.5 flex-shrink-0 ${i < stageIndex ? 'bg-emerald-400' : 'bg-black/[0.08] dark:bg-white/[0.08]'}`} />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="space-y-5">
          {/* Score */}
          <div className="glass p-5">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-5 h-5 text-violet-600 dark:text-violet-400" />
              <h3 className="text-base font-bold text-gray-900 dark:text-white">AI Lead Score</h3>
            </div>
            <div className="text-center mb-4">
              <span className={`text-6xl font-bold ${scoreColor}`} style={{ fontFamily: 'var(--font-poppins)' }}>{lead.score}</span>
              <span className="text-gray-400 dark:text-slate-500 text-lg">/100</span>
            </div>
            <div className="h-3 bg-black/[0.06] dark:bg-white/[0.08] rounded-full overflow-hidden mb-3">
              <div className={`h-full rounded-full ${scoreBarColor} transition-all`} style={{ width: `${lead.score}%` }} />
            </div>
            <div className="space-y-2 text-sm">
              {[
                { label: 'Engagement', val: 92 },
                { label: 'Company fit', val: 85 },
                { label: 'Budget signals', val: 78 },
                { label: 'Timeline', val: 70 },
              ].map(f => (
                <div key={f.label} className="flex items-center gap-3">
                  <span className="text-gray-500 dark:text-slate-400 w-24 text-xs">{f.label}</span>
                  <div className="flex-1 h-1.5 bg-black/[0.06] dark:bg-white/[0.07] rounded-full overflow-hidden">
                    <div className="h-full bg-violet-500 rounded-full" style={{ width: `${f.val}%` }} />
                  </div>
                  <span className="text-gray-600 dark:text-slate-300 text-xs font-bold w-6 text-right">{f.val}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Deal info */}
          <div className="glass p-5">
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">Deal Info</h3>
            <div className="space-y-3">
              {[
                { label: 'Deal Value', value: `$${lead.dealValue.toLocaleString('en-US')}`, color: 'text-emerald-600 dark:text-emerald-400 font-bold text-lg' },
                { label: 'Source', value: lead.source },
                { label: 'Last Activity', value: lead.lastActivity },
                { label: 'Company', value: lead.company },
              ].map(r => (
                <div key={r.label} className="flex justify-between items-start">
                  <span className="text-gray-400 dark:text-slate-500 text-sm">{r.label}</span>
                  <span className={`text-sm font-semibold text-gray-700 dark:text-slate-200 text-right ${r.color || ''}`}>{r.value}</span>
                </div>
              ))}
              <div>
                <span className="text-gray-400 dark:text-slate-500 text-sm block mb-1.5">Tags</span>
                <div className="flex flex-wrap gap-1.5">
                  {lead.tags.length > 0 ? lead.tags.map(tag => (
                    <span key={tag} className="text-xs bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-700/40 px-2.5 py-1 rounded-lg font-semibold">{tag}</span>
                  )) : <span className="text-gray-400 dark:text-slate-500 text-sm">No tags</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Tasks */}
          <div className="glass p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-gray-900 dark:text-white">Tasks</h3>
              <button className="text-xs text-violet-600 dark:text-violet-400 font-semibold hover:underline cursor-pointer">+ Add task</button>
            </div>
            <div className="space-y-2.5">
              {TASKS.map((task, i) => (
                <div key={i} className={`flex items-start gap-3 p-3 rounded-xl ${task.done ? 'opacity-50' : 'bg-black/[0.03] dark:bg-white/[0.04]'}`}>
                  <CheckSquare className={`w-4 h-4 flex-shrink-0 mt-0.5 ${task.done ? 'text-emerald-500' : 'text-gray-300 dark:text-slate-600'}`} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${task.done ? 'line-through text-gray-400 dark:text-slate-500' : 'text-gray-700 dark:text-slate-200'}`}>
                      {task.text}
                    </p>
                    <span className={`text-xs ${task.done ? 'text-gray-300 dark:text-slate-600' : 'text-amber-500 dark:text-amber-400 font-semibold'}`}>
                      {task.due}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: activity + notes */}
        <div className="lg:col-span-2 space-y-5">
          {/* Notes */}
          <div className="glass p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Notes</h3>
              <button className="text-sm text-violet-600 dark:text-violet-400 font-semibold hover:underline cursor-pointer">Edit</button>
            </div>
            <div className="bg-black/[0.03] dark:bg-white/[0.04] rounded-xl p-5 text-gray-700 dark:text-slate-200 text-base leading-relaxed border border-black/[0.04] dark:border-white/[0.05]">
              {lead.notes}
            </div>
          </div>

          {/* AI recommendation */}
          <div className="glass p-6 bg-gradient-to-br from-violet-50/80 to-indigo-50/60 dark:from-violet-950/40 dark:to-indigo-950/30">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center">
                <Brain className="w-5 h-5 text-violet-600 dark:text-violet-400" />
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">AI Next Action</h3>
              <Badge className="bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-700/40 text-xs">Recommended</Badge>
            </div>
            <p className="text-gray-600 dark:text-slate-300 text-base leading-relaxed mb-4">
              Lead has opened your last email 3× and visited the pricing page. High intent signal — send a <strong className="text-gray-900 dark:text-white">personalized case study</strong> about a similar company in their industry, then follow up with a demo call within 48h.
            </p>
            <div className="flex gap-3">
              <Button className="bg-violet-600 hover:bg-violet-700 text-white shadow-sm text-sm">
                <Mail className="w-4 h-4 mr-2" /> Send Case Study
              </Button>
              <Button variant="outline" className="border-black/10 dark:border-white/10 text-gray-600 dark:text-slate-300 bg-white/60 dark:bg-white/[0.05] text-sm">
                <Calendar className="w-4 h-4 mr-2" /> Schedule Call
              </Button>
            </div>
          </div>

          {/* Activity timeline */}
          <div className="glass p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-5">Activity Timeline</h3>
            <div className="space-y-4">
              {ACTIVITY.map((act, i) => {
                const Icon = act.icon
                return (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-9 h-9 rounded-xl bg-black/[0.04] dark:bg-white/[0.05] flex items-center justify-center flex-shrink-0 ${act.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      {i < ACTIVITY.length - 1 && <div className="w-px flex-1 bg-black/[0.06] dark:bg-white/[0.06] mt-2" />}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="text-gray-700 dark:text-slate-200 text-sm font-medium">{act.text}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <Clock className="w-3 h-3 text-gray-300 dark:text-slate-600" />
                        <span className="text-xs text-gray-400 dark:text-slate-500">{act.time}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Quick reply */}
            <div className="mt-5 pt-5 border-t border-black/[0.06] dark:border-white/[0.06]">
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Add a note or activity..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white/60 dark:bg-white/[0.05] border border-black/10 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 text-sm focus:outline-none focus:border-violet-400 backdrop-blur-sm"
                />
                <Button className="bg-violet-600 hover:bg-violet-700 text-white shadow-sm text-sm px-5">
                  <MessageSquare className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
