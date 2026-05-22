'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Bot, Sparkles, Send, Copy, Check, X, ChevronDown, ChevronRight,
  Upload, Link2, Globe, Brain, Zap, Shield, MessageCircle,
  TrendingUp, BarChart2, Search, Settings2, Play, Square,
  Rocket, Code2, Webhook, Cpu, AlertCircle, Plus, Trash2,
  RefreshCw, User, Terminal, FileText, CheckCircle2, Clock,
  ToggleLeft, ToggleRight, Sliders, Eye, EyeOff,
} from 'lucide-react'

/* ═══════════════════════════════════════════════════════════════
   TYPES & CONSTANTS
═══════════════════════════════════════════════════════════════ */

type AgentRole = 'support' | 'sales' | 'analyst' | 'researcher' | 'custom'
type MessageRole = 'user' | 'agent'

interface Message {
  id: string
  role: MessageRole
  content: string
  timestamp: Date
  thoughts?: ThoughtStep[]
  showThoughts?: boolean
}

interface ThoughtStep {
  step: string
  detail: string
  duration: number
  status: 'done' | 'running' | 'pending'
}

interface UploadedFile {
  id: string
  name: string
  size: string
  type: string
  status: 'indexing' | 'ready'
}

const AGENT_ROLES: { id: AgentRole; label: string; icon: typeof Bot; color: string; bg: string; prompt: string }[] = [
  { id: 'support', label: 'Support', icon: MessageCircle, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/25 border-blue-300 dark:border-blue-700/40', prompt: 'You are a friendly and knowledgeable customer support agent. Your goal is to resolve customer issues efficiently and empathetically. Always acknowledge the customer\'s frustration, provide clear solutions, and escalate complex issues appropriately.' },
  { id: 'sales', label: 'Sales', icon: TrendingUp, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/25 border-emerald-300 dark:border-emerald-700/40', prompt: 'You are a consultative sales specialist. Your approach is value-first: understand the prospect\'s pain points deeply before presenting solutions. Never hard-sell; instead, educate and guide prospects to the right decision for their needs.' },
  { id: 'analyst', label: 'Analyst', icon: BarChart2, color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-900/25 border-violet-300 dark:border-violet-700/40', prompt: 'You are a data analyst with deep expertise in business intelligence. Provide clear, evidence-based insights from data. Always cite your sources, explain your methodology, and present findings in a structured, actionable format.' },
  { id: 'researcher', label: 'Research', icon: Search, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/25 border-amber-300 dark:border-amber-700/40', prompt: 'You are a meticulous research specialist. Synthesize information from multiple sources, identify patterns, and present balanced, well-cited findings. Always distinguish between established facts and emerging hypotheses.' },
  { id: 'custom', label: 'Custom', icon: Settings2, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-900/25 border-rose-300 dark:border-rose-700/40', prompt: '' },
]

const AI_MODELS = [
  { id: 'claude-sonnet', label: 'Claude Sonnet 4.6', badge: 'Recommended', cost: '$0.003/1k' },
  { id: 'claude-haiku', label: 'Claude Haiku 4.5', badge: 'Fast', cost: '$0.0003/1k' },
  { id: 'claude-opus', label: 'Claude Opus 4.7', badge: 'Powerful', cost: '$0.015/1k' },
]

const DEMO_THOUGHTS: ThoughtStep[] = [
  { step: 'Query Analysis', detail: 'Parsing user intent → classified as product inquiry', duration: 48, status: 'done' },
  { step: 'Knowledge Retrieval', detail: 'Searching vector store (1,240 chunks) → 8 relevant passages found', duration: 124, status: 'done' },
  { step: 'Context Assembly', detail: 'Building context window (3,840 tokens) with top-3 passages ranked by cosine similarity', duration: 32, status: 'done' },
  { step: 'Response Generation', detail: 'Streaming completion via Claude Sonnet 4.6 → 312 tokens generated', duration: 890, status: 'done' },
  { step: 'Safety Check', detail: 'Passed content filters · No PII detected · Confidence: 0.97', duration: 12, status: 'done' },
]

const QUICK_TESTS = [
  'What can you help me with today?',
  'Tell me about your pricing plans.',
  'I need help resolving an issue with my account.',
  'Can you summarize the latest quarterly report?',
]

/* ═══════════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════════ */

function uid() { return Math.random().toString(36).slice(2, 10) }
function fmt(n: number) { return n < 10 ? `0${n}` : `${n}` }
function timeStr(d: Date) { return `${fmt(d.getHours())}:${fmt(d.getMinutes())}` }

/* ═══════════════════════════════════════════════════════════════
   THOUGHT LOG COMPONENT
═══════════════════════════════════════════════════════════════ */

function ThoughtLog({ steps }: { steps: ThoughtStep[] }) {
  return (
    <div className="mt-2 rounded-xl overflow-hidden border border-emerald-900/30 dark:border-emerald-400/10 bg-[#0a1a0a] dark:bg-[#060f06]">
      <div className="flex items-center gap-2 px-3 py-2 border-b border-emerald-900/20 dark:border-emerald-400/10">
        <div className="flex gap-1">
          {['#FF5F57','#FEBC2E','#28C840'].map(c => <div key={c} className="w-2 h-2 rounded-full" style={{ background: c }} />)}
        </div>
        <span className="text-emerald-400 text-[10px] font-mono font-bold tracking-widest">AGENT REASONING LOG</span>
        <span className="ml-auto text-emerald-600 text-[10px] font-mono">{steps.reduce((s, t) => s + t.duration, 0)}ms total</span>
      </div>
      <div className="p-3 space-y-1.5 font-mono text-[11px] leading-relaxed">
        {steps.map((step, i) => (
          <div key={i} className="flex items-start gap-2.5">
            <span className="text-emerald-600 flex-shrink-0 mt-0.5">
              {step.status === 'done' ? '✓' : step.status === 'running' ? '▶' : '○'}
            </span>
            <div className="flex-1 min-w-0">
              <span className="text-emerald-300 font-bold">[{step.step}]</span>
              <span className="text-emerald-500 ml-2">{step.detail}</span>
            </div>
            <span className="text-emerald-700 flex-shrink-0">{step.duration}ms</span>
          </div>
        ))}
        <div className="mt-2 pt-2 border-t border-emerald-900/30 flex items-center gap-2">
          <span className="text-emerald-600">$</span>
          <span className="text-emerald-400 animate-pulse">_</span>
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   MESSAGE BUBBLE
═══════════════════════════════════════════════════════════════ */

function MessageBubble({ msg, agentName, onToggleThoughts }: {
  msg: Message; agentName: string; onToggleThoughts: (id: string) => void
}) {
  const isUser = msg.role === 'user'
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} group`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center shadow-sm ${isUser ? 'bg-gradient-to-br from-violet-500 to-indigo-600' : 'bg-gradient-to-br from-emerald-500 to-teal-600'}`}>
        {isUser ? <User className="w-4 h-4 text-white" /> : <Bot className="w-4 h-4 text-white" />}
      </div>

      <div className={`flex flex-col max-w-[75%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div className="flex items-center gap-2 mb-1 px-1">
          <span className="text-[11px] font-bold text-gray-500 dark:text-slate-500">{isUser ? 'You' : agentName}</span>
          <span className="text-[10px] text-gray-300 dark:text-slate-700">{timeStr(msg.timestamp)}</span>
        </div>

        {/* Bubble */}
        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed transition-all duration-200 ${
          isUser
            ? 'bg-violet-600 text-white rounded-tr-md shadow-md shadow-violet-200 dark:shadow-violet-900/30'
            : 'bg-white/70 dark:bg-white/[0.06] border border-black/[0.07] dark:border-white/[0.08] text-gray-800 dark:text-slate-100 rounded-tl-md backdrop-blur-sm shadow-sm'
        }`}>
          {msg.content}
        </div>

        {/* Thought log toggle */}
        {!isUser && msg.thoughts && (
          <button
            onClick={() => onToggleThoughts(msg.id)}
            className="flex items-center gap-1.5 mt-1.5 px-2 py-1 rounded-lg text-[11px] font-semibold text-gray-400 dark:text-slate-500 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/15 transition-all cursor-pointer"
          >
            <Terminal className="w-3 h-3" />
            {msg.showThoughts ? 'Hide' : 'View'} reasoning
            <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${msg.showThoughts ? 'rotate-180' : ''}`} />
          </button>
        )}
        {!isUser && msg.showThoughts && msg.thoughts && (
          <div className="w-full max-w-[420px]">
            <ThoughtLog steps={msg.thoughts} />
          </div>
        )}
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   TYPING INDICATOR
═══════════════════════════════════════════════════════════════ */

function TypingIndicator({ agentName }: { agentName: string }) {
  return (
    <div className="flex gap-3 items-end">
      <div className="w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-600 shadow-sm">
        <Bot className="w-4 h-4 text-white" />
      </div>
      <div className="flex flex-col items-start">
        <span className="text-[11px] font-bold text-gray-500 dark:text-slate-500 mb-1 px-1">{agentName}</span>
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl rounded-tl-md bg-white/70 dark:bg-white/[0.06] border border-black/[0.07] dark:border-white/[0.08] backdrop-blur-sm shadow-sm">
          <div className="flex gap-1.5">
            {[0,1,2].map(i => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-slate-500"
                style={{ animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
            ))}
          </div>
          <span className="text-[11px] text-gray-400 dark:text-slate-500 font-mono">Processing…</span>
        </div>
      </div>
      <style>{`@keyframes bounce { 0%,80%,100% { transform:translateY(0) } 40% { transform:translateY(-6px) } }`}</style>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   DEPLOY MODAL
═══════════════════════════════════════════════════════════════ */

const WEBHOOK_PLATFORMS = [
  { name: 'WhatsApp Business', icon: '📱', color: 'bg-green-500', desc: 'Send and receive messages via WhatsApp API v20' },
  { name: 'Telegram Bot', icon: '✈️', color: 'bg-sky-500', desc: 'Deploy as a native Telegram bot with inline buttons' },
  { name: 'Slack App', icon: '⚡', color: 'bg-purple-500', desc: 'Add to Slack workspace as an AI-powered slash command' },
  { name: 'Discord Bot', icon: '🎮', color: 'bg-indigo-500', desc: 'Integrate into Discord servers with role-based access' },
]

function DeployModal({ agentName, onClose }: { agentName: string; onClose: () => void }) {
  const [tab, setTab] = useState<'embed' | 'api' | 'webhooks'>('embed')
  const [copied, setCopied] = useState<string | null>(null)
  const [webhookEnabled, setWebhookEnabled] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(WEBHOOK_PLATFORMS.map(p => [p.name, false]))
  )
  const slug = agentName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  const agentId = `agt_${uid()}`
  const token = `sk-live-${uid()}${uid()}${uid()}`

  const embedCode = `<!-- AIPlatform Agent Widget -->
<script
  src="https://cdn.aiplatform.io/widget/v2.js"
  data-agent-id="${agentId}"
  data-agent-name="${agentName}"
  data-theme="auto"
  data-position="bottom-right"
  defer
></script>`

  const apiSnippet = `# REST API — ${agentName}
curl -X POST \\
  https://api.aiplatform.io/v1/agents/${agentId}/chat \\
  -H "Authorization: Bearer ${token}" \\
  -H "Content-Type: application/json" \\
  -d '{"message": "Hello, how can you help me?"}'

# Response
{
  "id": "msg_${uid()}",
  "agent_id": "${agentId}",
  "content": "Hello! I'm ${agentName}...",
  "tokens_used": 312,
  "latency_ms": 847
}`

  async function copy(text: string, key: string) {
    await navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  const TABS = [
    { id: 'embed' as const, label: 'Embed Widget', icon: Code2 },
    { id: 'api' as const, label: 'API Endpoint', icon: Zap },
    { id: 'webhooks' as const, label: 'Webhooks', icon: Webhook },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl glass rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-4 px-8 pt-8 pb-6 border-b border-black/[0.06] dark:border-white/[0.06]">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-300/30 flex-shrink-0">
            <Rocket className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Deploy Agent</h2>
            <p className="text-gray-400 dark:text-slate-500 text-sm mt-0.5">
              <span className="font-semibold text-violet-600 dark:text-violet-400">{agentName}</span> is ready for deployment
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700/30">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">Live</span>
            </div>
            <button onClick={onClose} className="w-9 h-9 rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/[0.05] flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-white cursor-pointer transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 px-8 pt-4 pb-0">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${tab === id ? 'bg-violet-600 text-white shadow-md' : 'text-gray-500 dark:text-slate-400 hover:text-gray-800 dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.06]'}`}>
              <Icon className="w-3.5 h-3.5" />{label}
            </button>
          ))}
        </div>

        <div className="px-8 py-6">
          {/* Embed */}
          {tab === 'embed' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500 dark:text-slate-400">
                Paste this snippet before the closing <code className="text-violet-600 dark:text-violet-400 font-mono text-xs bg-violet-50 dark:bg-violet-900/20 px-1.5 py-0.5 rounded">&lt;/body&gt;</code> tag on any webpage.
              </p>
              <div className="relative">
                <pre className="bg-[#0d0d1a] rounded-2xl p-5 text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed border border-white/[0.06]">
                  {embedCode}
                </pre>
                <button onClick={() => copy(embedCode, 'embed')}
                  className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer">
                  {copied === 'embed' ? <><Check className="w-3.5 h-3.5 text-emerald-400" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
                </button>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/15 border border-blue-200 dark:border-blue-700/30">
                <AlertCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-blue-700 dark:text-blue-300">The widget auto-detects the page theme and scales responsively. Supports CSP-safe loading and GDPR-compliant sessions.</p>
              </div>
            </div>
          )}

          {/* API */}
          {tab === 'api' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.06] dark:border-white/[0.06]">
                  <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">Agent ID</p>
                  <div className="flex items-center justify-between gap-2">
                    <code className="text-sm font-mono text-gray-900 dark:text-white">{agentId}</code>
                    <button onClick={() => copy(agentId, 'id')} className="text-gray-400 hover:text-violet-600 cursor-pointer transition-colors">
                      {copied === 'id' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.06] dark:border-white/[0.06]">
                  <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">Bearer Token</p>
                  <div className="flex items-center justify-between gap-2">
                    <code className="text-sm font-mono text-gray-900 dark:text-white truncate">{token.slice(0, 18)}…</code>
                    <button onClick={() => copy(token, 'token')} className="text-gray-400 hover:text-violet-600 cursor-pointer transition-colors flex-shrink-0">
                      {copied === 'token' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
              <div className="relative">
                <pre className="bg-[#0d0d1a] rounded-2xl p-5 text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed border border-white/[0.06] max-h-52">
                  {apiSnippet}
                </pre>
                <button onClick={() => copy(apiSnippet, 'api')}
                  className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer">
                  {copied === 'api' ? <><Check className="w-3.5 h-3.5 text-emerald-400" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy</>}
                </button>
              </div>
            </div>
          )}

          {/* Webhooks */}
          {tab === 'webhooks' && (
            <div className="space-y-3">
              <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">Connect your agent to messaging platforms with one click.</p>
              {WEBHOOK_PLATFORMS.map(platform => {
                const enabled = webhookEnabled[platform.name]
                return (
                  <div key={platform.name} className="flex items-center gap-4 p-4 rounded-2xl border border-black/[0.07] dark:border-white/[0.07] bg-black/[0.02] dark:bg-white/[0.03] hover:border-black/15 dark:hover:border-white/15 transition-all">
                    <div className={`w-10 h-10 ${platform.color} rounded-xl flex items-center justify-center text-xl flex-shrink-0`}>
                      {platform.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-800 dark:text-slate-100">{platform.name}</p>
                      <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">{platform.desc}</p>
                    </div>
                    <button onClick={() => setWebhookEnabled(prev => ({ ...prev, [platform.name]: !prev[platform.name] }))}
                      className={`relative w-12 h-6 rounded-full transition-all duration-300 flex-shrink-0 cursor-pointer ${enabled ? 'bg-violet-600 shadow-md shadow-violet-300/30' : 'bg-gray-200 dark:bg-slate-700'}`}>
                      <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-300 ${enabled ? 'left-6' : 'left-0.5'}`} />
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ═══════════════════════════════════════════════════════════════
   CAPABILITY TOGGLE
═══════════════════════════════════════════════════════════════ */

function CapabilityToggle({ label, desc, icon: Icon, value, onChange, accent = 'violet' }: {
  label: string; desc: string; icon: typeof Globe; value: boolean; onChange: (v: boolean) => void; accent?: string
}) {
  const colors = {
    violet: { on: 'bg-violet-600 shadow-violet-300/30 dark:shadow-violet-900/40', ring: 'ring-violet-200 dark:ring-violet-900/30', iconOn: 'text-violet-500', iconOff: 'text-gray-400 dark:text-slate-500' },
    emerald: { on: 'bg-emerald-600 shadow-emerald-300/30 dark:shadow-emerald-900/40', ring: 'ring-emerald-200 dark:ring-emerald-900/30', iconOn: 'text-emerald-500', iconOff: 'text-gray-400 dark:text-slate-500' },
    amber: { on: 'bg-amber-500 shadow-amber-300/30 dark:shadow-amber-900/40', ring: 'ring-amber-200 dark:ring-amber-900/30', iconOn: 'text-amber-500', iconOff: 'text-gray-400 dark:text-slate-500' },
    rose: { on: 'bg-rose-600 shadow-rose-300/30 dark:shadow-rose-900/40', ring: 'ring-rose-200 dark:ring-rose-900/30', iconOn: 'text-rose-500', iconOff: 'text-gray-400 dark:text-slate-500' },
  }
  const c = colors[accent as keyof typeof colors] ?? colors.violet
  return (
    <button onClick={() => onChange(!value)}
      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${value ? `border-${accent}-200 dark:border-${accent}-700/40 bg-${accent}-50/50 dark:bg-${accent}-900/10` : 'border-black/[0.07] dark:border-white/[0.07] bg-white/40 dark:bg-white/[0.02] hover:border-black/15 dark:hover:border-white/15'}`}>
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200 ${value ? `bg-${accent}-100 dark:bg-${accent}-900/30` : 'bg-black/[0.04] dark:bg-white/[0.04]'}`}>
        <Icon className={`w-4 h-4 transition-colors ${value ? c.iconOn : c.iconOff}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-bold ${value ? `text-${accent}-700 dark:text-${accent}-300` : 'text-gray-700 dark:text-slate-200'}`}>{label}</p>
        <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5 leading-tight">{desc}</p>
      </div>
      <div className={`relative w-11 h-6 rounded-full transition-all duration-300 flex-shrink-0 ${value ? `${c.on} shadow-md` : 'bg-gray-200 dark:bg-slate-700'}`}>
        <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-300 ${value ? 'left-5' : 'left-0.5'}`} />
      </div>
    </button>
  )
}

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════════════════════════════ */

export default function AgentBuilderPage() {
  // Config state
  const [agentName, setAgentName] = useState('Alex')
  const [role, setRole] = useState<AgentRole>('support')
  const [systemPrompt, setSystemPrompt] = useState(AGENT_ROLES[0].prompt)
  const [model, setModel] = useState('claude-sonnet')
  const [temperature, setTemperature] = useState(0.7)
  const [maxTokens, setMaxTokens] = useState(2048)
  const [files, setFiles] = useState<UploadedFile[]>([
    { id: uid(), name: 'product-catalog-2026.pdf', size: '2.4 MB', type: 'PDF', status: 'ready' },
    { id: uid(), name: 'faq-knowledge-base.txt', size: '180 KB', type: 'TXT', status: 'ready' },
  ])
  const [urls, setUrls] = useState(['https://docs.company.com'])
  const [urlInput, setUrlInput] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [capabilities, setCapabilities] = useState({
    webSearch: true, emotionAnalysis: false, strictAdherence: true,
    longTermMemory: false, citations: true, multiLanguage: false,
  })

  // Playground state
  const [messages, setMessages] = useState<Message[]>([
    {
      id: uid(), role: 'agent', timestamp: new Date(Date.now() - 60000),
      content: `Hi! I'm ${agentName}, your AI assistant. I'm here to help you with any questions. What can I assist you with today?`,
      thoughts: DEMO_THOUGHTS, showThoughts: false,
    },
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [showDeploy, setShowDeploy] = useState(false)
  const [isLive, setIsLive] = useState(false)
  const chatRef = useRef<HTMLDivElement>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  // Scroll to bottom
  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, typing])

  // Role change → auto-fill prompt
  function handleRoleChange(r: AgentRole) {
    setRole(r)
    const roleData = AGENT_ROLES.find(x => x.id === r)
    if (roleData?.prompt) setSystemPrompt(roleData.prompt)
  }

  // Toggle thought logs
  function toggleThoughts(id: string) {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, showThoughts: !m.showThoughts } : m))
  }

  // Send message
  async function handleSend() {
    const text = input.trim()
    if (!text) return
    setInput('')

    const userMsg: Message = { id: uid(), role: 'user', content: text, timestamp: new Date() }
    setMessages(prev => [...prev, userMsg])
    setTyping(true)

    // Simulate agent response
    await new Promise(r => setTimeout(r, 1400 + Math.random() * 800))
    setTyping(false)

    const responses = [
      `Great question! Based on my knowledge base, I can tell you that ${text.toLowerCase().includes('price') ? 'our pricing starts at $49/month for the Starter plan, $99/month for Pro, and custom pricing for Enterprise.' : text.toLowerCase().includes('help') ? 'I\'m designed to assist you with product questions, troubleshooting, and account management. What specific issue are you facing?' : 'I\'ve searched our documentation and found several relevant articles. The most applicable solution appears to be the following...'}`,
      `I understand you're asking about "${text.slice(0, 40)}...". Let me pull up the most relevant information from our knowledge base and give you a comprehensive answer.`,
      `That's a great point! I've cross-referenced your query across 1,240 knowledge chunks and found 3 highly relevant passages. Here's what our documentation says...`,
    ]

    const agentMsg: Message = {
      id: uid(), role: 'agent', timestamp: new Date(),
      content: responses[Math.floor(Math.random() * responses.length)],
      thoughts: DEMO_THOUGHTS.map(t => ({ ...t, duration: Math.round(t.duration * (0.8 + Math.random() * 0.4)) })),
      showThoughts: false,
    }
    setMessages(prev => [...prev, agentMsg])
  }

  // File drag-and-drop
  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    const dropped = Array.from(e.dataTransfer.files)
    dropped.forEach(f => {
      const newFile: UploadedFile = { id: uid(), name: f.name, size: `${(f.size / 1024).toFixed(0)} KB`, type: f.name.split('.').pop()?.toUpperCase() ?? 'FILE', status: 'indexing' }
      setFiles(prev => [...prev, newFile])
      setTimeout(() => setFiles(prev => prev.map(x => x.id === newFile.id ? { ...x, status: 'ready' } : x)), 2000)
    })
  }

  function addUrl() {
    if (urlInput.trim() && !urls.includes(urlInput.trim())) {
      setUrls(prev => [...prev, urlInput.trim()])
      setUrlInput('')
    }
  }

  const roleCfg = AGENT_ROLES.find(r => r.id === role)!

  return (
    <div className="flex flex-col min-h-screen">

      {/* Deploy modal */}
      {showDeploy && <DeployModal agentName={agentName} onClose={() => setShowDeploy(false)} />}

      {/* ── STICKY HEADER ───────────────────────────────────────── */}
      <div className="sticky top-0 z-30 glass border-b border-black/[0.06] dark:border-white/[0.06] px-8 py-4 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-violet-300/30 dark:shadow-violet-900/30">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">{agentName}</h1>
              <Badge className={`text-xs border ${roleCfg.bg} ${roleCfg.color}`}>{roleCfg.label}</Badge>
              {isLive && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700/30">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400">Live</span>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-400 dark:text-slate-500">{model} · temp {temperature} · {maxTokens} max tokens</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setMessages([{ id: uid(), role: 'agent', timestamp: new Date(), content: `Hi! I'm ${agentName}. How can I help you today?`, thoughts: DEMO_THOUGHTS, showThoughts: false }])}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/[0.05] text-gray-600 dark:text-slate-300 text-sm font-medium hover:bg-black/[0.03] dark:hover:bg-white/[0.08] transition-all cursor-pointer">
            <RefreshCw className="w-4 h-4" /> Reset Chat
          </button>
          <button
            onClick={() => setIsLive(v => !v)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer border ${isLive ? 'bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-700/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/30' : 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-700/40 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30'}`}>
            {isLive ? <><Square className="w-4 h-4" /> Stop</> : <><Play className="w-4 h-4" /> Test Agent</>}
          </button>
          <Button onClick={() => setShowDeploy(true)}
            className="bg-violet-600 text-white shadow-md shadow-violet-300/25 dark:shadow-violet-900/30 px-5 h-10 text-sm font-semibold hover:bg-violet-700 transition-all">
            <Rocket className="w-4 h-4 mr-2" /> Deploy Agent
          </Button>
        </div>
      </div>

      {/* ── DUAL PANE ───────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row flex-1 gap-0 min-h-0">

        {/* ══ LEFT: CONFIGURATION (60%) ══════════════════════════ */}
        <div className="lg:w-[60%] overflow-y-auto p-8 space-y-5 border-r border-black/[0.06] dark:border-white/[0.04]">

          {/* ── Identity & Persona ─────────────────────────────── */}
          <div className="glass p-7">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
                <User className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Identity & Persona</h2>
                <p className="text-gray-400 dark:text-slate-500 text-xs mt-0.5">Define who your agent is and how it behaves</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-5 mb-5">
              <div>
                <label className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest block mb-2">Agent Name</label>
                <input value={agentName} onChange={e => setAgentName(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-black/[0.08] dark:border-white/[0.09] bg-white/70 dark:bg-white/[0.05] text-gray-900 dark:text-white text-base font-semibold focus:outline-none focus:border-violet-400 backdrop-blur-sm transition-colors placeholder:text-gray-300 dark:placeholder:text-slate-600" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest block mb-2">AI Model</label>
                <div className="relative">
                  <select value={model} onChange={e => setModel(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-black/[0.08] dark:border-white/[0.09] bg-white/70 dark:bg-white/[0.05] text-gray-900 dark:text-white text-sm font-semibold focus:outline-none focus:border-violet-400 backdrop-blur-sm cursor-pointer appearance-none pr-10">
                    {AI_MODELS.map(m => <option key={m.id} value={m.id}>{m.label} — {m.cost}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Role selector chips */}
            <div className="mb-5">
              <label className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest block mb-2">Role</label>
              <div className="flex flex-wrap gap-2">
                {AGENT_ROLES.map(r => {
                  const Icon = r.icon
                  const active = role === r.id
                  return (
                    <button key={r.id} onClick={() => handleRoleChange(r.id)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border text-sm font-semibold transition-all cursor-pointer ${active ? `${r.bg} ${r.color}` : 'border-black/[0.07] dark:border-white/[0.07] bg-white/50 dark:bg-white/[0.03] text-gray-500 dark:text-slate-400 hover:border-black/20 dark:hover:border-white/20 hover:text-gray-800 dark:hover:text-white'}`}>
                      <Icon className={`w-3.5 h-3.5 ${active ? '' : 'opacity-60'}`} />
                      {r.label}
                      {active && <Check className="w-3.5 h-3.5" />}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* System Prompt */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest">System Prompt</label>
                <span className="text-[10px] text-gray-400 dark:text-slate-600 font-mono">{systemPrompt.length} chars</span>
              </div>
              <textarea
                value={systemPrompt}
                onChange={e => setSystemPrompt(e.target.value)}
                rows={5}
                placeholder="You are a helpful AI agent. Your goal is to..."
                className="w-full px-4 py-3.5 rounded-2xl border border-black/[0.08] dark:border-white/[0.09] bg-white/70 dark:bg-white/[0.05] text-gray-800 dark:text-slate-200 text-sm leading-relaxed focus:outline-none focus:border-violet-400 backdrop-blur-sm transition-colors resize-none placeholder:text-gray-300 dark:placeholder:text-slate-600"
              />
            </div>

            {/* Parameters */}
            <div className="grid grid-cols-2 gap-5 mt-5 pt-5 border-t border-black/[0.05] dark:border-white/[0.05]">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest">Temperature</label>
                  <span className="text-xs font-bold text-violet-600 dark:text-violet-400">{temperature}</span>
                </div>
                <input type="range" min="0" max="1" step="0.05" value={temperature}
                  onChange={e => setTemperature(parseFloat(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer accent-violet-600 bg-gray-200 dark:bg-slate-700" />
                <div className="flex justify-between text-[10px] text-gray-300 dark:text-slate-600 mt-1 font-mono">
                  <span>Precise</span><span>Creative</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest">Max Tokens</label>
                  <span className="text-xs font-bold text-violet-600 dark:text-violet-400">{maxTokens.toLocaleString('en-US')}</span>
                </div>
                <input type="range" min="256" max="8192" step="256" value={maxTokens}
                  onChange={e => setMaxTokens(parseInt(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer accent-violet-600 bg-gray-200 dark:bg-slate-700" />
                <div className="flex justify-between text-[10px] text-gray-300 dark:text-slate-600 mt-1 font-mono">
                  <span>256</span><span>8,192</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Knowledge Base ─────────────────────────────────── */}
          <div className="glass p-7">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Brain className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Knowledge Base</h2>
                <p className="text-gray-400 dark:text-slate-500 text-xs mt-0.5">{files.filter(f => f.status === 'ready').length} sources indexed · auto-embeds on upload</p>
              </div>
            </div>

            {/* Drop zone */}
            <div
              onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              className={`relative flex flex-col items-center justify-center gap-3 p-8 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200 mb-5 ${isDragging ? 'border-violet-500 bg-violet-50/50 dark:bg-violet-900/10 scale-[1.01]' : 'border-black/[0.10] dark:border-white/[0.10] bg-black/[0.02] dark:bg-white/[0.02] hover:border-violet-400 dark:hover:border-violet-600 hover:bg-violet-50/30 dark:hover:bg-violet-900/5'}`}>
              <input ref={fileRef} type="file" multiple accept=".pdf,.txt,.md,.docx" className="hidden"
                onChange={e => {
                  Array.from(e.target.files ?? []).forEach(f => {
                    const nf: UploadedFile = { id: uid(), name: f.name, size: `${(f.size / 1024).toFixed(0)} KB`, type: f.name.split('.').pop()?.toUpperCase() ?? 'FILE', status: 'indexing' }
                    setFiles(prev => [...prev, nf])
                    setTimeout(() => setFiles(prev => prev.map(x => x.id === nf.id ? { ...x, status: 'ready' } : x)), 2000)
                  })
                }} />
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-200 ${isDragging ? 'bg-violet-100 dark:bg-violet-900/30' : 'bg-black/[0.04] dark:bg-white/[0.05]'}`}>
                <Upload className={`w-7 h-7 transition-colors ${isDragging ? 'text-violet-600 dark:text-violet-400' : 'text-gray-300 dark:text-slate-600'}`} />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-gray-700 dark:text-slate-200">
                  {isDragging ? 'Release to upload' : 'Drop files here or click to browse'}
                </p>
                <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">PDF, TXT, MD, DOCX up to 50 MB each</p>
              </div>
            </div>

            {/* File list */}
            {files.length > 0 && (
              <div className="space-y-2 mb-5">
                {files.map(f => (
                  <div key={f.id} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.05] dark:border-white/[0.05] group">
                    <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 dark:text-slate-100 truncate">{f.name}</p>
                      <p className="text-xs text-gray-400 dark:text-slate-500">{f.type} · {f.size}</p>
                    </div>
                    {f.status === 'indexing' ? (
                      <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 font-semibold">
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Indexing…
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <button onClick={() => setFiles(prev => prev.filter(x => x.id !== f.id))}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-300 dark:text-slate-600 hover:text-red-500 cursor-pointer">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* URL scraping */}
            <div>
              <label className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest block mb-2">Web Sources</label>
              <div className="space-y-2 mb-2">
                {urls.map((url, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/[0.05] dark:border-white/[0.05] group">
                    <Globe className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                    <span className="text-xs text-gray-600 dark:text-slate-300 flex-1 truncate font-mono">{url}</span>
                    <button onClick={() => setUrls(prev => prev.filter((_, j) => j !== i))}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-300 dark:text-slate-600 hover:text-red-500 cursor-pointer">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-slate-500" />
                  <input value={urlInput} onChange={e => setUrlInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addUrl()}
                    placeholder="https://docs.yoursite.com"
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-black/[0.08] dark:border-white/[0.09] bg-white/70 dark:bg-white/[0.05] text-gray-800 dark:text-slate-200 text-sm focus:outline-none focus:border-violet-400 backdrop-blur-sm transition-colors placeholder:text-gray-300 dark:placeholder:text-slate-600" />
                </div>
                <button onClick={addUrl}
                  className="px-4 py-2.5 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-all cursor-pointer flex-shrink-0 shadow-sm shadow-violet-300/20">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* ── Behavior & Capabilities ────────────────────────── */}
          <div className="glass p-7">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <Sliders className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Behavior & Capabilities</h2>
                <p className="text-gray-400 dark:text-slate-500 text-xs mt-0.5">Fine-tune what your agent can and cannot do</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <CapabilityToggle label="Web Search Access" desc="Browse the internet for real-time information" icon={Globe} value={capabilities.webSearch} onChange={v => setCapabilities(p => ({ ...p, webSearch: v }))} accent="violet" />
              <CapabilityToggle label="Emotion Analysis" desc="Detect and respond to user sentiment" icon={Brain} value={capabilities.emotionAnalysis} onChange={v => setCapabilities(p => ({ ...p, emotionAnalysis: v }))} accent="emerald" />
              <CapabilityToggle label="Strict Adherence" desc="Only answer from knowledge base — no hallucinations" icon={Shield} value={capabilities.strictAdherence} onChange={v => setCapabilities(p => ({ ...p, strictAdherence: v }))} accent="amber" />
              <CapabilityToggle label="Long-term Memory" desc="Remember conversation context across sessions" icon={Clock} value={capabilities.longTermMemory} onChange={v => setCapabilities(p => ({ ...p, longTermMemory: v }))} accent="violet" />
              <CapabilityToggle label="Source Citations" desc="Cite knowledge base sources in responses" icon={FileText} value={capabilities.citations} onChange={v => setCapabilities(p => ({ ...p, citations: v }))} accent="emerald" />
              <CapabilityToggle label="Multi-language" desc="Auto-detect and reply in user's language" icon={Zap} value={capabilities.multiLanguage} onChange={v => setCapabilities(p => ({ ...p, multiLanguage: v }))} accent="rose" />
            </div>
          </div>
        </div>

        {/* ══ RIGHT: LIVE PLAYGROUND (40%) ════════════════════════ */}
        <div className="lg:w-[40%] flex flex-col bg-black/[0.015] dark:bg-white/[0.01]">

          {/* Playground header */}
          <div className="px-6 py-4 border-b border-black/[0.06] dark:border-white/[0.04] flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300 dark:bg-slate-600'}`} />
                <span className="text-sm font-bold text-gray-700 dark:text-slate-200">Live Playground</span>
              </div>
              <Badge className="text-[10px] bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-700/30 font-bold">
                {messages.length} msg{messages.length !== 1 ? 's' : ''}
              </Badge>
            </div>
            <div className="flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-gray-300 dark:text-slate-600" />
              <span className="text-xs text-gray-400 dark:text-slate-500 font-medium">Preview mode</span>
            </div>
          </div>

          {/* Chat messages */}
          <div ref={chatRef} className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            {messages.map(msg => (
              <MessageBubble key={msg.id} msg={msg} agentName={agentName} onToggleThoughts={toggleThoughts} />
            ))}
            {typing && <TypingIndicator agentName={agentName} />}
          </div>

          {/* Quick test prompts */}
          <div className="px-6 pt-3 pb-2 border-t border-black/[0.05] dark:border-white/[0.04] flex-shrink-0">
            <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-2">Quick tests</p>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_TESTS.map(q => (
                <button key={q} onClick={() => { setInput(q); }}
                  className="px-3 py-1.5 rounded-xl text-[11px] font-medium border border-black/[0.07] dark:border-white/[0.07] bg-white/60 dark:bg-white/[0.04] text-gray-500 dark:text-slate-400 hover:border-violet-300 dark:hover:border-violet-700 hover:text-violet-600 dark:hover:text-violet-400 transition-all cursor-pointer leading-none">
                  {q.length > 32 ? q.slice(0, 32) + '…' : q}
                </button>
              ))}
            </div>
          </div>

          {/* Chat input */}
          <div className="px-6 py-4 border-t border-black/[0.06] dark:border-white/[0.04] flex-shrink-0">
            <div className="flex items-end gap-3">
              <div className="flex-1 relative">
                <textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
                  placeholder={`Message ${agentName}… (Enter to send)`}
                  rows={1}
                  className="w-full px-4 py-3 pr-12 rounded-2xl border border-black/[0.08] dark:border-white/[0.09] bg-white/80 dark:bg-white/[0.06] text-gray-900 dark:text-white text-sm focus:outline-none focus:border-violet-400 backdrop-blur-sm transition-all resize-none leading-relaxed placeholder:text-gray-300 dark:placeholder:text-slate-600 max-h-32"
                  style={{ height: 'auto' }}
                  onInput={e => { const t = e.target as HTMLTextAreaElement; t.style.height = 'auto'; t.style.height = Math.min(t.scrollHeight, 128) + 'px' }}
                />
                {input && (
                  <button onClick={() => setInput('')}
                    className="absolute right-3 top-3 text-gray-300 dark:text-slate-600 hover:text-gray-500 dark:hover:text-slate-400 cursor-pointer transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <button
                onClick={handleSend}
                disabled={!input.trim() || typing}
                className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-200 shadow-sm ${input.trim() && !typing ? 'bg-violet-600 hover:bg-violet-700 text-white shadow-violet-200 dark:shadow-violet-900/40 cursor-pointer hover:scale-105 active:scale-95' : 'bg-gray-100 dark:bg-slate-800 text-gray-300 dark:text-slate-600 cursor-not-allowed'}`}>
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[10px] text-gray-300 dark:text-slate-700 mt-2 text-center">
              Shift+Enter for new line · changes save automatically
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
