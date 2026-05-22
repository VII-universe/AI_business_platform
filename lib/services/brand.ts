import { callAI, callAIWithStructuredOutput } from '@/lib/ai/anthropic'
import { generateLogo } from '@/lib/ai/replicate'
import { createAdminSupabaseClient } from '@/lib/db/supabase'
import type { BrandBoard, OnboardingData } from '@/types'

interface BrandStrategyOutput {
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    text: string
  }
  fonts: { heading: string; body: string }
  brandVoice: string
  brandPersonality: string[]
  tagline: string
  positioning: string
}

const BRAND_STRATEGY_SCHEMA = `{
  "colors": {
    "primary": "hex color string",
    "secondary": "hex color string",
    "accent": "hex color string",
    "background": "hex color string",
    "text": "hex color string"
  },
  "fonts": {
    "heading": "Google Font name",
    "body": "Google Font name"
  },
  "brandVoice": "markdown string describing tone, vocabulary, dos and don'ts",
  "brandPersonality": ["array", "of", "adjectives"],
  "tagline": "brand tagline string",
  "positioning": "one paragraph brand positioning statement"
}`

export async function generateBrandStrategy(
  tenantId: string,
  onboarding: OnboardingData
): Promise<BrandStrategyOutput> {
  const prompt = `You are a world-class brand strategist. Create a complete brand identity for:

Company: ${onboarding.step1.companyName}
Industry: ${onboarding.step1.industry}
Company size: ${onboarding.step1.companySize}
Website: ${onboarding.step1.website || 'N/A'}

Business goals: ${onboarding.step2.goals.join(', ')}
Primary goal: ${onboarding.step2.primaryGoal}

Target audience:
- Age: ${onboarding.step3.targetAge}
- Locations: ${onboarding.step3.targetLocations.join(', ')}
- Interests: ${onboarding.step3.targetInterests.join(', ')}
- Pain points: ${onboarding.step3.painPoints.join(', ')}

Brand style preferences:
- Tone: ${onboarding.step5.tone}
- Preferred colors: ${onboarding.step5.preferredColors.join(', ')}
- Reference brands: ${onboarding.step5.referencesBrands.join(', ')}
- Personality traits desired: ${onboarding.step5.personality.join(', ')}

Generate a complete brand strategy including color palette, typography, brand voice, and positioning.`

  return callAIWithStructuredOutput<BrandStrategyOutput>({
    tenantId,
    moduleName: 'brand_strategy',
    userPrompt: prompt,
    schema: BRAND_STRATEGY_SCHEMA,
    maxTokens: 4096,
  })
}

export async function createBrandBoard(
  tenantId: string,
  onboarding: OnboardingData
): Promise<BrandBoard> {
  const supabase = createAdminSupabaseClient()

  // Generate brand strategy via Claude
  const strategy = await generateBrandStrategy(tenantId, onboarding)

  // Generate logos via Replicate
  const logoVariants = await generateLogo({
    companyName: onboarding.step1.companyName,
    industry: onboarding.step1.industry,
    style: onboarding.step5.tone,
    colors: [strategy.colors.primary, strategy.colors.secondary],
    personality: strategy.brandPersonality,
  })

  const brandBoard = {
    tenant_id: tenantId,
    company_name: onboarding.step1.companyName,
    logo_url: logoVariants[0] ?? '',
    logo_variants: logoVariants,
    colors: strategy.colors,
    fonts: strategy.fonts,
    brand_voice: strategy.brandVoice,
    brand_personality: strategy.brandPersonality,
    industry: onboarding.step1.industry,
    target_audience: JSON.stringify(onboarding.step3),
  }

  const { data, error } = await supabase
    .from('brand_boards')
    .upsert(brandBoard, { onConflict: 'tenant_id' })
    .select()
    .single()

  if (error) throw new Error(`Failed to save brand board: ${error.message}`)

  return {
    id: data.id,
    tenantId: data.tenant_id,
    companyName: data.company_name,
    logoUrl: data.logo_url,
    logoVariants: data.logo_variants,
    colors: data.colors,
    fonts: data.fonts,
    brandVoice: data.brand_voice,
    brandPersonality: data.brand_personality,
    industry: data.industry,
    targetAudience: data.target_audience,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  }
}

export async function getBrandBoard(tenantId: string): Promise<BrandBoard | null> {
  const supabase = createAdminSupabaseClient()

  const { data } = await supabase
    .from('brand_boards')
    .select('*')
    .eq('tenant_id', tenantId)
    .single()

  if (!data) return null

  return {
    id: data.id,
    tenantId: data.tenant_id,
    companyName: data.company_name,
    logoUrl: data.logo_url,
    logoVariants: data.logo_variants,
    colors: data.colors,
    fonts: data.fonts,
    brandVoice: data.brand_voice,
    brandPersonality: data.brand_personality,
    industry: data.industry,
    targetAudience: data.target_audience,
    guidelinesPdfUrl: data.guidelines_pdf_url,
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at),
  }
}
