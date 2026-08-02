import { NextResponse } from 'next/server'
import { join } from 'path'
import { exportTimelinePdf } from '@/core/exportTimelinePdf'
import { readFile, mkdir } from 'fs/promises'
import { getAuth } from '@/lib/auth'

const UPLOAD_DIR = join(process.cwd(), 'uploads')

// POST /api/timeline/:id/process — export PDF with reviewed entries
export async function POST(request, { params }) {
  const { userId } = await getAuth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { id } = params
    const { entries } = await request.json()

    const outputPath = join(UPLOAD_DIR, `${id}-timeline.pdf`)

    await exportTimelinePdf({
      outputPath,
      entries,
      contractTitle: `Transaction ${id}`,
      sourceFile: join(UPLOAD_DIR, `${id}.pdf`),
      templateId: 'janelle-mcgill', // TODO: pull from org settings
      propertyAddress: entries[0]?.sourceSnippet || '',
    })

    const pdfBuffer = await readFile(outputPath)

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="timeline-${id}.pdf"`,
      },
    })
  } catch (err) {
    console.error('Export error:', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
