import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { processContract } from '@/core/processContract'

const UPLOAD_DIR = join(process.cwd(), 'uploads')

// GET /api/timeline/:id — load a transaction's timeline entries
export async function GET(request, { params }) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = params
    const filePath = join(UPLOAD_DIR, `${id}.pdf`)

    // Re-process from the stored PDF
    // TODO: replace with Supabase DB lookup in next sprint
    const result = await processContract(filePath)

    return NextResponse.json({
      id,
      propertyAddress: result.propertyAddress,
      contractTitle: result.contractTitle,
      entries: result.entries,
    })
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
