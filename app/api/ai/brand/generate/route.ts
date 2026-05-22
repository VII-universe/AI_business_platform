import { NextRequest, NextResponse } from 'next/server'
import { createBrandBoard } from '@/lib/services/brand'
import type { OnboardingData } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { onboardingData } = body as { onboardingData: OnboardingData }

    // TODO: extract tenantId from Clerk session
    const tenantId = 'demo-tenant'

    if (!onboardingData) {
      return NextResponse.json({ error: 'onboardingData is required' }, { status: 400 })
    }

    const brandBoard = await createBrandBoard(tenantId, onboardingData)
    return NextResponse.json({ brandBoard })
  } catch (err) {
    console.error('Brand generation error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Generation failed' },
      { status: 500 }
    )
  }
}
