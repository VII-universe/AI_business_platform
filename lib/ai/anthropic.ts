import Anthropic from '@anthropic-ai/sdk'
import { createAdminSupabaseClient } from '@/lib/db/supabase'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

interface AICallOptions {
  tenantId: string
  moduleName: string
  modelId?: string
  systemPrompt?: string
  userPrompt: string
  temperature?: number
  maxTokens?: number
}

interface AICallResult {
  content: string
  usage: {
    promptTokens: number
    completionTokens: number
    costUsd: number
  }
}

const MODEL_COSTS: Record<string, { input: number; output: number }> = {
  'claude-opus-4-5': { input: 15 / 1_000_000, output: 75 / 1_000_000 },
  'claude-sonnet-4-5': { input: 3 / 1_000_000, output: 15 / 1_000_000 },
  'claude-haiku-4-5': { input: 0.25 / 1_000_000, output: 1.25 / 1_000_000 },
  'claude-sonnet-4-6': { input: 3 / 1_000_000, output: 15 / 1_000_000 },
}

async function getModelConfig(tenantId: string, moduleName: string) {
  const supabase = createAdminSupabaseClient()

  // Try tenant-specific config first, fall back to global
  const { data } = await supabase
    .from('model_configs')
    .select('*')
    .eq('module_name', moduleName)
    .eq('is_active', true)
    .or(`tenant_id.eq.${tenantId},tenant_id.is.null`)
    .order('tenant_id', { ascending: false, nullsFirst: false })
    .limit(1)
    .single()

  return data
}

async function logAICall(params: {
  tenantId: string
  moduleName: string
  modelId: string
  promptTokens: number
  completionTokens: number
  costUsd: number
  latencyMs: number
  success: boolean
  error?: string
}) {
  const supabase = createAdminSupabaseClient()
  await supabase.from('ai_audit_log').insert({
    tenant_id: params.tenantId,
    module_name: params.moduleName,
    model_id: params.modelId,
    prompt_tokens: params.promptTokens,
    completion_tokens: params.completionTokens,
    cost_usd: params.costUsd,
    latency_ms: params.latencyMs,
    success: params.success,
    error: params.error,
  })
}

export async function callAI(options: AICallOptions): Promise<AICallResult> {
  const config = await getModelConfig(options.tenantId, options.moduleName)

  const modelId = options.modelId ?? config?.model_id ?? 'claude-sonnet-4-6'
  const systemPrompt = options.systemPrompt ?? config?.system_prompt
  const temperature = options.temperature ?? config?.temperature ?? 0.7
  const maxTokens = options.maxTokens ?? config?.max_tokens ?? 2048

  const startTime = Date.now()
  let success = true
  let errorMsg: string | undefined

  try {
    const messages: Anthropic.MessageParam[] = [
      { role: 'user', content: options.userPrompt },
    ]

    const response = await anthropic.messages.create({
      model: modelId,
      max_tokens: maxTokens,
      temperature,
      ...(systemPrompt && { system: systemPrompt }),
      messages,
    })

    const latencyMs = Date.now() - startTime
    const costs = MODEL_COSTS[modelId] ?? MODEL_COSTS['claude-sonnet-4-6']
    const promptTokens = response.usage.input_tokens
    const completionTokens = response.usage.output_tokens
    const costUsd = promptTokens * costs.input + completionTokens * costs.output

    await logAICall({
      tenantId: options.tenantId,
      moduleName: options.moduleName,
      modelId,
      promptTokens,
      completionTokens,
      costUsd,
      latencyMs,
      success: true,
    })

    const content = response.content[0].type === 'text' ? response.content[0].text : ''

    return {
      content,
      usage: { promptTokens, completionTokens, costUsd },
    }
  } catch (err) {
    success = false
    errorMsg = err instanceof Error ? err.message : String(err)

    await logAICall({
      tenantId: options.tenantId,
      moduleName: options.moduleName,
      modelId,
      promptTokens: 0,
      completionTokens: 0,
      costUsd: 0,
      latencyMs: Date.now() - startTime,
      success: false,
      error: errorMsg,
    })

    throw err
  }
}

export async function callAIWithStructuredOutput<T>(
  options: AICallOptions & { schema: string }
): Promise<T> {
  const result = await callAI({
    ...options,
    userPrompt: `${options.userPrompt}\n\nRespond ONLY with valid JSON matching this schema:\n${options.schema}`,
  })

  const jsonMatch = result.content.match(/```json\n?([\s\S]*?)\n?```/)
    ?? result.content.match(/(\{[\s\S]*\})/)

  if (!jsonMatch) throw new Error('AI did not return valid JSON')

  return JSON.parse(jsonMatch[1]) as T
}
