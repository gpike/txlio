import { NextResponse } from 'next/server'
import { getAuth } from '@/lib/auth'

function jsonError(message, status = 400) {
  return NextResponse.json({ error: message }, { status })
}

function decodeBase64Pdf(input) {
  if (typeof input !== 'string' || input.length === 0) {
    throw new Error('contractBase64 is required')
  }

  const normalized = input.includes(',') ? input.split(',').pop() : input
  return Buffer.from(normalized, 'base64')
}

async function executeUploadContract(request, input) {
  const pdfBuffer = decodeBase64Pdf(input?.contractBase64)
  const fileName = input?.fileName || 'contract.pdf'
  const blob = new Blob([pdfBuffer], { type: 'application/pdf' })
  const formData = new FormData()
  formData.set('contract', blob, fileName)

  const response = await fetch(`${request.nextUrl.origin}/api/timeline`, {
    method: 'POST',
    headers: {
      cookie: request.headers.get('cookie') || '',
    },
    body: formData,
  })

  const payload = await response.json().catch(() => ({ error: 'Invalid timeline response' }))
  return NextResponse.json(payload, { status: response.status })
}

async function executeGetTimeline(request, input) {
  const id = input?.id
  if (!id || typeof id !== 'string') {
    return jsonError('id is required')
  }

  const response = await fetch(`${request.nextUrl.origin}/api/timeline/${encodeURIComponent(id)}`, {
    method: 'GET',
    headers: {
      cookie: request.headers.get('cookie') || '',
    },
  })

  const payload = await response.json().catch(() => ({ error: 'Invalid timeline response' }))
  return NextResponse.json(payload, { status: response.status })
}

async function executeExportTimelinePdf(request, input) {
  const id = input?.id
  const entries = input?.entries

  if (!id || typeof id !== 'string') {
    return jsonError('id is required')
  }

  if (!Array.isArray(entries)) {
    return jsonError('entries must be an array')
  }

  const response = await fetch(`${request.nextUrl.origin}/api/timeline/${encodeURIComponent(id)}/process`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      cookie: request.headers.get('cookie') || '',
    },
    body: JSON.stringify({ entries }),
  })

  if (!response.ok) {
    const payload = await response.json().catch(() => ({ error: 'Export failed' }))
    return NextResponse.json(payload, { status: response.status })
  }

  const pdfBuffer = Buffer.from(await response.arrayBuffer())
  return NextResponse.json({
    id,
    mimeType: 'application/pdf',
    fileName: `timeline-${id}.pdf`,
    contentBase64: pdfBuffer.toString('base64'),
  })
}

export async function POST(request) {
  const { userId } = await getAuth()
  if (!userId) return jsonError('Unauthorized', 401)

  let payload
  try {
    payload = await request.json()
  } catch {
    return jsonError('Invalid JSON body')
  }

  const tool = payload?.tool
  const input = payload?.input || {}

  if (!tool || typeof tool !== 'string') {
    return jsonError('tool is required')
  }

  try {
    switch (tool) {
      case 'upload_contract':
        return await executeUploadContract(request, input)
      case 'get_timeline':
        return await executeGetTimeline(request, input)
      case 'export_timeline_pdf':
        return await executeExportTimelinePdf(request, input)
      default:
        return jsonError(`Unknown tool: ${tool}`)
    }
  } catch (error) {
    return jsonError(error.message || 'Tool execution failed', 500)
  }
}
