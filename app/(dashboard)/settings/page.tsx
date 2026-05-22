'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import {
  Settings, User, Bell, Plug, CreditCard, Key, Users,
  Save, Copy, Eye, EyeOff, CheckCircle2, AlertCircle,
  MessageSquare, Globe, Mail, Zap, Plus, Trash2, Shield, Paintbrush,
} from 'lucide-react'
import {
  applySettings, loadSettings, DEFAULTS,
} from '@/components/shared/appearance-provider'
import { applyTheme } from '@/components/shared/theme-toggle'
import type { AppearanceSettings, AccentColor, FontSize, BgStyle, Density, RadiusStyle } from '@/components/shared/appearance-provider'

const tabs = [
  { id: 'account', label: 'Account', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'integrations', label: 'Integrations', icon: Plug },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'api', label: 'API Keys', icon: Key },
  { id: 'team', label: 'Team', icon: Users },
  { id: 'appearance', label: 'Appearance', icon: Paintbrush },
]

const INTEGRATIONS = [
  { id: 'zapier', name: 'Zapier', desc: 'Connect 5,000+ apps via automated workflows', icon: Zap, connected: true, color: 'text-orange-500' },
  { id: 'slack', name: 'Slack', desc: 'Get AI insights and alerts directly in Slack', icon: MessageSquare, connected: true, color: 'text-violet-500' },
  { id: 'hubspot', name: 'HubSpot', desc: 'Sync leads and deals with your CRM', icon: Globe, connected: false, color: 'text-orange-600' },
  { id: 'google_ads', name: 'Google Ads', desc: 'Import campaigns and sync performance data', icon: Globe, connected: true, color: 'text-blue-500' },
  { id: 'meta', name: 'Meta Business', desc: 'Manage Facebook & Instagram ad campaigns', icon: Globe, connected: true, color: 'text-blue-600' },
  { id: 'mailchimp', name: 'Mailchimp', desc: 'Sync contacts and automate email campaigns', icon: Mail, connected: false, color: 'text-amber-500' },
  { id: 'linkedin', name: 'LinkedIn Ads', desc: 'Import and manage LinkedIn campaigns', icon: Globe, connected: false, color: 'text-blue-700' },
  { id: 'salesforce', name: 'Salesforce', desc: 'Two-way sync with Salesforce CRM', icon: Globe, connected: false, color: 'text-cyan-600' },
]

const TEAM_MEMBERS = [
  { name: 'Jan Novák', email: 'jan@company.com', role: 'Owner', avatar: 'JN', status: 'active' },
  { name: 'Petra Horáčková', email: 'petra@company.com', role: 'Admin', avatar: 'PH', status: 'active' },
  { name: 'Martin Dvořák', email: 'martin@company.com', role: 'Editor', avatar: 'MD', status: 'active' },
  { name: 'Lucie Procházková', email: 'lucie@company.com', role: 'Viewer', avatar: 'LP', status: 'pending' },
]

const API_KEYS = [
  { name: 'Production', key: 'aip_live_sk_••••••••••••••••3f8a', created: 'Jan 15, 2026', lastUsed: '2h ago' },
  { name: 'Development', key: 'aip_dev_sk_••••••••••••••••9c2b', created: 'Feb 3, 2026', lastUsed: '5d ago' },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('account')

  // Appearance — local state, changes applied instantly to DOM
  const [appearance, setAppearance] = useState<AppearanceSettings>(DEFAULTS)
  const [isDark, setIsDark] = useState(false)
  useEffect(() => {
    setAppearance(loadSettings())
    setIsDark(document.documentElement.classList.contains('dark'))
  }, [])

  function changeAppearance(key: keyof AppearanceSettings, value: string) {
    const next = { ...appearance, [key]: value } as AppearanceSettings
    setAppearance(next)
    applySettings(next)
  }

  function toggleDark() {
    const next = !isDark
    setIsDark(next)
    applyTheme(next)
  }

  function resetAppearance() {
    setAppearance(DEFAULTS)
    applySettings(DEFAULTS)
  }
  const [saved, setSaved] = useState(false)
  const [showKey, setShowKey] = useState<string | null>(null)
  const [integrations, setIntegrations] = useState(
    Object.fromEntries(INTEGRATIONS.map(i => [i.id, i.connected]))
  )
  const [notifications, setNotifications] = useState({
    email_leads: true, email_campaigns: true, email_reports: false,
    sms_leads: false, sms_alerts: true,
    app_all: true, app_ai_insights: true, app_team: false,
  })

  function handleSave() {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="p-8 max-w-[1100px]">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-500 to-slate-700 flex items-center justify-center shadow-lg flex-shrink-0">
            <Settings className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Settings</h1>
            <p className="text-gray-500 dark:text-slate-400 text-lg mt-1">Manage your account, team, and integrations</p>
          </div>
        </div>
        <Button
          onClick={handleSave}
          className={`h-11 px-6 text-base font-semibold shadow-md transition-all ${saved ? 'bg-emerald-600 hover:bg-emerald-600' : 'bg-violet-600 hover:bg-violet-700 shadow-violet-300/30'}`}
        >
          {saved ? <><CheckCircle2 className="w-4 h-4 mr-2" /> Saved!</> : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
        </Button>
      </div>

      <div className="flex gap-7">
        {/* Sidebar nav */}
        <div className="w-52 flex-shrink-0">
          <div className="glass p-2 space-y-0.5">
            {tabs.map(tab => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${activeTab === tab.id ? 'bg-violet-600 text-white shadow-md shadow-violet-300/20' : 'text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-black/[0.04] dark:hover:bg-white/[0.06]'}`}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 ${activeTab === tab.id ? 'text-white' : 'text-gray-400 dark:text-slate-500'}`} />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">

          {/* ACCOUNT */}
          {activeTab === 'account' && (
            <div className="space-y-5">
              <div className="glass p-7">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5">Profile</h2>
                <div className="flex items-start gap-6 mb-7">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-violet-300/30">
                      JN
                    </div>
                    <button className="absolute -bottom-2 -right-2 w-7 h-7 rounded-lg bg-white dark:bg-slate-800 border border-black/10 dark:border-white/10 flex items-center justify-center text-gray-500 hover:text-violet-600 transition-colors shadow-sm cursor-pointer">
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div>
                    <p className="text-gray-900 dark:text-white font-bold text-lg">Jan Novák</p>
                    <p className="text-gray-400 dark:text-slate-500 text-sm">jan@company.com</p>
                    <Badge className="mt-2 bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-700/40 text-xs font-semibold">Owner</Badge>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-5">
                  {[
                    { label: 'First Name', value: 'Jan', placeholder: 'Jan' },
                    { label: 'Last Name', value: 'Novák', placeholder: 'Novák' },
                    { label: 'Email', value: 'jan@company.com', placeholder: 'email@company.com' },
                    { label: 'Phone', value: '+420 777 123 456', placeholder: '+420 ...' },
                  ].map(f => (
                    <div key={f.label}>
                      <Label className="text-gray-700 dark:text-slate-200 text-sm font-semibold mb-1.5 block">{f.label}</Label>
                      <Input defaultValue={f.value} placeholder={f.placeholder}
                        className="bg-white/60 dark:bg-white/[0.05] border-black/10 dark:border-white/10 text-gray-900 dark:text-white text-base h-11 focus:border-violet-400 backdrop-blur-sm" />
                    </div>
                  ))}
                  <div className="col-span-2">
                    <Label className="text-gray-700 dark:text-slate-200 text-sm font-semibold mb-1.5 block">Company Name</Label>
                    <Input defaultValue="AcmeCorp s.r.o." className="bg-white/60 dark:bg-white/[0.05] border-black/10 dark:border-white/10 text-gray-900 dark:text-white text-base h-11 focus:border-violet-400 backdrop-blur-sm" />
                  </div>
                </div>
              </div>

              <div className="glass p-7">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5">Security</h2>
                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-700 dark:text-slate-200 text-sm font-semibold mb-1.5 block">Current Password</Label>
                    <Input type="password" placeholder="••••••••••••"
                      className="bg-white/60 dark:bg-white/[0.05] border-black/10 dark:border-white/10 text-gray-900 dark:text-white text-base h-11 focus:border-violet-400 backdrop-blur-sm" />
                  </div>
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <Label className="text-gray-700 dark:text-slate-200 text-sm font-semibold mb-1.5 block">New Password</Label>
                      <Input type="password" placeholder="••••••••••••"
                        className="bg-white/60 dark:bg-white/[0.05] border-black/10 dark:border-white/10 text-gray-900 dark:text-white text-base h-11 focus:border-violet-400 backdrop-blur-sm" />
                    </div>
                    <div>
                      <Label className="text-gray-700 dark:text-slate-200 text-sm font-semibold mb-1.5 block">Confirm Password</Label>
                      <Input type="password" placeholder="••••••••••••"
                        className="bg-white/60 dark:bg-white/[0.05] border-black/10 dark:border-white/10 text-gray-900 dark:text-white text-base h-11 focus:border-violet-400 backdrop-blur-sm" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-black/[0.03] dark:bg-white/[0.04]">
                    <div className="flex items-center gap-3">
                      <Shield className="w-5 h-5 text-emerald-500" />
                      <div>
                        <p className="text-gray-800 dark:text-slate-200 font-semibold text-sm">Two-Factor Authentication</p>
                        <p className="text-gray-400 dark:text-slate-500 text-xs">Add an extra layer of security</p>
                      </div>
                    </div>
                    <Switch className="data-[state=checked]:bg-violet-600" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="glass p-7">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Notification Preferences</h2>
              {[
                {
                  title: 'Email Notifications', icon: Mail, items: [
                    { key: 'email_leads', label: 'New lead alerts', desc: 'Get notified when a high-score lead is added' },
                    { key: 'email_campaigns', label: 'Campaign updates', desc: 'Budget alerts and performance milestones' },
                    { key: 'email_reports', label: 'Weekly AI digest', desc: 'AI-generated insights every Monday morning' },
                  ]
                },
                {
                  title: 'SMS Notifications', icon: Bell, items: [
                    { key: 'sms_leads', label: 'Hot lead SMS', desc: 'Instant SMS when a lead scores 85+' },
                    { key: 'sms_alerts', label: 'Critical alerts', desc: 'Campaign budget exhausted or API errors' },
                  ]
                },
                {
                  title: 'In-App Notifications', icon: Bell, items: [
                    { key: 'app_all', label: 'All notifications', desc: 'Show all activity in the notification center' },
                    { key: 'app_ai_insights', label: 'AI insights', desc: 'Real-time AI recommendations and tips' },
                    { key: 'app_team', label: 'Team activity', desc: 'When teammates make changes' },
                  ]
                },
              ].map(section => {
                const Icon = section.icon
                return (
                  <div key={section.title} className="mb-7 last:mb-0">
                    <div className="flex items-center gap-2.5 mb-4">
                      <Icon className="w-5 h-5 text-gray-400 dark:text-slate-500" />
                      <h3 className="text-base font-bold text-gray-800 dark:text-slate-100">{section.title}</h3>
                    </div>
                    <div className="space-y-3">
                      {section.items.map(item => (
                        <div key={item.key} className="flex items-center justify-between p-4 rounded-xl bg-black/[0.03] dark:bg-white/[0.04] hover:bg-black/[0.05] dark:hover:bg-white/[0.06] transition-colors">
                          <div>
                            <p className="text-gray-800 dark:text-slate-200 font-semibold text-sm">{item.label}</p>
                            <p className="text-gray-400 dark:text-slate-500 text-xs mt-0.5">{item.desc}</p>
                          </div>
                          <Switch
                            checked={notifications[item.key as keyof typeof notifications]}
                            onCheckedChange={v => setNotifications(p => ({ ...p, [item.key]: v }))}
                            className="data-[state=checked]:bg-violet-600"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* INTEGRATIONS */}
          {activeTab === 'integrations' && (
            <div className="glass p-7">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Integrations</h2>
              <p className="text-gray-400 dark:text-slate-500 text-sm mb-6">Connect your favorite tools to automate your workflow</p>
              <div className="grid grid-cols-1 gap-3">
                {INTEGRATIONS.map(integration => {
                  const Icon = integration.icon
                  const connected = integrations[integration.id]
                  return (
                    <div key={integration.id} className="flex items-center gap-4 p-4 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] hover:bg-black/[0.04] dark:hover:bg-white/[0.06] transition-colors">
                      <div className="w-11 h-11 rounded-xl bg-white dark:bg-white/[0.08] border border-black/[0.07] dark:border-white/10 flex items-center justify-center flex-shrink-0 shadow-sm">
                        <Icon className={`w-5 h-5 ${integration.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-gray-800 dark:text-slate-200 font-semibold text-sm">{integration.name}</p>
                          {connected && (
                            <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Connected
                            </span>
                          )}
                        </div>
                        <p className="text-gray-400 dark:text-slate-500 text-xs mt-0.5">{integration.desc}</p>
                      </div>
                      <button
                        onClick={() => setIntegrations(p => ({ ...p, [integration.id]: !p[integration.id] }))}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all cursor-pointer flex-shrink-0 ${connected ? 'bg-black/[0.04] dark:bg-white/[0.06] border-black/10 dark:border-white/10 text-gray-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-700/40' : 'bg-violet-600 border-violet-600 text-white hover:bg-violet-700 shadow-sm shadow-violet-300/20'}`}
                      >
                        {connected ? 'Disconnect' : 'Connect'}
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* BILLING */}
          {activeTab === 'billing' && (
            <div className="space-y-5">
              <div className="bg-gradient-to-r from-violet-600 to-indigo-700 rounded-2xl p-7 text-white shadow-xl shadow-violet-300/25 dark:shadow-violet-900/25">
                <div className="flex items-start justify-between">
                  <div>
                    <Badge className="bg-white/20 text-white border-white/30 border text-sm font-bold mb-3">✦ Pro Plan</Badge>
                    <p className="text-5xl font-bold mb-1" style={{ fontFamily: 'var(--font-poppins)' }}>$99<span className="text-2xl font-normal text-white/70">/mo</span></p>
                    <p className="text-white/70 text-base">Billed monthly · Next renewal June 1, 2026</p>
                  </div>
                  <Button className="bg-white text-violet-700 hover:bg-violet-50 font-bold shadow-sm">
                    Manage Plan
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-7 pt-5 border-t border-white/20">
                  {[
                    { label: 'AI Credits Used', value: '12,450', limit: '50,000' },
                    { label: 'Team Members', value: '4', limit: '10' },
                    { label: 'Active Campaigns', value: '3', limit: '25' },
                  ].map(u => (
                    <div key={u.label}>
                      <p className="text-white/60 text-xs font-medium mb-1">{u.label}</p>
                      <p className="text-white font-bold text-lg">{u.value} <span className="text-white/50 font-normal text-sm">/ {u.limit}</span></p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass p-7">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5">Payment Method</h2>
                <div className="flex items-center gap-4 p-4 rounded-xl bg-black/[0.03] dark:bg-white/[0.04] mb-4">
                  <div className="w-12 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">VISA</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800 dark:text-slate-200 font-semibold text-sm">Visa ending in 4242</p>
                    <p className="text-gray-400 dark:text-slate-500 text-xs">Expires 08/2028</p>
                  </div>
                  <Badge className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700/40 text-xs">Default</Badge>
                </div>
                <Button variant="outline" className="border-black/10 dark:border-white/10 text-gray-600 dark:text-slate-300 bg-white/60 dark:bg-white/[0.05] hover:bg-black/[0.03] text-sm">
                  <Plus className="w-4 h-4 mr-2" /> Add Payment Method
                </Button>
              </div>

              <div className="glass p-7">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5">Invoice History</h2>
                <div className="divide-y divide-black/[0.05] dark:divide-white/[0.05]">
                  {[
                    { date: 'May 1, 2026', amount: '$99.00', status: 'Paid' },
                    { date: 'Apr 1, 2026', amount: '$99.00', status: 'Paid' },
                    { date: 'Mar 1, 2026', amount: '$99.00', status: 'Paid' },
                  ].map((inv, i) => (
                    <div key={i} className="flex items-center gap-4 py-3.5">
                      <div className="flex-1">
                        <p className="text-gray-700 dark:text-slate-200 font-medium text-sm">{inv.date}</p>
                      </div>
                      <span className="text-gray-900 dark:text-white font-bold">{inv.amount}</span>
                      <Badge className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700/40 text-xs">{inv.status}</Badge>
                      <button className="text-violet-600 dark:text-violet-400 text-xs font-semibold hover:underline cursor-pointer">Download</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* API KEYS */}
          {activeTab === 'api' && (
            <div className="glass p-7">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">API Keys</h2>
                  <p className="text-gray-400 dark:text-slate-500 text-sm mt-0.5">Use these keys to access the AIPlatform API</p>
                </div>
                <Button className="bg-violet-600 hover:bg-violet-700 text-white shadow-sm text-sm">
                  <Plus className="w-4 h-4 mr-2" /> Generate New Key
                </Button>
              </div>

              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/15 border border-amber-200 dark:border-amber-700/30 mb-6">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-500 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <p className="text-amber-700 dark:text-amber-300 text-sm">
                    Never share your API keys publicly. Treat them like passwords.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {API_KEYS.map(key => (
                  <div key={key.name} className="p-5 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.05] dark:border-white/[0.05]">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Key className="w-4 h-4 text-gray-400 dark:text-slate-500" />
                        <p className="text-gray-900 dark:text-white font-bold">{key.name}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setShowKey(showKey === key.name ? null : key.name)}
                          className="w-8 h-8 rounded-lg border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/[0.05] flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-white transition-colors cursor-pointer"
                        >
                          {showKey === key.name ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button className="w-8 h-8 rounded-lg border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/[0.05] flex items-center justify-center text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors cursor-pointer">
                          <Copy className="w-4 h-4" />
                        </button>
                        <button className="w-8 h-8 rounded-lg border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/[0.05] flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors cursor-pointer">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="font-mono text-sm bg-black/[0.04] dark:bg-white/[0.05] rounded-lg px-4 py-2.5 text-gray-600 dark:text-slate-300 mb-3">
                      {showKey === key.name ? key.key.replace(/•/g, 'x') : key.key}
                    </div>
                    <div className="flex gap-5 text-xs text-gray-400 dark:text-slate-500">
                      <span>Created: <span className="font-medium text-gray-600 dark:text-slate-300">{key.created}</span></span>
                      <span>Last used: <span className="font-medium text-gray-600 dark:text-slate-300">{key.lastUsed}</span></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TEAM */}
          {activeTab === 'team' && (
            <div className="glass p-7">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Team Members</h2>
                  <p className="text-gray-400 dark:text-slate-500 text-sm mt-0.5">4 of 10 seats used</p>
                </div>
                <Button className="bg-violet-600 hover:bg-violet-700 text-white shadow-sm text-sm">
                  <Plus className="w-4 h-4 mr-2" /> Invite Member
                </Button>
              </div>

              <div className="mb-6">
                <Input placeholder="Enter email address to invite..."
                  className="bg-white/60 dark:bg-white/[0.05] border-black/10 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-400 text-base h-11 focus:border-violet-400 backdrop-blur-sm" />
              </div>

              <div className="space-y-3">
                {TEAM_MEMBERS.map(member => (
                  <div key={member.email} className="flex items-center gap-4 p-4 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] hover:bg-black/[0.05] dark:hover:bg-white/[0.06] transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                      {member.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-gray-800 dark:text-slate-200 font-semibold text-sm">{member.name}</p>
                        {member.status === 'pending' && (
                          <span className="text-[11px] bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-700/40 px-2 py-0.5 rounded-full font-semibold">Pending</span>
                        )}
                      </div>
                      <p className="text-gray-400 dark:text-slate-500 text-xs">{member.email}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <select className="text-sm font-medium text-gray-600 dark:text-slate-300 bg-black/[0.04] dark:bg-white/[0.06] border border-black/10 dark:border-white/10 rounded-lg px-3 py-1.5 focus:outline-none focus:border-violet-400 cursor-pointer">
                        {['Owner', 'Admin', 'Editor', 'Viewer'].map(r => (
                          <option key={r} selected={r === member.role}>{r}</option>
                        ))}
                      </select>
                      {member.role !== 'Owner' && (
                        <button className="w-8 h-8 rounded-lg border border-black/10 dark:border-white/10 bg-white/60 dark:bg-white/[0.05] flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors cursor-pointer">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* APPEARANCE */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">

              {/* Dark mode */}
              <div className="glass p-7">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Theme</h2>
                <p className="text-gray-400 dark:text-slate-500 text-sm mb-5">Switch between light and dark interface</p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { id: false, label: 'Light Mode', desc: 'Clean and bright interface', icon: '☀️', bg: 'bg-white border-slate-200', preview: 'bg-gradient-to-br from-violet-50 to-white' },
                    { id: true,  label: 'Dark Mode',  desc: 'Easy on the eyes at night', icon: '🌙', bg: 'bg-[#0b0b1c] border-violet-900/50 text-white', preview: 'bg-gradient-to-br from-[#0b0b1c] to-[#0f0f2e]' },
                  ].map(opt => (
                    <button key={String(opt.id)} onClick={toggleDark}
                      className={`relative flex flex-col gap-3 p-5 rounded-2xl border-2 cursor-pointer transition-all text-left ${isDark === opt.id ? 'border-[var(--acc)] shadow-lg' : 'border-black/[0.07] dark:border-white/[0.07] hover:border-black/20 dark:hover:border-white/20'}`}>
                      <div className={`w-full h-16 rounded-xl border ${opt.preview} ${opt.id ? 'border-white/10' : 'border-black/[0.06]'} relative overflow-hidden`}>
                        <div className={`absolute inset-0 flex items-center justify-center text-2xl`}>{opt.icon}</div>
                        <div className={`absolute bottom-2 right-2 left-2 h-2 rounded-full opacity-30 ${opt.id ? 'bg-violet-400' : 'bg-violet-600'}`} />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold text-sm text-gray-800 dark:text-slate-100">{opt.label}</p>
                          <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">{opt.desc}</p>
                        </div>
                        {isDark === opt.id && (
                          <div className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] flex-shrink-0 acc-bg">✓</div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Accent color */}
              <div className="glass p-7">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Accent Color</h2>
                <p className="text-gray-400 dark:text-slate-500 text-sm mb-6">Used for active states, buttons and highlights throughout the app</p>
                <div className="grid grid-cols-4 gap-3">
                  {([
                    { id: 'violet', label: 'Violet', hex: '#7C3AED', ring: 'ring-violet-400' },
                    { id: 'blue',   label: 'Blue',   hex: '#2563EB', ring: 'ring-blue-400' },
                    { id: 'emerald',label: 'Emerald',hex: '#059669', ring: 'ring-emerald-400' },
                    { id: 'rose',   label: 'Rose',   hex: '#E11D48', ring: 'ring-rose-400' },
                    { id: 'amber',  label: 'Amber',  hex: '#D97706', ring: 'ring-amber-400' },
                    { id: 'indigo', label: 'Indigo', hex: '#4338CA', ring: 'ring-indigo-400' },
                    { id: 'cyan',   label: 'Cyan',   hex: '#0891B2', ring: 'ring-cyan-400' },
                    { id: 'pink',   label: 'Pink',   hex: '#DB2777', ring: 'ring-pink-400' },
                  ] as { id: AccentColor; label: string; hex: string; ring: string }[]).map(c => (
                    <button key={c.id} onClick={() => changeAppearance('accent', c.id)}
                      className={`relative flex flex-col items-center gap-2.5 p-4 rounded-2xl border-2 transition-all cursor-pointer group ${appearance.accent === c.id ? `border-[${c.hex}] shadow-md` : 'border-black/[0.07] dark:border-white/[0.07] hover:border-black/20 dark:hover:border-white/20'}`}
                      style={{ borderColor: appearance.accent === c.id ? c.hex : undefined }}>
                      <div className="w-12 h-12 rounded-xl shadow-md transition-transform group-hover:scale-105"
                        style={{ backgroundColor: c.hex, boxShadow: appearance.accent === c.id ? `0 4px 16px ${c.hex}55` : undefined }} />
                      <span className="text-xs font-semibold text-gray-600 dark:text-slate-300">{c.label}</span>
                      {appearance.accent === c.id && (
                        <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px]"
                          style={{ backgroundColor: c.hex }}>✓</div>
                      )}
                    </button>
                  ))}
                </div>

                {/* Live preview */}
                <div className="mt-6 p-5 rounded-2xl bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.05] dark:border-white/[0.05]">
                  <p className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest mb-4">Live Preview</p>
                  <div className="flex items-center gap-3 flex-wrap">
                    <button className="acc-bg text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all">Primary Button</button>
                    <button className="px-5 py-2.5 rounded-xl text-sm font-semibold border-2 acc-text acc-border bg-transparent transition-all">Outline Button</button>
                    <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl acc-light acc-text text-sm font-semibold">
                      <div className="w-2 h-2 rounded-full acc-bg" /> Active State
                    </div>
                    <div className="w-12 h-6 rounded-full acc-bg flex items-center justify-end pr-1">
                      <div className="w-4 h-4 rounded-full bg-white shadow" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Font size */}
              <div className="glass p-7">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Font Size</h2>
                <p className="text-gray-400 dark:text-slate-500 text-sm mb-5">Adjusts text size across the entire application</p>
                <div className="grid grid-cols-3 gap-3">
                  {([
                    { id: 'compact', label: 'Compact', desc: '14px base', size: 'text-sm' },
                    { id: 'default', label: 'Default', desc: '16px base', size: 'text-base' },
                    { id: 'large',   label: 'Large',   desc: '18px base', size: 'text-lg' },
                  ] as { id: FontSize; label: string; desc: string; size: string }[]).map(f => (
                    <button key={f.id} onClick={() => changeAppearance('fontSize', f.id)}
                      className={`flex flex-col items-center gap-3 p-5 rounded-2xl border-2 cursor-pointer transition-all ${appearance.fontSize === f.id ? 'border-[var(--acc)] shadow-md' : 'border-black/[0.07] dark:border-white/[0.07] hover:border-black/20 dark:hover:border-white/20'}`}>
                      <span className={`font-bold text-gray-900 dark:text-white ${f.size}`}>Aa</span>
                      <div className="text-center">
                        <p className="text-sm font-semibold text-gray-700 dark:text-slate-200">{f.label}</p>
                        <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5">{f.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Background style */}
              <div className="glass p-7">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Background Style</h2>
                <p className="text-gray-400 dark:text-slate-500 text-sm mb-5">Change the visual style of cards and backgrounds</p>
                <div className="grid grid-cols-3 gap-3">
                  {([
                    { id: 'glass',   label: 'Glassmorphism', desc: 'Frosted glass with gradient orbs', preview: 'bg-gradient-to-br from-violet-100 to-indigo-50' },
                    { id: 'minimal', label: 'Minimal',        desc: 'Clean solid white or dark surfaces', preview: 'bg-gray-50 dark:bg-slate-800' },
                    { id: 'mesh',    label: 'Mesh Gradient',  desc: 'Colorful mesh gradient background', preview: 'bg-gradient-to-br from-blue-100 via-pink-100 to-green-100' },
                  ] as { id: BgStyle; label: string; desc: string; preview: string }[]).map(b => (
                    <button key={b.id} onClick={() => changeAppearance('background', b.id)}
                      className={`flex flex-col gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all text-left ${appearance.background === b.id ? 'border-[var(--acc)] shadow-md' : 'border-black/[0.07] dark:border-white/[0.07] hover:border-black/20 dark:hover:border-white/20'}`}>
                      <div className={`w-full h-16 rounded-xl ${b.preview} border border-black/[0.06] dark:border-white/[0.06]`} />
                      <div>
                        <p className="text-sm font-semibold text-gray-700 dark:text-slate-200">{b.label}</p>
                        <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5 leading-relaxed">{b.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Border radius */}
              <div className="glass p-7">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Corner Style</h2>
                <p className="text-gray-400 dark:text-slate-500 text-sm mb-5">Controls roundness of cards and buttons</p>
                <div className="grid grid-cols-3 gap-3">
                  {([
                    { id: 'sharp',   label: 'Sharp',   r: '4px' },
                    { id: 'default', label: 'Rounded', r: '16px' },
                    { id: 'pill',    label: 'Pill',    r: '28px' },
                  ] as { id: RadiusStyle; label: string; r: string }[]).map(r => (
                    <button key={r.id} onClick={() => changeAppearance('radius', r.id)}
                      className={`flex flex-col items-center gap-3 p-5 rounded-2xl border-2 cursor-pointer transition-all ${appearance.radius === r.id ? 'border-[var(--acc)] shadow-md' : 'border-black/[0.07] dark:border-white/[0.07] hover:border-black/20 dark:hover:border-white/20'}`}>
                      <div className="w-14 h-10 bg-gradient-to-br acc-bg opacity-70"
                        style={{ borderRadius: r.r }} />
                      <p className="text-sm font-semibold text-gray-700 dark:text-slate-200">{r.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Density */}
              <div className="glass p-7">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Layout Density</h2>
                <p className="text-gray-400 dark:text-slate-500 text-sm mb-5">Controls spacing and padding throughout the app</p>
                <div className="grid grid-cols-3 gap-3">
                  {([
                    { id: 'compact',  label: 'Compact',     desc: 'Smaller padding, more content on screen', lines: [2, 4, 3] },
                    { id: 'default',  label: 'Comfortable', desc: 'Balanced spacing (recommended)', lines: [2, 3, 2] },
                    { id: 'spacious', label: 'Spacious',    desc: 'More breathing room between elements', lines: [1, 2, 1] },
                  ] as { id: Density; label: string; desc: string; lines: number[] }[]).map(d => (
                    <button key={d.id} onClick={() => changeAppearance('density', d.id)}
                      className={`flex flex-col gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all text-left ${appearance.density === d.id ? 'border-[var(--acc)] shadow-md' : 'border-black/[0.07] dark:border-white/[0.07] hover:border-black/20 dark:hover:border-white/20'}`}>
                      <div className="w-full h-16 rounded-xl bg-black/[0.03] dark:bg-white/[0.05] p-2 flex flex-col justify-around">
                        {d.lines.map((w, i) => (
                          <div key={i} className="h-1.5 rounded-full bg-gray-200 dark:bg-white/[0.15]" style={{ width: `${w * 20}%` }} />
                        ))}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-700 dark:text-slate-200">{d.label}</p>
                        <p className="text-xs text-gray-400 dark:text-slate-500 mt-0.5 leading-relaxed">{d.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Reset */}
              <div className="glass p-6 flex items-center justify-between">
                <div>
                  <p className="text-gray-800 dark:text-slate-200 font-semibold">Reset to Defaults</p>
                  <p className="text-gray-400 dark:text-slate-500 text-sm">Restore all appearance settings to original values</p>
                </div>
                <Button variant="outline"
                  onClick={resetAppearance}
                  className="border-black/10 dark:border-white/10 text-gray-600 dark:text-slate-300 bg-white/60 dark:bg-white/[0.05] hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-700/40 transition-all">
                  Reset All
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
