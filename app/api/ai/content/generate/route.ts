import { NextRequest, NextResponse } from 'next/server'
import { generateContent } from '@/lib/services/content'
import type { ContentType } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { type, topic, targetPlatform, additionalContext } = body

    // TODO: extract tenantId from Clerk session
    const tenantId = 'demo-tenant'

    if (!type || !topic) {
      return NextResponse.json({ error: 'type and topic are required' }, { status: 400 })
    }

    const content = await generateContent({
      tenantId,
      type: type as ContentType,
      topic,
      targetPlatform,
      additionalContext,
    })

    return NextResponse.json({ content })
  } catch (err) {
    console.error('Content generation error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Generation failed' },
      { status: 500 }
    )
  }
}
