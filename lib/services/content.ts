import { callAI } from '@/lib/ai/anthropic'
import { getBrandBoard } from '@/lib/services/brand'
import { createAdminSupabaseClient } from '@/lib/db/supabase'
import type { ContentType } from '@/types'

interface ContentGenerationParams {
  tenantId: string
  type: ContentType
  topic: string
  additionalContext?: string
  targetPlatform?: string
}

const CONTENT_PROMPTS: Record<ContentType, string> = {
  ad_copy: `Generate compelling ad copy for the following brief. Include headline, primary text, and CTA. Return 3 variations.`,
  social_post: `Create engaging social media posts. Return 5 variations with appropriate hashtags.`,
  email: `Write a professional email. Include subject line, preheader, and body with clear CTA.`,
  blog_post: `Write a comprehensive, SEO-optimized blog post with introduction, 3-5 sections with H2 headers, and conclusion.`,
  presentation: `Create a presentation outline with slide titles and key bullet points for each slide (8-12 slides).`,
  sms: `Write concise SMS messages (under 160 chars). Return 3 variations with clear CTA.`,
}

export async function generateContent(params: ContentGenerationParams): Promise<string> {
  const brandBoard = await getBrandBoard(params.tenantId)

  const brandContext = brandBoard
    ? `\n\nBRAND CONTEXT:\nCompany: ${brandBoard.companyName}\nIndustry: ${brandBoard.industry}\nBrand Voice:\n${brandBoard.brandVoice}\nBrand Personality: ${brandBoard.brandPersonality?.join(', ')}\n`
    : ''

  const basePrompt = CONTENT_PROMPTS[params.type]
  const userPrompt = `${basePrompt}${brandContext}

TOPIC/BRIEF: ${params.topic}
${params.targetPlatform ? `PLATFORM: ${params.targetPlatform}` : ''}
${params.additionalContext ? `ADDITIONAL CONTEXT: ${params.additionalContext}` : ''}`

  const result = await callAI({
    tenantId: params.tenantId,
    moduleName: `content_${params.type}`,
    userPrompt,
    maxTokens: 3000,
  })

  return result.content
}

export async function saveContentItem(
  tenantId: string,
  type: ContentType,
  title: string,
  body: string,
  metadata?: Record<string, unknown>
) {
  const supabase = createAdminSupabaseClient()

  const { data, error } = await supabase
    .from('content_items')
    .insert({
      tenant_id: tenantId,
      type,
      title,
      body,
      metadata,
      status: 'draft',
    })
    .select()
    .single()

  if (error) throw new Error(`Failed to save content: ${error.message}`)
  return data
}

export async function getContentItems(tenantId: string, type?: ContentType) {
  const supabase = createAdminSupabaseClient()

  let query = supabase
    .from('content_items')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false })

  if (type) query = query.eq('type', type)

  const { data, error } = await query
  if (error) throw new Error(`Failed to fetch content: ${error.message}`)
  return data ?? []
}

export async function generateSocialCalendar(tenantId: string, month: string): Promise<object[]> {
  const brandBoard = await getBrandBoard(tenantId)

  const prompt = `Generate a 30-day social media content calendar for ${month}.

${brandBoard ? `Company: ${brandBoard.companyName}, Industry: ${brandBoard.industry}` : ''}

Return a JSON array of 30 objects, each with:
- day: number (1-30)
- platform: "instagram" | "linkedin" | "twitter" | "facebook"
- caption: string
- hashtags: string[]
- contentType: "educational" | "promotional" | "engagement" | "behind_scenes" | "testimonial"
- topic: string`

  const result = await callAI({
    tenantId,
    moduleName: 'content_social_calendar',
    userPrompt: prompt,
    maxTokens: 8000,
    modelId: 'claude-sonnet-4-6',
  })

  const jsonMatch = result.content.match(/```json\n?([\s\S]*?)\n?```/)
    ?? result.content.match(/(\[[\s\S]*\])/)

  if (!jsonMatch) return []
  return JSON.parse(jsonMatch[1]) as object[]
}
