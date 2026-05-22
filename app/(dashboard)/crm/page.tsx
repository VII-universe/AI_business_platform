'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Users, Search, Phone, Mail, Plus, Filter, Brain, X, Columns3, List, ChevronRight } from 'lucide-react'

type Lead = {
  id: string; name: string; company: string; email: string
  score: number; stage: string; source: string; lastActivity: string; tags: string[]
}

const INITIAL_LEADS: Lead[] = [
  { id: '1', name: 'Sarah Chen', company: 'TechFlow Inc', email: 'sarah@techflow.com', score: 87, stage: 'qualified', source: 'Google Ads', lastActivity: '2h ago', tags: ['hot lead', 'enterprise'] },
  { id: '2', name: 'Marcus Johnson', company: 'BuildRight Co', email: 'marcus@buildright.com', score: 64, stage: 'proposal', source: 'Referral', lastActivity: '1d ago', tags: ['interested'] },
  { id: '3', name: 'Priya Patel', company: 'Nova Digital', email: 'priya@novadigital.com', score: 92, stage: 'negotiation', source: 'LinkedIn', lastActivity: '30m ago', tags: ['hot lead', 'decision maker'] },
  { id: '4', name: 'James Wilson', company: 'Bright Media', email: 'james@brightmedia.com', score: 45, stage: 'contacted', source: 'Meta Ads', lastActivity: '3d ago', tags: [] },
  { id: '5', name: 'Emma Torres', company: 'Summit Group', email: 'emma@summit.com', score: 71, stage: 'new', source: 'Website', lastActivity: '1h ago', tags: ['warm'] },
]

const STAGES = ['new', 'contacted', 'qualified', 'proposal', 'negotiation', 'closed_won'] as const

const STAGE_CONFIG: Record<string, { label: string; bg: string; text: string; dot: string; kanbanColor: string }> = {
  new: { label: 'New', bg: 'bg-slate-100 dark:bg-white/[0.07]', text: 'text-gray-600 dark:text-slate-400', dot: 'bg-slate-400', kanbanColor: 'border-t-slate-400' },
  contacted: { label: 'Contacted', bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-700 dark:text-blue-300', dot: 'bg-blue-500', kanbanColor: 'border-t-blue-500' },
  qualified: { label: 'Qualified', bg: 'bg-violet-50 dark:bg-violet-900/20', text: 'text-violet-700 dark:text-violet-300', dot: 'bg-violet-500', kanbanColor: 'border-t-violet-500' },
  proposal: { label: 'Proposal', bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-700 dark:text-amber-400', dot: 'bg-amber-500', kanbanColor: 'border-t-amber-500' },
  negotiation: { label: 'Negotiation', bg: 'bg-orange-50 dark:bg-orange-900/20', text: 'text-orange-700 dark:text-orange-400', dot: 'bg-orange-500', kanbanColor: 'border-t-orange-500' },
  closed_won: { label: 'Won ✓', bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-700 dark:text-emerald-300', dot: 'bg-emerald-500', kanbanColor: 'border-t-emerald-500' },
}

function ScoreBar({ score }: { score: number }) {
  const color = score >= 80 ? 'bg-emerald-500' : score >= 60 ? 'bg-amber-500' : 'bg-slate-400'
  const textColor = score >= 80 ? 'text-emerald-600 dark:text-emerald-400' : score >= 60 ? 'text-amber-600 dark:text-amber-400' : 'text-gray-500'
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-20 h-2 rounded-full bg-black/[0.06] dark:bg-white/[0.08] overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className={`text-sm font-bold ${textColor}`}>{score}</span>
    </div>
  )
}

export default function CRMPage() {
  const [leads, setLeads] = useState<Lead[]>(INITIAL_LEADS)
  const [search, setSearch] = useState('')
  const [view, setView] = useState<'list' | 'kanban'>('list')
  const [showAddModal, setShowAddModal] = useState(false)
  const [filterStage, setFilterStage] = useState('all')

  // Add lead form state
  const [form, setForm] = useState({ name: '', company: '', email: '', phone: '', stage: 'new', source: 'Website' })

  function handleAdd() {
    if (!form.name || !form.email) return
    const newLead: Lead = {
      id: String(Date.now()),
      name: form.name,
      company: form.company,
      email: form.email,
      score: Math.floor(Math.random() * 40) + 30,
      stage: form.stage,
      source: form.source,
      lastActivity: 'just now',
      tags: [],
    }
    setLeads(prev => [newLead, ...prev])
    setShowAddModal(false)
    setForm({ name: '', company: '', email: '', phone: '', stage: 'new', source: 'Website' })
  }

  function moveStage(leadId: string, stage: string) {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, stage } : l))
  }

  const filtered = leads.filter(l => {
    const matchSearch = l.name.toLowerCase().includes(search.toLowerCase()) || l.company.toLowerCase().includes(search.toLowerCase())
    const matchStage = filterStage === 'all' || l.stage === filterStage
    return matchSearch && matchStage
  })

  const statCards = [
    { label: 'Total Leads', value: leads.length.toString(), sub: `+${Math.floor(leads.length * 0.1)} this week`, gradient: 'from-amber-400 to-orange-500' },
    { label: 'Hot Leads (80+)', value: leads.filter(l => l.score >= 80).length.toString(), sub: `${Math.round(leads.filter(l => l.score >= 80).length / leads.length * 100)}% of total`, gradient: 'from-red-400 to-rose-600' },
    { label: 'Pipeline Value', value: '$284K', sub: 'estimated', gradient: 'from-emerald-400 to-teal-600' },
    { label: 'Avg Score', value: Math.round(leads.reduce((s, l) => s + l.score, 0) / leads.length).toString(), sub: 'across all leads', gradient: 'from-violet-500 to-purple-700' },
  ]

  return (
    <div className="p-8 max-w-[1400px]">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-300/40 dark:shadow-amber-900/30 flex-shrink-0">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">CRM & Leads</h1>
            <p className="text-gray-500 dark:text-slate-400 text-lg mt-1">AI-scored leads and pipeline management</p>
          </div>
        </div>
        <Button onClick={() => setShowAddModal(true)} className="bg-violet-600 hover:bg-violet-700 text-white shadow-md shadow-violet-300/30 text-base h-11 px-6">
          <Plus className="w-5 h-5 mr-2" /> Add Lead
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-7">
        {statCards.map(s => (
          <div key={s.label} className={`bg-gradient-to-br ${s.gradient} rounded-2xl p-5 text-white shadow-lg`}>
            <p className="text-4xl font-bold mb-1" style={{ fontFamily: 'var(--font-poppins)' }}>{s.value}</p>
            <p className="text-white/80 text-sm font-semibold">{s.label}</p>
            <p className="text-white/50 text-xs mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-48 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search leads..."
            className="pl-10 bg-white/70 dark:bg-white/[0.06] border-white/80 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 backdrop-blur-xl text-base h-11 rounded-xl" />
        </div>

        <select value={filterStage} onChange={e => setFilterStage(e.target.value)}
          className="px-4 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/[0.06] text-gray-700 dark:text-slate-200 text-sm font-medium backdrop-blur-xl focus:outline-none focus:border-violet-400 cursor-pointer h-11">
          <option value="all">All Stages</option>
          {STAGES.map(s => <option key={s} value={s}>{STAGE_CONFIG[s].label}</option>)}
        </select>

        <Button variant="outline" className="border-black/10 dark:border-white/10 text-gray-600 dark:text-slate-300 bg-white/70 dark:bg-white/[0.06] hover:bg-black/[0.04] backdrop-blur-xl h-11 px-5 text-sm">
          <Brain className="w-4 h-4 mr-2" /> AI Score All
        </Button>

        {/* View toggle */}
        <div className="flex border border-black/10 dark:border-white/10 rounded-xl overflow-hidden bg-white/70 dark:bg-white/[0.06] backdrop-blur-xl">
          <button onClick={() => setView('list')} className={`flex items-center gap-2 px-4 h-11 text-sm font-medium transition-colors cursor-pointer ${view === 'list' ? 'bg-violet-600 text-white' : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-white'}`}>
            <List className="w-4 h-4" /> List
          </button>
          <button onClick={() => setView('kanban')} className={`flex items-center gap-2 px-4 h-11 text-sm font-medium transition-colors cursor-pointer ${view === 'kanban' ? 'bg-violet-600 text-white' : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-white'}`}>
            <Columns3 className="w-4 h-4" /> Kanban
          </button>
        </div>
      </div>

      {/* LIST VIEW */}
      {view === 'list' && (
        <div className="glass overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-black/[0.06] dark:border-white/[0.06]">
                  {['Lead', 'Stage', 'Score', 'Source', 'Tags', 'Last Activity', ''].map(h => (
                    <th key={h} className="text-left px-5 py-4 text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((lead, i) => {
                  const stage = STAGE_CONFIG[lead.stage]
                  return (
                    <tr key={lead.id} className={`hover:bg-black/[0.03] dark:hover:bg-white/[0.04] transition-colors ${i < filtered.length - 1 ? 'border-b border-black/[0.04] dark:border-white/[0.04]' : ''}`}>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-9 h-9 flex-shrink-0">
                            <AvatarFallback className="bg-gradient-to-br from-violet-400 to-purple-600 text-white text-xs font-bold">
                              {lead.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <Link href={`/crm/${lead.id}`} className="text-gray-900 dark:text-white font-semibold text-sm hover:text-violet-600 dark:hover:text-violet-400 transition-colors">
                              {lead.name}
                            </Link>
                            <p className="text-gray-400 dark:text-slate-500 text-xs">{lead.company}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <select value={lead.stage} onChange={e => moveStage(lead.id, e.target.value)}
                          className={`text-xs font-semibold px-2.5 py-1 rounded-lg border cursor-pointer focus:outline-none ${stage.bg} ${stage.text} border-transparent`}>
                          {STAGES.map(s => <option key={s} value={s}>{STAGE_CONFIG[s].label}</option>)}
                        </select>
                      </td>
                      <td className="px-5 py-4"><ScoreBar score={lead.score} /></td>
                      <td className="px-5 py-4"><span className="text-gray-500 dark:text-slate-400 text-sm">{lead.source}</span></td>
                      <td className="px-5 py-4">
                        <div className="flex gap-1.5 flex-wrap">
                          {lead.tags.map(tag => (
                            <span key={tag} className="text-xs bg-black/[0.05] dark:bg-white/[0.07] text-gray-600 dark:text-slate-300 px-2.5 py-1 rounded-lg font-medium">{tag}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-gray-400 dark:text-slate-500 text-sm">{lead.lastActivity}</td>
                      <td className="px-5 py-4">
                        <div className="flex gap-1">
                          <button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 dark:text-slate-500 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors cursor-pointer">
                            <Mail className="w-4 h-4" />
                          </button>
                          <button className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 dark:text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors cursor-pointer">
                            <Phone className="w-4 h-4" />
                          </button>
                          <Link href={`/crm/${lead.id}`} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 dark:text-slate-500 hover:text-gray-700 dark:hover:text-white hover:bg-black/[0.05] dark:hover:bg-white/[0.07] transition-colors">
                            <ChevronRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* KANBAN VIEW */}
      {view === 'kanban' && (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {STAGES.map(stage => {
            const cfg = STAGE_CONFIG[stage]
            const stageLeads = filtered.filter(l => l.stage === stage)
            return (
              <div key={stage} className="flex-shrink-0 w-64">
                <div className={`glass border-t-4 ${cfg.kanbanColor} overflow-hidden`}>
                  <div className="px-4 py-3 border-b border-black/[0.05] dark:border-white/[0.05]">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-800 dark:text-slate-200 text-sm">{cfg.label}</span>
                      <span className="text-xs bg-black/[0.06] dark:bg-white/[0.08] text-gray-500 dark:text-slate-400 rounded-full px-2 py-0.5 font-semibold">{stageLeads.length}</span>
                    </div>
                  </div>
                  <div className="p-3 space-y-2.5 min-h-32">
                    {stageLeads.map(lead => (
                      <Link key={lead.id} href={`/crm/${lead.id}`}>
                        <div className="p-3.5 rounded-xl bg-white/60 dark:bg-white/[0.06] border border-black/[0.06] dark:border-white/[0.07] hover:border-violet-300 dark:hover:border-violet-600 transition-all cursor-pointer group">
                          <div className="flex items-center gap-2.5 mb-2">
                            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                              {lead.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-gray-800 dark:text-slate-200 font-semibold text-xs truncate group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">{lead.name}</p>
                              <p className="text-gray-400 dark:text-slate-500 text-[11px] truncate">{lead.company}</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <div className={`w-1.5 h-1.5 rounded-full ${lead.score >= 80 ? 'bg-emerald-500' : lead.score >= 60 ? 'bg-amber-500' : 'bg-gray-400'}`} />
                              <span className={`text-xs font-bold ${lead.score >= 80 ? 'text-emerald-600 dark:text-emerald-400' : lead.score >= 60 ? 'text-amber-600 dark:text-amber-400' : 'text-gray-500'}`}>{lead.score}</span>
                            </div>
                            <span className="text-[11px] text-gray-400 dark:text-slate-500">{lead.lastActivity}</span>
                          </div>
                          {lead.tags.length > 0 && (
                            <div className="flex gap-1 mt-2 flex-wrap">
                              {lead.tags.slice(0, 2).map(tag => (
                                <span key={tag} className="text-[10px] bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 px-1.5 py-0.5 rounded-md font-medium">{tag}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      </Link>
                    ))}
                    {stageLeads.length === 0 && (
                      <div className="flex items-center justify-center h-20 text-gray-300 dark:text-slate-700 text-sm">
                        No leads
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ADD LEAD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="relative w-full max-w-lg glass rounded-3xl shadow-2xl">
            <div className="flex items-center justify-between p-7 border-b border-black/[0.06] dark:border-white/[0.06]">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Lead</h2>
              <button onClick={() => setShowAddModal(false)} className="w-9 h-9 rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/[0.05] flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-7 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-700 dark:text-slate-200 text-sm font-semibold mb-1.5 block">Full Name *</Label>
                  <Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Jana Nováková"
                    className="bg-white/60 dark:bg-white/[0.05] border-black/10 dark:border-white/10 text-gray-900 dark:text-white text-base h-11 focus:border-violet-400 backdrop-blur-sm" />
                </div>
                <div>
                  <Label className="text-gray-700 dark:text-slate-200 text-sm font-semibold mb-1.5 block">Company</Label>
                  <Input value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} placeholder="Company s.r.o."
                    className="bg-white/60 dark:bg-white/[0.05] border-black/10 dark:border-white/10 text-gray-900 dark:text-white text-base h-11 focus:border-violet-400 backdrop-blur-sm" />
                </div>
              </div>
              <div>
                <Label className="text-gray-700 dark:text-slate-200 text-sm font-semibold mb-1.5 block">Email *</Label>
                <Input value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="jana@company.cz" type="email"
                  className="bg-white/60 dark:bg-white/[0.05] border-black/10 dark:border-white/10 text-gray-900 dark:text-white text-base h-11 focus:border-violet-400 backdrop-blur-sm" />
              </div>
              <div>
                <Label className="text-gray-700 dark:text-slate-200 text-sm font-semibold mb-1.5 block">Phone</Label>
                <Input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="+420 777 000 000"
                  className="bg-white/60 dark:bg-white/[0.05] border-black/10 dark:border-white/10 text-gray-900 dark:text-white text-base h-11 focus:border-violet-400 backdrop-blur-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-700 dark:text-slate-200 text-sm font-semibold mb-1.5 block">Stage</Label>
                  <select value={form.stage} onChange={e => setForm(p => ({ ...p, stage: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/[0.05] text-gray-900 dark:text-white text-sm focus:outline-none focus:border-violet-400 cursor-pointer h-11 backdrop-blur-sm">
                    {STAGES.map(s => <option key={s} value={s}>{STAGE_CONFIG[s].label}</option>)}
                  </select>
                </div>
                <div>
                  <Label className="text-gray-700 dark:text-slate-200 text-sm font-semibold mb-1.5 block">Source</Label>
                  <select value={form.source} onChange={e => setForm(p => ({ ...p, source: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/[0.05] text-gray-900 dark:text-white text-sm focus:outline-none focus:border-violet-400 cursor-pointer h-11 backdrop-blur-sm">
                    {['Website', 'Google Ads', 'Meta Ads', 'LinkedIn', 'Referral', 'Email', 'Other'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-3 p-7 pt-0">
              <Button variant="ghost" onClick={() => setShowAddModal(false)} className="text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-white flex-1">Cancel</Button>
              <Button onClick={handleAdd} disabled={!form.name || !form.email} className="bg-violet-600 hover:bg-violet-700 text-white shadow-md shadow-violet-300/20 flex-1 disabled:opacity-50">
                <Plus className="w-4 h-4 mr-2" /> Add Lead
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
