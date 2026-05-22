import { NextRequest, NextResponse } from 'next/server'
import { createAdminSupabaseClient } from '@/lib/db/supabase'
import type { OnboardingData } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const data = await req.json() as OnboardingData

    // TODO: extract tenantId from Clerk session
    const tenantId = 'demo-tenant'

    const supabase = createAdminSupabaseClient()
    await supabase.from('onboarding_data').upsert({
      tenant_id: tenantId,
      step_data: data,
      completed_steps: [1, 2, 3, 4, 5],
      is_complete: true,
    }, { onConflict: 'tenant_id' })

    // Trigger brand generation async (would use BullMQ in production)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Onboarding error:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to save onboarding data' },
      { status: 500 }
    )
  }
}
