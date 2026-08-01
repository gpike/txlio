const { execFile } = require('child_process')
const fs = require('fs/promises')
const os = require('os')
const path = require('path')
const { createWorker } = require('tesseract.js')

// Resolution for page rendering — 200 dpi is plenty for Tesseract.
const DPI = 200

function runPdftoppm(pdfPath, outputPrefix, pageNumber) {
  return new Promise((resolve, reject) => {
    execFile(
      'pdftoppm',
      [
        '-r',
        String(DPI),
        '-png',
        '-f',
        String(pageNumber),
        '-l',
        String(pageNumber),
        pdfPath,
        outputPrefix,
      ],
      (error) => {
        if (error) {
          reject(error)
        } else {
          resolve()
        }
      },
    )
  })
}

async function findRenderedPng(dir) {
  const entries = await fs.readdir(dir)
  const png = entries.find((name) => name.endsWith('.png'))
  if (!png) {
    throw new Error(`pdftoppm produced no PNG in ${dir}`)
  }
  return path.join(dir, png)
}

async function getPageCount(pdfPath) {
  const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs')
  const buffer = await fs.readFile(pdfPath)
  const pdf = await pdfjs.getDocument({ data: new Uint8Array(buffer) }).promise
  const count = pdf.numPages
  await pdf.destroy()
  return count
}

async function ocrBuffer(pngBuffer, worker) {
  const {
    data: { text },
  } = await worker.recognize(pngBuffer)
  return text
}

// Common OCR misreadings of month names in dates like "way 6, 2026"
const OCR_MONTH_CORRECTIONS = [
  // "May" is most commonly misread as "way" or "Nay"
  [/\bway\b(?=\s+\d{1,2}[,\s])/gi, 'May'],
  [/\bNay\b(?=\s+\d{1,2}[,\s])/gi, 'May'],
  // Other common misreadings
  [/\bTune\b(?=\s+\d{1,2}[,\s])/gi, 'June'],
  [/\bune\b(?=\s+\d{1,2}[,\s])/gi, 'June'],
  [/\bsume\b(?=\s+\d{1,2}[,\s])/gi, 'June'],
  [/\bTuly\b(?=\s+\d{1,2}[,\s])/gi, 'July'],
  [/\bTanuary\b(?=\s+\d{1,2}[,\s])/gi, 'January'],
  [/\bTebruary\b(?=\s+\d{1,2}[,\s])/gi, 'February'],
  [/\b0ctober\b(?=\s+\d{1,2}[,\s])/gi, 'October'],
]

function correctOcrMonths(text) {
  let result = text
  for (const [pattern, replacement] of OCR_MONTH_CORRECTIONS) {
    result = result.replace(pattern, replacement)
  }
  return result
}

function buildPageText(rawText) {
  const corrected = correctOcrMonths(rawText)
  const lines = corrected
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  return {
    lines,
    text: lines.join('\n'),
  }
}

async function extractTextFromPdfWithOcr(filePath) {
  const pageCount = await getPageCount(filePath)
  const worker = await createWorker('eng')
  const pages = []

  try {
    for (let pageNumber = 1; pageNumber <= pageCount; pageNumber += 1) {
      const pageDir = await fs.mkdtemp(path.join(os.tmpdir(), 'elevate-ocr-'))

      try {
        const outputPrefix = path.join(pageDir, 'page')
        await runPdftoppm(filePath, outputPrefix, pageNumber)
        const pngPath = await findRenderedPng(pageDir)
        const pngBuffer = await fs.readFile(pngPath)
        const rawText = await ocrBuffer(pngBuffer, worker)
        const { lines, text } = buildPageText(rawText)
        pages.push({ pageNumber, lines, text })
      } finally {
        await fs.rm(pageDir, { recursive: true, force: true }).catch(() => {})
      }
    }
  } finally {
    await worker.terminate()
  }

  return {
    pageCount,
    pages,
    text: pages.map((page) => page.text).join('\n\n'),
  }
}

module.exports = { extractTextFromPdfWithOcr }
