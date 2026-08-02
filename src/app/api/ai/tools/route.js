import { NextResponse } from 'next/server'
import { getAuth } from '@/lib/auth'
import { toolCatalog, toolExecution } from '@/core/ai/toolCatalog'

export async function GET() {
  const { userId } = await getAuth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return NextResponse.json({
    version: 'v0',
    domain: 'txlio-timeline',
    execute: toolExecution,
    tools: toolCatalog,
  })
}
