'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { Check, Building2, Target, Users, Globe, Palette, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react'
import type { OnboardingData } from '@/types'

const STEPS = [
  { id: 1, label: 'Company', icon: Building2 },
  { id: 2, label: 'Goals', icon: Target },
  { id: 3, label: 'Audience', icon: Users },
  { id: 4, label: 'Competitors', icon: Globe },
  { id: 5, label: 'Brand Style', icon: Palette },
]

const INDUSTRIES = ['SaaS / Tech', 'E-commerce', 'Agency / Marketing', 'Healthcare', 'Real Estate', 'Finance', 'Education', 'Hospitality', 'Consulting', 'Other']
const COMPANY_SIZES = ['1–10', '11–50', '51–200', '201–1000', '1000+']
const GOALS = ['Generate more leads', 'Increase brand awareness', 'Drive more sales', 'Improve customer retention', 'Launch new product', 'Enter new market']
const TIMEFRAMES = ['1–3 months', '3–6 months', '6–12 months', '12+ months']
const TONES = ['formal', 'informal', 'friendly', 'professional', 'playful'] as const
const PERSONALITIES = ['Innovative', 'Trustworthy', 'Bold', 'Approachable', 'Premium', 'Playful', 'Expert', 'Empathetic', 'Disruptive', 'Reliable']
const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#f97316']

const DEFAULT_DATA: OnboardingData = {
  step1: { companyName: '', industry: '', companySize: '', website: '' },
  step2: { goals: [], primaryGoal: '', timeframe: '' },
  step3: { targetAge: '', targetLocations: [], targetInterests: [], painPoints: [] },
  step4: { competitors: ['', '', ''] },
  step5: { tone: 'professional', preferredColors: [], referencesBrands: [], personality: [] },
}

function ToggleBadge({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'px-3 py-1.5 rounded-full text-sm border transition-all',
        active
          ? 'bg-purple-600 border-purple-500 text-white'
          : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600 hover:text-white'
      )}
    >
      {children}
    </button>
  )
}

export function OnboardingWizard() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [data, setData] = useState<OnboardingData>(DEFAULT_DATA)
  const [loading, setLoading] = useState(false)

  function toggle<T>(arr: T[], value: T): T[] {
    return arr.includes(value) ? arr.filter(v => v !== value) : [...arr, value]
  }

  async function handleFinish() {
    setLoading(true)
    try {
      const res = await fetch('/api/onboarding/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) router.push('/dashboard/brand')
    } finally {
      setLoading(false)
    }
  }

  const progress = ((currentStep - 1) / (STEPS.length - 1)) * 100

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-purple-600 mb-4">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Set up your workspace</h1>
          <p className="text-slate-400 mt-1">Let's build your AI-powered brand in 5 steps</p>
        </div>

        {/* Steps */}
        <div className="flex items-center justify-between mb-8 relative">
          <div className="absolute left-0 right-0 top-4 h-0.5 bg-slate-800 z-0" />
          <div
            className="absolute left-0 top-4 h-0.5 bg-purple-600 z-0 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
          {STEPS.map(step => {
            const Icon = step.icon
            const done = currentStep > step.id
            const active = currentStep === step.id
            return (
              <div key={step.id} className="flex flex-col items-center gap-2 z-10">
                <div className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all',
                  done ? 'bg-purple-600 border-purple-600' : active ? 'bg-slate-900 border-purple-500' : 'bg-slate-900 border-slate-700'
                )}>
                  {done ? <Check className="w-4 h-4 text-white" /> : <Icon className={cn('w-4 h-4', active ? 'text-purple-400' : 'text-slate-600')} />}
                </div>
                <span className={cn('text-xs', active ? 'text-purple-400 font-medium' : done ? 'text-slate-400' : 'text-slate-600')}>{step.label}</span>
              </div>
            )
          })}
        </div>

        {/* Step Content */}
        <Card className="bg-slate-900 border-slate-800 p-6">
          {currentStep === 1 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-white">Tell us about your company</h2>
              <div>
                <Label className="text-slate-300">Company name *</Label>
                <Input
                  value={data.step1.companyName}
                  onChange={e => setData(d => ({ ...d, step1: { ...d.step1, companyName: e.target.value } }))}
                  placeholder="Acme Corp"
                  className="mt-1.5 bg-slate-800 border-slate-700 text-white"
                />
              </div>
              <div>
                <Label className="text-slate-300">Industry *</Label>
                <div className="flex flex-wrap gap-2 mt-1.5">
                  {INDUSTRIES.map(ind => (
                    <ToggleBadge key={ind} active={data.step1.industry === ind} onClick={() => setData(d => ({ ...d, step1: { ...d.step1, industry: ind } }))}>
                      {ind}
                    </ToggleBadge>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-slate-300">Company size</Label>
                <div className="flex gap-2 mt-1.5">
                  {COMPANY_SIZES.map(size => (
                    <ToggleBadge key={size} active={data.step1.companySize === size} onClick={() => setData(d => ({ ...d, step1: { ...d.step1, companySize: size } }))}>
                      {size}
                    </ToggleBadge>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-slate-300">Website (optional)</Label>
                <Input
                  value={data.step1.website ?? ''}
                  onChange={e => setData(d => ({ ...d, step1: { ...d.step1, website: e.target.value } }))}
                  placeholder="https://yourcompany.com"
                  className="mt-1.5 bg-slate-800 border-slate-700 text-white"
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-white">What are your business goals?</h2>
              <div>
                <Label className="text-slate-300">Select all that apply *</Label>
                <div className="flex flex-wrap gap-2 mt-1.5">
                  {GOALS.map(goal => (
                    <ToggleBadge key={goal} active={data.step2.goals.includes(goal)} onClick={() => setData(d => ({ ...d, step2: { ...d.step2, goals: toggle(d.step2.goals, goal) } }))}>
                      {goal}
                    </ToggleBadge>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-slate-300">Primary goal *</Label>
                <div className="flex flex-wrap gap-2 mt-1.5">
                  {data.step2.goals.map(goal => (
                    <ToggleBadge key={goal} active={data.step2.primaryGoal === goal} onClick={() => setData(d => ({ ...d, step2: { ...d.step2, primaryGoal: goal } }))}>
                      {goal}
                    </ToggleBadge>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-slate-300">Timeframe to achieve goals</Label>
                <div className="flex gap-2 mt-1.5">
                  {TIMEFRAMES.map(tf => (
                    <ToggleBadge key={tf} active={data.step2.timeframe === tf} onClick={() => setData(d => ({ ...d, step2: { ...d.step2, timeframe: tf } }))}>
                      {tf}
                    </ToggleBadge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-white">Who is your target audience?</h2>
              <div>
                <Label className="text-slate-300">Age range</Label>
                <div className="flex gap-2 mt-1.5">
                  {['18-24', '25-34', '35-44', '45-54', '55+', 'All ages'].map(age => (
                    <ToggleBadge key={age} active={data.step3.targetAge === age} onClick={() => setData(d => ({ ...d, step3: { ...d.step3, targetAge: age } }))}>
                      {age}
                    </ToggleBadge>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-slate-300">Target locations (press Enter to add)</Label>
                <Input
                  placeholder="e.g. United States, Europe"
                  className="mt-1.5 bg-slate-800 border-slate-700 text-white"
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      const val = (e.target as HTMLInputElement).value.trim()
                      if (val) {
                        setData(d => ({ ...d, step3: { ...d.step3, targetLocations: [...d.step3.targetLocations, val] } }))
                        ;(e.target as HTMLInputElement).value = ''
                      }
                    }
                  }}
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {data.step3.targetLocations.map(loc => (
                    <Badge key={loc} variant="secondary" className="cursor-pointer" onClick={() => setData(d => ({ ...d, step3: { ...d.step3, targetLocations: d.step3.targetLocations.filter(l => l !== loc) } }))}>
                      {loc} ×
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-slate-300">Main pain points of your audience</Label>
                <Textarea
                  placeholder="e.g. Not enough time, high costs, lack of automation..."
                  className="mt-1.5 bg-slate-800 border-slate-700 text-white resize-none"
                  rows={3}
                  onChange={e => setData(d => ({ ...d, step3: { ...d.step3, painPoints: e.target.value.split(',').map(s => s.trim()).filter(Boolean) } }))}
                />
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-white">Who are your main competitors?</h2>
              <p className="text-slate-400 text-sm">We'll analyze them to give you a competitive edge</p>
              {data.step4.competitors.map((comp, i) => (
                <div key={i}>
                  <Label className="text-slate-300">Competitor {i + 1} {i === 0 ? '*' : '(optional)'}</Label>
                  <Input
                    value={comp}
                    onChange={e => setData(d => {
                      const competitors = [...d.step4.competitors]
                      competitors[i] = e.target.value
                      return { ...d, step4: { competitors } }
                    })}
                    placeholder="https://competitor.com"
                    className="mt-1.5 bg-slate-800 border-slate-700 text-white"
                  />
                </div>
              ))}
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-5">
              <h2 className="text-lg font-semibold text-white">Define your brand style</h2>
              <div>
                <Label className="text-slate-300">Brand tone</Label>
                <div className="flex flex-wrap gap-2 mt-1.5">
                  {TONES.map(tone => (
                    <ToggleBadge key={tone} active={data.step5.tone === tone} onClick={() => setData(d => ({ ...d, step5: { ...d.step5, tone } }))}>
                      {tone.charAt(0).toUpperCase() + tone.slice(1)}
                    </ToggleBadge>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-slate-300">Preferred colors</Label>
                <div className="flex gap-3 mt-2">
                  {COLORS.map(color => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setData(d => ({ ...d, step5: { ...d.step5, preferredColors: toggle(d.step5.preferredColors, color) } }))}
                      className={cn('w-8 h-8 rounded-full border-2 transition-all', data.step5.preferredColors.includes(color) ? 'border-white scale-110' : 'border-transparent')}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-slate-300">Brand personality traits</Label>
                <div className="flex flex-wrap gap-2 mt-1.5">
                  {PERSONALITIES.map(trait => (
                    <ToggleBadge key={trait} active={data.step5.personality.includes(trait)} onClick={() => setData(d => ({ ...d, step5: { ...d.step5, personality: toggle(d.step5.personality, trait) } }))}>
                      {trait}
                    </ToggleBadge>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-slate-300">Reference brands (press Enter to add)</Label>
                <Input
                  placeholder="e.g. Apple, Nike, Stripe"
                  className="mt-1.5 bg-slate-800 border-slate-700 text-white"
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      const val = (e.target as HTMLInputElement).value.trim()
                      if (val) {
                        setData(d => ({ ...d, step5: { ...d.step5, referencesBrands: [...d.step5.referencesBrands, val] } }))
                        ;(e.target as HTMLInputElement).value = ''
                      }
                    }
                  }}
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {data.step5.referencesBrands.map(brand => (
                    <Badge key={brand} variant="secondary" className="cursor-pointer" onClick={() => setData(d => ({ ...d, step5: { ...d.step5, referencesBrands: d.step5.referencesBrands.filter(b => b !== brand) } }))}>
                      {brand} ×
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-800">
            <Button
              variant="ghost"
              onClick={() => setCurrentStep(s => s - 1)}
              disabled={currentStep === 1}
              className="text-slate-400 hover:text-white"
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Back
            </Button>

            {currentStep < STEPS.length ? (
              <Button
                onClick={() => setCurrentStep(s => s + 1)}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                Continue <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : (
              <Button
                onClick={handleFinish}
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                {loading ? (
                  <>Generating your brand...</>
                ) : (
                  <><Sparkles className="w-4 h-4 mr-1" /> Generate Brand AI</>
                )}
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
