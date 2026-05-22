import { callAI, callAIWithStructuredOutput } from '@/lib/ai/anthropic'
import { getBrandBoard } from '@/lib/services/brand'
import { createAdminSupabaseClient } from '@/lib/db/supabase'
import type { Campaign, CampaignChannel } from '@/types'

interface CampaignBrief {
  objective: string
  budget: number
  duration: number // days
  targetAudience: string
  channels: CampaignChannel[]
}

interface CampaignStrategyOutput {
  name: string
  strategy: string
  channels: Array<{
    channel: CampaignChannel
    budgetPercent: number
    objective: string
    targeting: object
    headlines: string[]
    descriptions: string[]
    cta: string
  }>
  kpis: Record<string, number>
  timeline: string
  estimatedReach: number
}

const CAMPAIGN_STRATEGY_SCHEMA = `{
  "name": "campaign name string",
  "strategy": "overall strategy description",
  "channels": [{
    "channel": "google_ads|meta_ads|email|sms|linkedin",
    "budgetPercent": 30,
    "objective": "channel objective",
    "targeting": {},
    "headlines": ["headline 1", "headline 2"],
    "descriptions": ["desc 1"],
    "cta": "call to action text"
  }],
  "kpis": { "impressions": 100000, "clicks": 5000, "conversions": 200, "ctr": 5 },
  "timeline": "week by week timeline",
  "estimatedReach": 50000
}`

export async function generateCampaignStrategy(
  tenantId: string,
  brief: CampaignBrief
): Promise<CampaignStrategyOutput> {
  const brandBoard = await getBrandBoard(tenantId)

  const prompt = `You are an expert digital marketing strategist. Create a comprehensive campaign strategy.

${brandBoard ? `BRAND: ${brandBoard.companyName} (${brandBoard.industry})` : ''}

CAMPAIGN BRIEF:
- Objective: ${brief.objective}
- Total Budget: $${brief.budget}
- Duration: ${brief.duration} days
- Target Audience: ${brief.targetAudience}
- Channels: ${brief.channels.join(', ')}

Create a detailed campaign strategy with channel-specific tactics, targeting, ad copy, and KPI projections.`

  return callAIWithStructuredOutput<CampaignStrategyOutput>({
    tenantId,
    moduleName: 'campaign_strategy',
    userPrompt: prompt,
    schema: CAMPAIGN_STRATEGY_SCHEMA,
    modelId: 'claude-sonnet-4-6',
    maxTokens: 6000,
  })
}

export async function analyzeCampaignPerformance(
  tenantId: string,
  campaignId: string,
  metrics: Record<string, number>
): Promise<string> {
  const prompt = `Analyze this campaign performance and provide optimization recommendations.

METRICS:
${Object.entries(metrics).map(([k, v]) => `- ${k}: ${v}`).join('\n')}

Provide:
1. Performance assessment (what's working, what's not)
2. Top 3 immediate optimization actions
3. Budget reallocation recommendations
4. A/B test suggestions
5. 7-day performance forecast if changes are implemented`

  const result = await callAI({
    tenantId,
    moduleName: 'campaign_optimization',
    userPrompt: prompt,
    modelId: 'claude-sonnet-4-6',
    maxTokens: 2000,
  })

  return result.content
}

export async function createCampaign(
  tenantId: string,
  brief: CampaignBrief
): Promise<Campaign> {
  const supabase = createAdminSupabaseClient()
  const strategy = await generateCampaignStrategy(tenantId, brief)

  const { data, error } = await supabase
    .from('campaigns')
    .insert({
      tenant_id: tenantId,
      name: strategy.name,
      status: 'draft',
      channels: brief.channels,
      budget: brief.budget,
      ai_strategy: strategy.strategy,
      kpis: strategy.kpis,
    })
    .select()
    .single()

  if (error) throw new Error(`Failed to create campaign: ${error.message}`)

  return {
    id: data.id,
    tenantId: data.tenant_id,
    name: data.name,
    status: data.status,
    channels: data.channels,
    budget: data.budget,
    aiStrategy: data.ai_strategy,
    kpis: data.kpis,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  }
}
