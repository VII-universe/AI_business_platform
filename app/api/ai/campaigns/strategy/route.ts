import { NextRequest, NextResponse } from 'next/server'
import { createCampaign } from '@/lib/services/campaigns'
import type { CampaignChannel } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { objective, budget, duration, targetAudience, channels } = body

    const tenantId = 'demo-tenant'

    if (!objective || !budget || !channels?.length) {
      return NextResponse.json({ error: 'objective, budget, and channels are required' }, { status: 400 })
    }

    const campaign = await createCampaign(tenantId, {
      objective,
      budget: Number(budget),
      duration: Number(duration) || 30,
      targetAudience: targetAudience ?? '',
      channels: channels as CampaignChannel[],
    })

    return NextResponse.json({ campaign })
  } catch (err) {
    console.error('Campaign creation error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Creation failed' },
      { status: 500 }
    )
  }
}
