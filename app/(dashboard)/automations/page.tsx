'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import {
  Zap, Plus, GitBranch, Mail, MessageSquare, Brain, Timer,
  Users, Edit2, Trash2, X, ChevronRight, Check, ArrowRight,
  Phone, Star, FileText, Calendar, BarChart2,
} from 'lucide-react'

type Step = { id: string; type: string; label: string; config?: string }
type Automation = {
  id: string; name: string; active: boolean; trigger: string; triggerId: string;
  runs: number; lastRun: string; steps: Step[]
}

const TRIGGERS = [
  { id: 'new_lead', label: 'New Lead Added', icon: Users, desc: 'Fires when a new lead enters the CRM', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  { id: 'missed_call', label: 'Missed Call', icon: Phone, desc: 'Fires when a call goes unanswered', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
  { id: 'lead_score', label: 'Lead Score Threshold', icon: Star, desc: 'Fires when a lead score crosses a threshold', color: 'text-violet-500', bg: 'bg-violet-50 dark:bg-violet-900/20' },
  { id: 'stage_change', label: 'Deal Stage Changed', icon: GitBranch, desc: 'Fires when a lead moves to a new stage', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
  { id: 'form_submit', label: 'Form Submission', icon: FileText, desc: 'Fires on website or landing page form submit', color: 'text-cyan-500', bg: 'bg-cyan-50 dark:bg-cyan-900/20' },
  { id: 'schedule', label: 'Scheduled (Cron)', icon: Calendar, desc: 'Fires on a recurring schedule you define', color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/20' },
  { id: 'campaign_event', label: 'Campaign Event', icon: BarChart2, desc: 'Fires on campaign milestones or budget alerts', color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
]

const ACTION_TYPES = [
  { id: 'send_email', label: 'Send Email', icon: Mail, color: 'text-blue-500' },
  { id: 'send_sms', label: 'Send SMS', icon: MessageSquare, color: 'text-emerald-500' },
  { id: 'wait', label: 'Wait / Delay', icon: Timer, color: 'text-amber-500' },
  { id: 'ai_action', label: 'AI Action', icon: Brain, color: 'text-violet-500' },
  { id: 'create_task', label: 'Create Task', icon: FileText, color: 'text-cyan-500' },
  { id: 'notify_team', label: 'Notify Team', icon: Users, color: 'text-rose-500' },
]

const INITIAL_AUTOMATIONS: Automation[] = [
  {
    id: '1', name: 'New Lead Welcome Sequence', active: true,
    trigger: 'New lead added', triggerId: 'new_lead', runs: 234, lastRun: '5m ago',
    steps: [
      { id: 's1', type: 'wait', label: 'Wait 0 min' },
      { id: 's2', type: 'send_email', label: 'Send Welcome Email', config: 'Subject: Welcome to AIPlatform!' },
      { id: 's3', type: 'wait', label: 'Wait 24h' },
      { id: 's4', type: 'send_sms', label: 'Send SMS follow-up', config: 'Hi {name}, did you get a chance to look at your dashboard?' },
      { id: 's5', type: 'ai_action', label: 'AI: Score & tag lead' },
    ],
  },
  {
    id: '2', name: 'Missed Call Text-Back', active: true,
    trigger: 'Missed call detected', triggerId: 'missed_call', runs: 89, lastRun: '1h ago',
    steps: [
      { id: 's1', type: 'send_sms', label: 'Send SMS instantly', config: 'Sorry we missed your call! Reply to book a callback.' },
      { id: 's2', type: 'create_task', label: 'Create CRM task', config: 'Follow up on missed call within 2h' },
      { id: 's3', type: 'notify_team', label: 'Notify team', config: 'Slack #sales channel' },
    ],
  },
  {
    id: '3', name: 'Deal Stage AI Analyzer', active: true,
    trigger: 'Deal stage changed', triggerId: 'stage_change', runs: 56, lastRun: '3h ago',
    steps: [
      { id: 's1', type: 'ai_action', label: 'AI: Analyze deal context' },
      { id: 's2', type: 'ai_action', label: 'AI: Recommend next action' },
      { id: 's3', type: 'create_task', label: 'Create task from AI advice' },
    ],
  },
  {
    id: '4', name: 'Monthly Reporting Digest', active: false,
    trigger: 'Schedule: 1st of month', triggerId: 'schedule', runs: 3, lastRun: '30d ago',
    steps: [
      { id: 's1', type: 'ai_action', label: 'AI: Generate digest' },
      { id: 's2', type: 'send_email', label: 'Send email to team', config: 'Monthly AI digest report' },
    ],
  },
]

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  send_email: Mail, send_sms: MessageSquare, wait: Timer,
  ai_action: Brain, create_task: FileText, notify_team: Users,
}
const COLOR_MAP: Record<string, string> = {
  send_email: 'text-blue-500', send_sms: 'text-emerald-500', wait: 'text-amber-500',
  ai_action: 'text-violet-500', create_task: 'text-cyan-500', notify_team: 'text-rose-500',
}
const STEP_BG: Record<string, string> = {
  send_email: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700/40',
  send_sms: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-700/40',
  wait: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700/40',
  ai_action: 'bg-violet-50 dark:bg-violet-900/20 border-violet-200 dark:border-violet-700/40',
  create_task: 'bg-cyan-50 dark:bg-cyan-900/20 border-cyan-200 dark:border-cyan-700/40',
  notify_team: 'bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-700/40',
}

export default function AutomationsPage() {
  const [automations, setAutomations] = useState<Automation[]>(INITIAL_AUTOMATIONS)
  const [showWizard, setShowWizard] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [wizardStep, setWizardStep] = useState(1)
  const [selectedTrigger, setSelectedTrigger] = useState<string | null>(null)
  const [draftSteps, setDraftSteps] = useState<Step[]>([])
  const [draftName, setDraftName] = useState('')
  const [editName, setEditName] = useState('')

  function toggleActive(id: string) {
    setAutomations(prev => prev.map(a => a.id === id ? { ...a, active: !a.active } : a))
  }

  function deleteAutomation(id: string) {
    setAutomations(prev => prev.filter(a => a.id !== id))
  }

  function startEdit(auto: Automation) {
    setEditingId(auto.id)
    setEditName(auto.name)
  }

  function saveEdit(id: string) {
    setAutomations(prev => prev.map(a => a.id === id ? { ...a, name: editName } : a))
    setEditingId(null)
  }

  function addDraftStep(type: string) {
    const action = ACTION_TYPES.find(a => a.id === type)!
    setDraftSteps(prev => [...prev, { id: `s${Date.now()}`, type, label: action.label }])
  }

  function removeDraftStep(id: string) {
    setDraftSteps(prev => prev.filter(s => s.id !== id))
  }

  function saveWizard() {
    if (!selectedTrigger || !draftName) return
    const trigger = TRIGGERS.find(t => t.id === selectedTrigger)!
    const newAuto: Automation = {
      id: String(Date.now()),
      name: draftName,
      active: true,
      trigger: trigger.label,
      triggerId: selectedTrigger,
      runs: 0,
      lastRun: 'Never',
      steps: draftSteps,
    }
    setAutomations(prev => [newAuto, ...prev])
    setShowWizard(false)
    setWizardStep(1)
    setSelectedTrigger(null)
    setDraftSteps([])
    setDraftName('')
  }

  const activeCount = automations.filter(a => a.active).length
  const totalRuns = automations.reduce((s, a) => s + a.runs, 0)

  return (
    <div className="p-8 max-w-[1400px]">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-300/40 dark:shadow-cyan-900/30 flex-shrink-0">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Automations</h1>
            <p className="text-gray-500 dark:text-slate-400 text-lg mt-1">Visual workflow builder with AI decision nodes</p>
          </div>
        </div>
        <Button onClick={() => { setShowWizard(true); setWizardStep(1) }}
          className="bg-violet-600 hover:bg-violet-700 text-white shadow-md shadow-violet-300/30 text-base h-11 px-6">
          <Plus className="w-5 h-5 mr-2" /> New Automation
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-7">
        {[
          { label: 'Active Automations', value: activeCount.toString(), gradient: 'from-cyan-400 to-blue-600' },
          { label: 'Total Runs This Month', value: totalRuns.toLocaleString('en-US'), gradient: 'from-violet-500 to-purple-700' },
          { label: 'Hours Saved', value: '47h', gradient: 'from-emerald-400 to-teal-600' },
        ].map(s => (
          <div key={s.label} className={`bg-gradient-to-br ${s.gradient} rounded-2xl p-6 text-white shadow-lg`}>
            <p className="text-5xl font-bold mb-1" style={{ fontFamily: 'var(--font-poppins)' }}>{s.value}</p>
            <p className="text-white/75 text-base font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Automation cards */}
      <div className="space-y-4">
        {automations.map(auto => {
          const TriggerIcon = TRIGGERS.find(t => t.id === auto.triggerId)?.icon || Zap
          const isEditing = editingId === auto.id
          return (
            <div key={auto.id} className="glass p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${auto.active ? 'bg-cyan-50 dark:bg-cyan-900/20' : 'bg-gray-100 dark:bg-white/[0.07]'}`}>
                    <TriggerIcon className={`w-5 h-5 ${auto.active ? 'text-cyan-600 dark:text-cyan-400' : 'text-gray-400 dark:text-slate-500'}`} />
                  </div>
                  <div className="flex-1">
                    {isEditing ? (
                      <div className="flex items-center gap-3 mb-1">
                        <Input value={editName} onChange={e => setEditName(e.target.value)}
                          className="bg-white/60 dark:bg-white/[0.05] border-black/10 dark:border-white/10 text-gray-900 dark:text-white h-9 text-base font-bold focus:border-violet-400 max-w-sm" />
                        <Button size="sm" onClick={() => saveEdit(auto.id)} className="bg-violet-600 hover:bg-violet-700 text-white h-9 px-4">
                          <Check className="w-4 h-4 mr-1" /> Save
                        </Button>
                        <button onClick={() => setEditingId(null)} className="text-gray-400 hover:text-gray-700 dark:hover:text-white cursor-pointer">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{auto.name}</h3>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${auto.active ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300' : 'bg-gray-100 dark:bg-white/[0.07] text-gray-500 dark:text-slate-400'}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${auto.active ? 'bg-emerald-500' : 'bg-gray-400 dark:bg-slate-500'}`} />
                          {auto.active ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-4 text-sm text-gray-400 dark:text-slate-500">
                      <span>Trigger: <span className="text-gray-600 dark:text-slate-300 font-medium">{auto.trigger}</span></span>
                      <span>·</span>
                      <span><span className="text-gray-700 dark:text-slate-200 font-bold">{auto.runs}</span> runs</span>
                      <span>·</span>
                      <span>Last: <span className="text-gray-600 dark:text-slate-300">{auto.lastRun}</span></span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                  <Switch checked={auto.active} onCheckedChange={() => toggleActive(auto.id)} className="data-[state=checked]:bg-violet-600" />
                  <button onClick={() => startEdit(auto)} className="w-8 h-8 rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/[0.05] flex items-center justify-center text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors cursor-pointer">
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => deleteAutomation(auto.id)} className="w-8 h-8 rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/[0.05] flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors cursor-pointer">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Steps */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 pl-14">
                {auto.steps.map((step, i) => {
                  const Icon = ICON_MAP[step.type] || GitBranch
                  return (
                    <div key={step.id} className="flex items-center gap-2 flex-shrink-0">
                      <div className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-sm font-medium ${STEP_BG[step.type] || 'bg-black/[0.03] dark:bg-white/[0.05] border-black/[0.07] dark:border-white/[0.08]'} ${COLOR_MAP[step.type] || 'text-gray-600 dark:text-slate-300'}`}>
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-slate-200 whitespace-nowrap">{step.label}</span>
                      </div>
                      {i < auto.steps.length - 1 && <ArrowRight className="w-4 h-4 text-gray-300 dark:text-slate-600 flex-shrink-0" />}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {/* === WIZARD MODAL === */}
      {showWizard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm" onClick={() => setShowWizard(false)} />
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto glass rounded-3xl shadow-2xl">
            {/* Wizard header */}
            <div className="flex items-center justify-between p-7 border-b border-black/[0.06] dark:border-white/[0.06]">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">New Automation</h2>
                <p className="text-gray-400 dark:text-slate-500 text-sm mt-0.5">Step {wizardStep} of 3</p>
              </div>
              <button onClick={() => setShowWizard(false)} className="w-9 h-9 rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/[0.05] flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Step indicators */}
            <div className="flex gap-2 px-7 pt-5">
              {['Trigger', 'Actions', 'Name & Save'].map((s, i) => (
                <div key={s} className="flex items-center gap-2 flex-1">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${wizardStep > i + 1 ? 'bg-emerald-500 text-white' : wizardStep === i + 1 ? 'bg-violet-600 text-white' : 'bg-black/[0.06] dark:bg-white/[0.08] text-gray-400 dark:text-slate-500'}`}>
                    {wizardStep > i + 1 ? <Check className="w-4 h-4" /> : i + 1}
                  </div>
                  <span className={`text-sm font-medium ${wizardStep === i + 1 ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-slate-500'}`}>{s}</span>
                  {i < 2 && <div className={`flex-1 h-px ${wizardStep > i + 1 ? 'bg-emerald-400' : 'bg-black/[0.08] dark:bg-white/[0.08]'}`} />}
                </div>
              ))}
            </div>

            <div className="p-7">
              {/* Step 1: Trigger */}
              {wizardStep === 1 && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Choose a Trigger</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {TRIGGERS.map(trigger => {
                      const Icon = trigger.icon
                      const selected = selectedTrigger === trigger.id
                      return (
                        <button key={trigger.id} onClick={() => setSelectedTrigger(trigger.id)}
                          className={`flex items-center gap-4 p-4 rounded-2xl border text-left transition-all cursor-pointer ${selected ? 'bg-violet-50 dark:bg-violet-900/20 border-violet-400 dark:border-violet-600' : 'bg-black/[0.02] dark:bg-white/[0.03] border-black/[0.07] dark:border-white/[0.07] hover:border-black/20 dark:hover:border-white/20'}`}>
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${trigger.bg}`}>
                            <Icon className={`w-5 h-5 ${trigger.color}`} />
                          </div>
                          <div className="flex-1">
                            <p className={`font-semibold text-sm ${selected ? 'text-violet-700 dark:text-violet-300' : 'text-gray-800 dark:text-slate-200'}`}>{trigger.label}</p>
                            <p className="text-gray-400 dark:text-slate-500 text-xs mt-0.5">{trigger.desc}</p>
                          </div>
                          {selected && <Check className="w-5 h-5 text-violet-600 dark:text-violet-400 flex-shrink-0" />}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Step 2: Actions */}
              {wizardStep === 2 && (
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Build Your Workflow</h3>
                  <p className="text-gray-400 dark:text-slate-500 text-sm mb-5">Add actions that run after the trigger fires</p>

                  {/* Current steps */}
                  {draftSteps.length > 0 && (
                    <div className="mb-5 space-y-2">
                      <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-3">Workflow Steps</p>
                      {draftSteps.map((step, i) => {
                        const Icon = ICON_MAP[step.type] || GitBranch
                        return (
                          <div key={step.id} className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center text-violet-600 dark:text-violet-400 text-xs font-bold flex-shrink-0">{i + 1}</div>
                            <div className={`flex-1 flex items-center gap-3 p-3 rounded-xl border ${STEP_BG[step.type]} ${COLOR_MAP[step.type]}`}>
                              <Icon className="w-4 h-4 flex-shrink-0" />
                              <span className="text-gray-700 dark:text-slate-200 text-sm font-medium">{step.label}</span>
                            </div>
                            <button onClick={() => removeDraftStep(step.id)} className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-300 dark:text-slate-600 hover:text-red-500 transition-colors cursor-pointer flex-shrink-0">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-3">Add Action</p>
                  <div className="grid grid-cols-2 gap-2">
                    {ACTION_TYPES.map(action => {
                      const Icon = action.icon
                      return (
                        <button key={action.id} onClick={() => addDraftStep(action.id)}
                          className="flex items-center gap-3 p-3.5 rounded-xl border border-black/[0.07] dark:border-white/[0.07] bg-black/[0.02] dark:bg-white/[0.03] hover:border-violet-300 dark:hover:border-violet-700 hover:bg-violet-50/50 dark:hover:bg-violet-900/10 transition-all cursor-pointer text-left group">
                          <div className={`w-8 h-8 rounded-lg bg-white dark:bg-white/[0.08] border border-black/[0.07] dark:border-white/10 flex items-center justify-center flex-shrink-0 ${action.color}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="text-gray-700 dark:text-slate-200 text-sm font-medium group-hover:text-violet-700 dark:group-hover:text-violet-300 transition-colors">{action.label}</span>
                          <Plus className="w-4 h-4 text-gray-300 dark:text-slate-600 ml-auto flex-shrink-0" />
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Step 3: Name */}
              {wizardStep === 3 && (
                <div className="space-y-5">
                  <div>
                    <Label className="text-gray-700 dark:text-slate-200 text-base font-semibold mb-2 block">Automation Name *</Label>
                    <Input value={draftName} onChange={e => setDraftName(e.target.value)}
                      placeholder="e.g. VIP Lead Nurture Sequence"
                      className="bg-white/60 dark:bg-white/[0.05] border-black/10 dark:border-white/10 text-gray-900 dark:text-white text-base h-11 focus:border-violet-400 backdrop-blur-sm" />
                  </div>

                  {/* Summary */}
                  <div className="p-5 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] space-y-3">
                    <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">Summary</p>
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-500 dark:text-slate-400 w-16">Trigger:</span>
                      <span className="text-sm font-semibold text-gray-800 dark:text-slate-200">
                        {TRIGGERS.find(t => t.id === selectedTrigger)?.label}
                      </span>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-sm text-gray-500 dark:text-slate-400 w-16 flex-shrink-0">Actions:</span>
                      <span className="text-sm font-semibold text-gray-800 dark:text-slate-200">
                        {draftSteps.length > 0 ? draftSteps.map(s => s.label).join(' → ') : 'No actions added'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Wizard footer */}
            <div className="flex items-center justify-between p-7 border-t border-black/[0.06] dark:border-white/[0.06]">
              <Button variant="ghost" onClick={() => wizardStep > 1 ? setWizardStep(w => w - 1) : setShowWizard(false)}
                className="text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-white">
                {wizardStep > 1 ? '← Back' : 'Cancel'}
              </Button>
              {wizardStep < 3 ? (
                <Button onClick={() => setWizardStep(w => w + 1)}
                  disabled={wizardStep === 1 && !selectedTrigger}
                  className="bg-violet-600 hover:bg-violet-700 text-white shadow-sm px-6 disabled:opacity-50">
                  Continue <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              ) : (
                <Button onClick={saveWizard} disabled={!draftName}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm px-6 disabled:opacity-50">
                  <Check className="w-4 h-4 mr-2" /> Create Automation
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
