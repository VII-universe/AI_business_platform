export interface Tenant {
  id: string
  name: string
  slug: string
  ownerId: string
  plan: 'free' | 'starter' | 'pro' | 'agency'
  whiteLabel?: {
    domain?: string
    logoUrl?: string
    primaryColor?: string
    companyName?: string
  }
  createdAt: Date
  updatedAt: Date
}

export interface BrandBoard {
  id: string
  tenantId: string
  companyName: string
  logoUrl: string
  logoVariants: string[]
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    text: string
  }
  fonts: {
    heading: string
    body: string
  }
  brandVoice: string
  guidelinesPdfUrl?: string
  industry: string
  targetAudience: string
  brandPersonality: string[]
  createdAt: Date
  updatedAt: Date
}

export interface Lead {
  id: string
  tenantId: string
  email: string
  phone?: string
  firstName?: string
  lastName?: string
  company?: string
  source: string
  score: number
  stage: PipelineStage
  tags: string[]
  aiInsights?: string
  lastActivity: Date
  createdAt: Date
}

export type PipelineStage = 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost'

export interface Campaign {
  id: string
  tenantId: string
  name: string
  status: 'draft' | 'active' | 'paused' | 'completed'
  channels: CampaignChannel[]
  budget: number
  startDate?: Date
  endDate?: Date
  aiStrategy?: string
  kpis: Record<string, number>
  createdAt: Date
  updatedAt: Date
}

export type CampaignChannel = 'google_ads' | 'meta_ads' | 'email' | 'sms' | 'linkedin'

export interface ContentItem {
  id: string
  tenantId: string
  type: ContentType
  title: string
  body: string
  metadata?: Record<string, unknown>
  status: 'draft' | 'approved' | 'published'
  createdAt: Date
  updatedAt: Date
}

export type ContentType = 'blog_post' | 'social_post' | 'email' | 'ad_copy' | 'presentation' | 'sms'

export interface ModelConfig {
  id: string
  tenantId?: string
  moduleName: string
  provider: 'anthropic' | 'openai' | 'replicate'
  modelId: string
  systemPrompt?: string
  temperature?: number
  maxTokens?: number
  costLimitPerCall?: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface AIAuditLog {
  id: string
  tenantId: string
  moduleName: string
  modelId: string
  promptTokens: number
  completionTokens: number
  costUsd: number
  latencyMs: number
  success: boolean
  error?: string
  createdAt: Date
}

export interface OnboardingData {
  step1: {
    companyName: string
    industry: string
    companySize: string
    website?: string
  }
  step2: {
    goals: string[]
    primaryGoal: string
    timeframe: string
  }
  step3: {
    targetAge: string
    targetLocations: string[]
    targetInterests: string[]
    painPoints: string[]
  }
  step4: {
    competitors: string[]
  }
  step5: {
    tone: 'formal' | 'informal' | 'friendly' | 'professional' | 'playful'
    preferredColors: string[]
    referencesBrands: string[]
    personality: string[]
  }
}

export interface AIJobStatus {
  jobId: string
  status: 'waiting' | 'active' | 'completed' | 'failed'
  progress?: number
  result?: unknown
  error?: string
}
