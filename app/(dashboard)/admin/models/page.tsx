'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Brain, DollarSign, Zap, BarChart2, Edit2, Save, AlertCircle } from 'lucide-react'

const MODEL_CONFIGS = [
  { module: 'brand_strategy', label: 'Brand Strategy', model: 'claude-sonnet-4-6', temp: 0.8, tokens: 4096, costMonth: 2.40 },
  { module: 'campaign_strategy', label: 'Campaign Strategy', model: 'claude-sonnet-4-6', temp: 0.7, tokens: 6000, costMonth: 8.20 },
  { module: 'campaign_optimization', label: 'Campaign Optimization', model: 'claude-sonnet-4-6', temp: 0.5, tokens: 2000, costMonth: 3.10 },
  { module: 'content_blog_post', label: 'Blog Post Generator', model: 'claude-sonnet-4-6', temp: 0.8, tokens: 4000, costMonth: 5.60 },
  { module: 'content_ad_copy', label: 'Ad Copy Generator', model: 'claude-sonnet-4-6', temp: 0.9, tokens: 2000, costMonth: 1.80 },
  { module: 'content_email', label: 'Email Generator', model: 'claude-sonnet-4-6', temp: 0.7, tokens: 2000, costMonth: 0.90 },
  { module: 'lead_scoring', label: 'Lead Scoring', model: 'claude-sonnet-4-6', temp: 0.3, tokens: 1000, costMonth: 0.40 },
  { module: 'weekly_digest', label: 'Weekly AI Digest', model: 'claude-sonnet-4-6', temp: 0.7, tokens: 3000, costMonth: 0.60 },
]

const MODELS = [
  { id: 'claude-sonnet-4-6', label: 'Claude Sonnet 4.6' },
  { id: 'claude-opus-4-5', label: 'Claude Opus 4.5' },
  { id: 'claude-haiku-4-5', label: 'Claude Haiku 4.5' },
]

const AUDIT_LOG = [
  { module: 'brand_strategy', model: 'claude-sonnet-4-6', tokens: 3420, cost: 0.0103, latency: 4200, success: true, time: '2m ago' },
  { module: 'content_ad_copy', model: 'claude-sonnet-4-6', tokens: 1230, cost: 0.0037, latency: 1800, success: true, time: '15m ago' },
  { module: 'campaign_strategy', model: 'claude-sonnet-4-6', tokens: 5100, cost: 0.0153, latency: 6500, success: true, time: '1h ago' },
  { module: 'lead_scoring', model: 'claude-sonnet-4-6', tokens: 890, cost: 0.0027, latency: 1200, success: true, time: '2h ago' },
  { module: 'content_email', model: 'claude-sonnet-4-6', tokens: 1560, cost: 0.0047, latency: 2100, success: false, time: '3h ago' },
]

const tabs = ['Module Configs', 'Audit Log', 'Cost Analysis']

export default function ModelControlPage() {
  const [editing, setEditing] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('Module Configs')

  const totalCostMonth = MODEL_CONFIGS.reduce((sum, c) => sum + c.costMonth, 0)

  return (
    <div className="p-8 max-w-[1400px]">
      {/* Header */}
      <div className="flex items-start gap-4 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-700 flex items-center justify-center shadow-lg shadow-violet-300/40 dark:shadow-violet-900/30 flex-shrink-0">
          <Brain className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Model Control Panel</h1>
          <p className="text-gray-500 dark:text-slate-400 text-lg mt-1">Configure AI models, prompts, and cost limits per module</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-7">
        {[
          { label: 'Total AI Modules', value: MODEL_CONFIGS.length.toString(), icon: Brain, gradient: 'from-violet-500 to-indigo-700' },
          { label: 'Cost This Month', value: `$${totalCostMonth.toFixed(2)}`, icon: DollarSign, gradient: 'from-emerald-400 to-teal-600' },
          { label: 'Avg Latency', value: '2.8s', icon: Zap, gradient: 'from-amber-400 to-orange-500' },
          { label: 'Success Rate', value: '98.4%', icon: BarChart2, gradient: 'from-blue-500 to-indigo-600' },
        ].map(s => {
          const Icon = s.icon
          return (
            <div key={s.label} className={`bg-gradient-to-br ${s.gradient} rounded-2xl p-5 text-white shadow-lg`}>
              <Icon className="w-6 h-6 mb-3 opacity-80" />
              <p className="text-3xl font-bold" style={{ fontFamily: 'var(--font-poppins)' }}>{s.value}</p>
              <p className="text-white/70 text-sm font-medium mt-1">{s.label}</p>
            </div>
          )
        })}
      </div>

      {/* Tabs */}
      <div className="glass p-1.5 inline-flex gap-1 mb-7 rounded-2xl">
        {tabs.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer ${activeTab === tab ? 'bg-violet-600 text-white shadow-md shadow-violet-300/30' : 'text-gray-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.06]'}`}>
            {tab}
          </button>
        ))}
      </div>

      {/* Module Configs */}
      {activeTab === 'Module Configs' && (
        <div className="space-y-3">
          {MODEL_CONFIGS.map(config => (
            <div key={config.module} className="glass p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1.5">
                    <p className="text-gray-900 dark:text-white font-semibold text-base">{config.label}</p>
                    <span className="text-xs font-mono bg-black/[0.05] dark:bg-white/[0.07] text-gray-500 dark:text-slate-400 px-2.5 py-1 rounded-lg">
                      {config.module}
                    </span>
                  </div>
                  <div className="flex items-center gap-5 text-sm text-gray-400 dark:text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
                      <span className="text-gray-600 dark:text-slate-300 font-medium">{config.model}</span>
                    </span>
                    <span>temp: <span className="text-gray-700 dark:text-slate-200 font-semibold">{config.temp}</span></span>
                    <span>max tokens: <span className="text-gray-700 dark:text-slate-200 font-semibold">{config.tokens.toLocaleString('en-US')}</span></span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold">${config.costMonth.toFixed(2)}/mo</span>
                  </div>
                </div>
                <button
                  onClick={() => setEditing(editing === config.module ? null : config.module)}
                  className="w-9 h-9 rounded-xl border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/[0.05] flex items-center justify-center text-gray-400 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 hover:border-violet-300 dark:hover:border-violet-700 transition-all backdrop-blur-sm cursor-pointer flex-shrink-0 ml-4"
                >
                  {editing === config.module ? <Save className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                </button>
              </div>

              {editing === config.module && (
                <div className="mt-5 pt-5 border-t border-black/[0.06] dark:border-white/[0.06] grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-600 dark:text-slate-300 text-sm font-semibold mb-1.5 block">Model</Label>
                    <Select defaultValue={config.model}>
                      <SelectTrigger className="bg-white/60 dark:bg-white/[0.05] border-black/10 dark:border-white/10 text-gray-900 dark:text-white backdrop-blur-sm focus:border-violet-400">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white/90 dark:bg-[#0c0b1e]/90 border-black/10 dark:border-white/10 backdrop-blur-xl">
                        {MODELS.map(m => (
                          <SelectItem key={m.id} value={m.id} className="text-gray-700 dark:text-slate-200 focus:bg-violet-50 dark:focus:bg-violet-900/30">
                            {m.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-gray-600 dark:text-slate-300 text-sm font-semibold mb-1.5 block">Temperature</Label>
                    <Input defaultValue={config.temp} type="number" min="0" max="1" step="0.1"
                      className="bg-white/60 dark:bg-white/[0.05] border-black/10 dark:border-white/10 text-gray-900 dark:text-white backdrop-blur-sm focus:border-violet-400" />
                  </div>
                  <div>
                    <Label className="text-gray-600 dark:text-slate-300 text-sm font-semibold mb-1.5 block">Max Tokens</Label>
                    <Input defaultValue={config.tokens} type="number"
                      className="bg-white/60 dark:bg-white/[0.05] border-black/10 dark:border-white/10 text-gray-900 dark:text-white backdrop-blur-sm focus:border-violet-400" />
                  </div>
                  <div>
                    <Label className="text-gray-600 dark:text-slate-300 text-sm font-semibold mb-1.5 block">Cost Limit per Call ($)</Label>
                    <Input placeholder="0.50" type="number" step="0.01"
                      className="bg-white/60 dark:bg-white/[0.05] border-black/10 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 backdrop-blur-sm focus:border-violet-400" />
                  </div>
                  <div className="col-span-2">
                    <Label className="text-gray-600 dark:text-slate-300 text-sm font-semibold mb-1.5 block">System Prompt</Label>
                    <Textarea placeholder="Enter custom system prompt..."
                      className="bg-white/60 dark:bg-white/[0.05] border-black/10 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-slate-500 resize-none h-20 backdrop-blur-sm focus:border-violet-400" />
                  </div>
                  <div className="col-span-2 flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setEditing(null)}
                      className="text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-white">
                      Cancel
                    </Button>
                    <Button size="sm" onClick={() => setEditing(null)}
                      className="bg-violet-600 hover:bg-violet-700 text-white shadow-sm">
                      <Save className="w-3.5 h-3.5 mr-1.5" /> Save Config
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Audit Log */}
      {activeTab === 'Audit Log' && (
        <div className="glass overflow-hidden">
          <div className="px-6 py-5 border-b border-black/[0.06] dark:border-white/[0.06]">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">AI Audit Log</h2>
            <p className="text-gray-400 dark:text-slate-500 text-sm mt-0.5">Every AI call logged with tokens, cost, and latency</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-black/[0.06] dark:border-white/[0.06]">
                  {['Module', 'Model', 'Tokens', 'Cost', 'Latency', 'Status', 'Time'].map(h => (
                    <th key={h} className="text-left px-5 py-4 text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {AUDIT_LOG.map((log, i) => (
                  <tr key={i} className={`hover:bg-black/[0.02] dark:hover:bg-white/[0.03] transition-colors ${i < AUDIT_LOG.length - 1 ? 'border-b border-black/[0.04] dark:border-white/[0.04]' : ''}`}>
                    <td className="px-5 py-4 text-gray-700 dark:text-slate-200 font-mono text-sm font-medium">{log.module}</td>
                    <td className="px-5 py-4 text-gray-500 dark:text-slate-400 text-sm">{log.model}</td>
                    <td className="px-5 py-4 text-gray-700 dark:text-slate-200 text-sm font-semibold">{log.tokens.toLocaleString('en-US')}</td>
                    <td className="px-5 py-4 text-emerald-600 dark:text-emerald-400 text-sm font-semibold">${log.cost.toFixed(4)}</td>
                    <td className="px-5 py-4 text-gray-500 dark:text-slate-400 text-sm">{(log.latency / 1000).toFixed(1)}s</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${
                        log.success
                          ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300'
                          : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${log.success ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        {log.success ? 'success' : 'failed'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-400 dark:text-slate-500 text-sm">{log.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Cost Analysis */}
      {activeTab === 'Cost Analysis' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Cost by Module</h2>
            <p className="text-gray-400 dark:text-slate-500 text-sm mb-5">This month's spending breakdown</p>
            <div className="space-y-4">
              {MODEL_CONFIGS.sort((a, b) => b.costMonth - a.costMonth).map(config => (
                <div key={config.module}>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-gray-700 dark:text-slate-200 text-sm font-semibold">{config.label}</span>
                    <span className="text-emerald-600 dark:text-emerald-400 text-sm font-bold">${config.costMonth.toFixed(2)}</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-black/[0.06] dark:bg-white/[0.07] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-600 transition-all duration-500"
                      style={{ width: `${(config.costMonth / totalCostMonth) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
              <div className="pt-3 border-t border-black/[0.06] dark:border-white/[0.06] flex justify-between items-center">
                <span className="text-gray-900 dark:text-white font-bold text-base">Total</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold text-xl">${totalCostMonth.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="glass p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Cost Projections</h2>
            <p className="text-gray-400 dark:text-slate-500 text-sm mb-5">Estimated spending over time</p>
            <div className="space-y-3">
              {[
                { period: 'Today', cost: (totalCostMonth / 30).toFixed(2) },
                { period: 'This Week', cost: (totalCostMonth / 4).toFixed(2) },
                { period: 'This Month (actual)', cost: totalCostMonth.toFixed(2) },
                { period: 'Projected Annual', cost: (totalCostMonth * 12).toFixed(2) },
              ].map(item => (
                <div key={item.period} className="flex justify-between items-center p-4 rounded-xl bg-black/[0.03] dark:bg-white/[0.04] hover:bg-black/[0.05] dark:hover:bg-white/[0.07] transition-colors">
                  <span className="text-gray-700 dark:text-slate-200 font-medium">{item.period}</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold text-lg">${item.cost}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/15 border border-amber-200 dark:border-amber-700/30">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-amber-500 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-amber-700 dark:text-amber-300 text-sm">
                  Set cost limits per module to prevent unexpected charges.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
