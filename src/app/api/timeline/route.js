import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { randomUUID } from 'crypto'
import { processContract } from '@/core/processContract'

const UPLOAD_DIR = join(process.cwd(), 'uploads')

export async function POST(request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const formData = await request.formData()
    const file = formData.get('contract')

    if (!file || file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'A PDF file is required' }, { status: 400 })
    }

    // Save uploaded file temporarily
    await mkdir(UPLOAD_DIR, { recursive: true })
    const id = randomUUID()
    const filePath = join(UPLOAD_DIR, `${id}.pdf`)
    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(filePath, buffer)

    // Run the core pipeline (ported from Elevate)
    const result = await processContract(filePath)

    // TODO: persist to Supabase in next sprint
    // For now return the parsed result with a generated ID
    return NextResponse.json({
      id,
      propertyAddress: result.propertyAddress,
      contractTitle: result.contractTitle,
      entries: result.entries,
      pageCount: result.pageCount,
    })
  } catch (err) {
    console.error('Timeline POST error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
